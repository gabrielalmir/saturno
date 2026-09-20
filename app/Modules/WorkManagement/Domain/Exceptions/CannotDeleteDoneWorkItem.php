<?php

namespace App\Modules\WorkManagement\Domain\Exceptions;

class CannotDeleteDoneWorkItem extends DomainException
{
    public function __construct()
    {
        parent::__construct('Itens concluídos não podem ser excluídos.');
    }
}
