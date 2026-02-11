<?php

namespace App\Services\Integrations;

class ConnectionResult
{
    public function __construct(
        public bool $ok,
        public ?string $message = null,
    ) {}
}
