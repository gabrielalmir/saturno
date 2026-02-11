<?php

namespace App\Modules\WorkManagement\Application\Ports\Repositories;

interface EpicRepository
{
    public function existsForOrg(int $organizationId, int $epicId): bool;
}
