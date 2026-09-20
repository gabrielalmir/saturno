<?php

namespace App\Modules\WorkManagement\Infrastructure\Auth;

use App\Modules\WorkManagement\Application\Ports\Auth\CurrentUserProvider;
use Illuminate\Http\Request;

class LaravelCurrentUserProvider implements CurrentUserProvider
{
    public function __construct(private Request $request) {}

    public function userId(): int
    {
        /** @var \App\Models\User $user */
        $user = $this->request->user();

        return (int) $user->id;
    }

    public function organizationId(): int
    {
        /** @var \App\Models\User $user */
        $user = $this->request->user();

        return (int) $user->current_organization_id;
    }
}
