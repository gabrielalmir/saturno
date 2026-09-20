<?php

namespace App\Modules\WorkManagement\Application\Ports\Repositories;

use App\Modules\WorkManagement\Domain\Sprints\Sprint;

interface SprintRepository
{
    public function findForOrg(int $organizationId, int $id): ?Sprint;

    public function findActiveForOrg(int $organizationId): ?Sprint;
}
