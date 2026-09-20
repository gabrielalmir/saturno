<?php

namespace App\Modules\WorkManagement\Infrastructure\Persistence\Eloquent;

use App\Modules\WorkManagement\Application\Ports\Repositories\OrganizationMembershipRepository;
use Illuminate\Support\Facades\DB;

class EloquentOrganizationMembershipRepository implements OrganizationMembershipRepository
{
    public function isMember(int $organizationId, int $userId): bool
    {
        return DB::table('organization_user')
            ->where('organization_id', $organizationId)
            ->where('user_id', $userId)
            ->exists();
    }
}
