<?php

namespace App\Modules\WorkManagement\Domain\Exceptions;

class WipLimitExceeded extends DomainException
{
    public function __construct(public readonly int $current, public readonly int $limit)
    {
        parent::__construct("WIP limit atingido para Em Progresso ({$current}/{$limit}).");
    }
}
