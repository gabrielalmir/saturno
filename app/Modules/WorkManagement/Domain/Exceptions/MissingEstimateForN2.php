<?php

namespace App\Modules\WorkManagement\Domain\Exceptions;

class MissingEstimateForN2 extends DomainException
{
    public function __construct()
    {
        parent::__construct('Itens N2 precisam de estimativa (> 0) antes de ir para Em Progresso.');
    }
}
