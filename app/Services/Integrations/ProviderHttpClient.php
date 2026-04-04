<?php

namespace App\Services\Integrations;

use Illuminate\Support\Facades\Http;
use Psr\Log\LoggerInterface;

class ProviderHttpClient
{
    public function __construct(private LoggerInterface $logger) {}

    public function get(string $url, array $options = [], array $redactHeaders = ['Authorization']): object
    {
        return $this->request('get', $url, $options, $redactHeaders);
    }

    public function post(string $url, array $options = [], array $redactHeaders = ['Authorization']): object
    {
        return $this->request('post', $url, $options, $redactHeaders);
    }

    private function request(string $method, string $url, array $options, array $redactHeaders): object
    {
        $timeout = $options['timeout'] ?? 10;
        $connectTimeout = $options['connect_timeout'] ?? 5;
        $headers = $options['headers'] ?? [];
        $query = $options['query'] ?? [];
        $body = $options['body'] ?? $options['json'] ?? [];

        // Never log secrets
        $safeHeaders = $headers;
        foreach ($redactHeaders as $header) {
            if (isset($safeHeaders[$header])) {
                $safeHeaders[$header] = '[redacted]';
            }
        }
        $safeQuery = $query;
        foreach (['token', 'key'] as $q) {
            if (isset($safeQuery[$q])) {
                $safeQuery[$q] = '[redacted]';
            }
        }

        try {
            $client = Http::timeout($timeout)
                ->connectTimeout($connectTimeout)
                ->withHeaders($headers);

            if (config('services.http_verify') === false) {
                $client->withoutVerifying();
            }

            if ($method === 'get') {
                $response = $client->get($url, $query);
            } elseif ($method === 'post') {
                $finalUrl = $query ? $url.'?'.http_build_query($query) : $url;
                $response = $client->post($finalUrl, $body);
            } else {
                $response = $client->{$method}($url, $body);
            }

            return (object) [
                'status' => $response->status(),
                'ok' => $response->successful(),
                'json' => fn () => $response->json(),
                'body' => $response->body(),
            ];
        } catch (\Throwable $e) {
            $this->logger->warning('Integration HTTP error', [
                'url' => $url,
                'headers' => $safeHeaders,
                'query' => $safeQuery,
                'error' => $e->getMessage(),
            ]);

            return (object) [
                'status' => 500,
                'ok' => false,
                'json' => fn () => null,
                'body' => null,
                'error' => $e->getMessage(),
            ];
        }
    }
}
