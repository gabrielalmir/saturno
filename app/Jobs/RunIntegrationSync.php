<?php

namespace App\Jobs;

use App\Models\Integration;
use App\Models\IntegrationSyncLog;
use App\Services\Integrations\IntegrationConnectorFactory;
use App\Services\Integrations\SyncResult;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Throwable;

class RunIntegrationSync implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 3;

    public int $backoff = 5;

    public function __construct(public Integration $integration, public string $mode = 'delta') {}

    public function handle(): void
    {
        $connector = IntegrationConnectorFactory::make($this->integration->provider);
        $result = new SyncResult('failed');

        try {
            if ($this->mode === 'import') {
                $result = $connector->importItems($this->integration);
            } elseif ($this->mode === 'export') {
                $result = $connector->exportItems($this->integration);
            } else {
                $result = $connector->syncDelta($this->integration);
            }
        } catch (Throwable $e) {
            $result = new SyncResult('failed', [], $e->getMessage());
        }

        IntegrationSyncLog::create([
            'integration_id' => $this->integration->id,
            'provider' => $this->integration->provider,
            'direction' => $this->integration->direction,
            'status' => $result->status,
            'stats' => $result->stats,
            'error' => $result->error ? substr($result->error, 0, 500) : null,
        ]);

        $this->integration->update([
            'last_synced_at' => now(),
            'status' => $result->status === 'success' ? 'idle' : 'error',
            'last_error' => $result->error ? substr($result->error, 0, 500) : null,
        ]);
    }
}
