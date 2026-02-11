<?php

namespace App\Services\Integrations\Connectors;

use App\Models\Integration;
use App\Models\IntegrationLink;
use App\Models\WorkItem;
use App\Services\Integrations\ConnectionResult;
use App\Services\Integrations\IntegrationConnector;
use App\Services\Integrations\ProviderHttpClient;
use App\Services\Integrations\SyncResult;

abstract class BaseConnector implements IntegrationConnector
{
    public function __construct(protected ProviderHttpClient $http) {}

    public function validateCredentials(array $config): void
    {
        if (empty($config['token'])) {
            throw new \InvalidArgumentException('Token obrigatorio.');
        }
    }

    public function testConnection(Integration $integration): ConnectionResult
    {
        // Default fallback to ok=true; concrete connectors should override.
        return new ConnectionResult(true, 'Test placeholder');
    }

    public function importItems(Integration $integration): SyncResult
    {
        return new SyncResult('partial', ['imported' => 0], 'Not implemented');
    }

    public function exportItems(Integration $integration): SyncResult
    {
        return new SyncResult('partial', ['exported' => 0], 'Not implemented');
    }

    public function syncDelta(Integration $integration): SyncResult
    {
        return new SyncResult('partial', [], 'Not implemented');
    }

    public function mapRemoteToLocal(array $remote): array
    {
        return [
            'title' => $remote['title'] ?? '[sem titulo]',
            'description' => $remote['description'] ?? null,
            'status' => $remote['status'] ?? 'backlog',
            'priority' => $remote['priority'] ?? 'P2',
            'due_date' => $remote['due_date'] ?? null,
            'assignee_remote' => $remote['assignee'] ?? null,
            'labels' => $remote['labels'] ?? [],
        ];
    }

    public function mapLocalToRemote(WorkItem $item, ?IntegrationLink $link = null): array
    {
        return [
            'title' => $item->title,
            'description' => $item->description,
            'status' => $item->status,
            'priority' => $item->priority,
            'due_date' => $item->due_date,
            'assignee' => $item->assignee?->email,
            'labels' => [],
        ];
    }
}
