<?php

namespace App\Modules\WorkManagement\Application\Ports\Repositories;

interface OrganizationMembershipRepository
{
    public function isMember(int $organizationId, int $userId): bool;
}
