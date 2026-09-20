<?php

namespace App\Modules\WorkManagement\Domain\Exceptions;

use App\Modules\WorkManagement\Domain\WorkItems\WorkItemStatus;

class InvalidWorkItemTransition extends DomainException
{
    public function __construct(public readonly WorkItemStatus $from, public readonly WorkItemStatus $to)
    {
        parent::__construct("Transição inválida: {$from->value} -> {$to->value}.");
    }
}
