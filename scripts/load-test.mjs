#!/usr/bin/env node
/**
 * Minimal load test runner (no external deps) aimed at "active users" style load.
 *
 * Defaults:
 *   TARGET_URL=http://127.0.0.1:8080/health
 *   VUS=1000
 *   DURATION_SECONDS=30
 *   RAMP_SECONDS=10
 *
 * Notes:
 * - Each VU runs a simple loop: request -> record latency -> repeat until deadline.
 * - Uses Node 18+ built-in fetch (undici) for reasonable performance and keep-alive.
 * - Keeps a bounded latency sample to compute percentiles without unbounded memory.
 */

import { performance } from "node:perf_hooks";

const TARGET_URL = process.env.TARGET_URL ?? "http://127.0.0.1:8080/health";
const VUS = Number.parseInt(process.env.VUS ?? "1000", 10);
const DURATION_SECONDS = Number.parseInt(process.env.DURATION_SECONDS ?? "30", 10);
const RAMP_SECONDS = Number.parseInt(process.env.RAMP_SECONDS ?? "10", 10);

if (!Number.isFinite(VUS) || VUS <= 0) throw new Error("VUS must be a positive integer");
if (!Number.isFinite(DURATION_SECONDS) || DURATION_SECONDS <= 0) {
  throw new Error("DURATION_SECONDS must be a positive integer");
}
if (!Number.isFinite(RAMP_SECONDS) || RAMP_SECONDS < 0) throw new Error("RAMP_SECONDS must be >= 0");

// Bounded reservoir to avoid OOM on high RPS.
const MAX_LAT_SAMPLE = 200_000;
const latSampleMs = [];
let latSeen = 0;

function maybeSampleLatency(ms) {
  latSeen += 1;
  if (latSampleMs.length < MAX_LAT_SAMPLE) {
    latSampleMs.push(ms);
    return;
  }
  // Reservoir sampling: replace existing elements with decreasing probability.
  const j = Math.floor(Math.random() * latSeen);
  if (j < MAX_LAT_SAMPLE) latSampleMs[j] = ms;
}

let ok = 0;
let fail = 0;
let bytes = 0;
let minMs = Infinity;
let maxMs = 0;
let sumMs = 0;

const start = performance.now();
const deadline = start + DURATION_SECONDS * 1000;

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function vuLoop(vuId, vuStartDelayMs) {
  if (vuStartDelayMs > 0) await sleep(vuStartDelayMs);
  while (performance.now() < deadline) {
    const t0 = performance.now();
    try {
      const res = await fetch(TARGET_URL, { method: "GET" });
      // Drain body to avoid backpressure/connection reuse issues.
      const buf = await res.arrayBuffer();
      const t1 = performance.now();

      const ms = t1 - t0;
      maybeSampleLatency(ms);
      sumMs += ms;
      minMs = Math.min(minMs, ms);
      maxMs = Math.max(maxMs, ms);

      if (res.ok) ok += 1;
      else fail += 1;
      bytes += buf.byteLength;
    } catch {
      const t1 = performance.now();
      const ms = t1 - t0;
      maybeSampleLatency(ms);
      sumMs += ms;
      minMs = Math.min(minMs, ms);
      maxMs = Math.max(maxMs, ms);
      fail += 1;
    }
  }
}

function percentile(sorted, p) {
  if (sorted.length === 0) return NaN;
  const idx = Math.min(sorted.length - 1, Math.max(0, Math.floor(p * (sorted.length - 1))));
  return sorted[idx];
}

const rampMs = RAMP_SECONDS * 1000;
const vus = [];
for (let i = 0; i < VUS; i += 1) {
  const delay = rampMs > 0 ? Math.floor((i / VUS) * rampMs) : 0;
  vus.push(vuLoop(i + 1, delay));
}

const isoStart = new Date().toISOString();
process.stdout.write(
  [
    `load-test start=${isoStart}`,
    `target=${TARGET_URL}`,
    `vus=${VUS}`,
    `duration_seconds=${DURATION_SECONDS}`,
    `ramp_seconds=${RAMP_SECONDS}`,
    "",
  ].join("\n"),
);

await Promise.allSettled(vus);

const end = performance.now();
const elapsedSeconds = (end - start) / 1000;
const total = ok + fail;
const rps = total / elapsedSeconds;
const okRps = ok / elapsedSeconds;
const avgMs = total > 0 ? sumMs / total : NaN;

latSampleMs.sort((a, b) => a - b);
const p50 = percentile(latSampleMs, 0.5);
const p95 = percentile(latSampleMs, 0.95);
const p99 = percentile(latSampleMs, 0.99);

process.stdout.write(
  [
    "",
    "results:",
    `elapsed_seconds=${elapsedSeconds.toFixed(2)}`,
    `requests_total=${total}`,
    `requests_ok=${ok}`,
    `requests_fail=${fail}`,
    `rps_total=${rps.toFixed(2)}`,
    `rps_ok=${okRps.toFixed(2)}`,
    `bytes_total=${bytes}`,
    "",
    "latency_ms:",
    `min=${Number.isFinite(minMs) ? minMs.toFixed(2) : "NaN"}`,
    `avg=${Number.isFinite(avgMs) ? avgMs.toFixed(2) : "NaN"}`,
    `p50=${Number.isFinite(p50) ? p50.toFixed(2) : "NaN"}`,
    `p95=${Number.isFinite(p95) ? p95.toFixed(2) : "NaN"}`,
    `p99=${Number.isFinite(p99) ? p99.toFixed(2) : "NaN"}`,
    `max=${Number.isFinite(maxMs) ? maxMs.toFixed(2) : "NaN"}`,
    `sample_size=${latSampleMs.length}`,
    "",
  ].join("\n"),
);

