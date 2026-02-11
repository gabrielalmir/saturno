<?php

namespace App\Modules\WorkManagement\Domain\Exceptions;

class MissingAssignee extends DomainException
{
    public function __construct()
    {
        parent::__construct('Defina um responsável antes de iniciar o trabalho.');
    }
}
