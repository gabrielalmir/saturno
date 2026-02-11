<?php

namespace App\Modules\WorkManagement\Application\Ports\Repositories;

interface WorkItemEventRepository
{
    public function record(int $organizationId, int $workItemId, ?int $userId, string $type, ?array $payload = null): void;
}
