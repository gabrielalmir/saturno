<?php

namespace App\Modules\WorkManagement\Infrastructure\Persistence\Eloquent;

use App\Models\Epic;
use App\Modules\WorkManagement\Application\Ports\Repositories\EpicRepository;

class EloquentEpicRepository implements EpicRepository
{
    public function existsForOrg(int $organizationId, int $epicId): bool
    {
        return Epic::query()
            ->where('organization_id', $organizationId)
            ->where('id', $epicId)
            ->exists();
    }
}
