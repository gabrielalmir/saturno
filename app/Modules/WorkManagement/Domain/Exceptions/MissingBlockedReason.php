<?php

namespace App\Modules\WorkManagement\Domain\Exceptions;

class MissingBlockedReason extends DomainException
{
    public function __construct()
    {
        parent::__construct('Informe o motivo do bloqueio ao mover o item para Bloqueado.');
    }
}
