<?php

namespace App\Modules\WorkManagement\Domain\Sprints;

enum SprintStatus: string
{
    case Planning = 'planning';
    case Active = 'active';
    case Completed = 'completed';
}
