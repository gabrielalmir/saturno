<?php

namespace App\Modules\WorkManagement\Infrastructure\Persistence\Eloquent;

use App\Models\WorkItemEvent;
use App\Modules\WorkManagement\Application\Ports\Repositories\WorkItemEventRepository;

class EloquentWorkItemEventRepository implements WorkItemEventRepository
{
    public function record(int $organizationId, int $workItemId, ?int $userId, string $type, ?array $payload = null): void
    {
        WorkItemEvent::create([
            'organization_id' => $organizationId,
            'work_item_id' => $workItemId,
            'user_id' => $userId,
            'type' => $type,
            'payload' => $payload,
        ]);
    }
}
