<?php

namespace App\Modules\WorkManagement\Application\Ports\Auth;

interface CurrentUserProvider
{
    public function userId(): int;

    public function organizationId(): int;
}
