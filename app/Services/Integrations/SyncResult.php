<?php

namespace App\Services\Integrations;

class SyncResult
{
    public function __construct(
        public string $status, // success, partial, failed
        public array $stats = [],
        public ?string $error = null,
    ) {}
}
