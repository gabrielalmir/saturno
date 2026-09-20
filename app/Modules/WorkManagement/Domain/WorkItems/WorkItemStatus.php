<?php

namespace App\Modules\WorkManagement\Domain\WorkItems;

enum WorkItemStatus: string
{
    case Backlog = 'backlog';
    case Ready = 'ready';
    case InProgress = 'in_progress';
    case Blocked = 'blocked';
    case Done = 'done';

    public function labelPtBr(): string
    {
        return match ($this) {
            self::Backlog => 'Backlog',
            self::Ready => 'Pronto',
            self::InProgress => 'Em progresso',
            self::Blocked => 'Bloqueado',
            self::Done => 'Concluído',
        };
    }

    public function canTransitionTo(self $to): bool
    {
        return match ($this) {
            self::Backlog => in_array($to, [self::Ready, self::InProgress, self::Blocked], true),
            self::Ready => in_array($to, [self::Backlog, self::InProgress, self::Blocked], true),
            self::InProgress => in_array($to, [self::Ready, self::Blocked, self::Done], true),
            self::Blocked => in_array($to, [self::Ready, self::InProgress], true),
            self::Done => false,
        };
    }
}
