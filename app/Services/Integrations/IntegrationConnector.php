<?php

namespace App\Services\Integrations;

use App\Models\Integration;
use App\Models\IntegrationLink;
use App\Models\WorkItem;

interface IntegrationConnector
{
    /** Validate credentials without external side-effects. */
    public function validateCredentials(array $config): void;

    /** Simple ping to provider */
    public function testConnection(Integration $integration): ConnectionResult;

    /** One-time import */
    public function importItems(Integration $integration): SyncResult;

    /** Export local items to remote (when supported) */
    public function exportItems(Integration $integration): SyncResult;

    /** Sync delta both directions according to integration direction */
    public function syncDelta(Integration $integration): SyncResult;

    /** Map remote payload to local shape */
    public function mapRemoteToLocal(array $remote): array;

    /** Map local model to remote payload */
    public function mapLocalToRemote(WorkItem $item, ?IntegrationLink $link = null): array;
}
