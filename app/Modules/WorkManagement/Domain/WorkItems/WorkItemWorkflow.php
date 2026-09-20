<?php

namespace App\Modules\WorkManagement\Domain\WorkItems;

use App\Modules\WorkManagement\Domain\Exceptions\InvalidWorkItemTransition;
use App\Modules\WorkManagement\Domain\Exceptions\MissingAssignee;
use App\Modules\WorkManagement\Domain\Exceptions\MissingBlockedReason;
use App\Modules\WorkManagement\Domain\Exceptions\MissingEstimateForN2;
use DateTimeImmutable;

final class WorkItemWorkflow
{
    public function transition(WorkItem $item, WorkItemStatus $to, ?string $blockedReason, DateTimeImmutable $now): WorkItem
    {
        if (! $item->status->canTransitionTo($to)) {
            throw new InvalidWorkItemTransition($item->status, $to);
        }

        if ($to === WorkItemStatus::InProgress) {
            if ($item->assigneeId === null) {
                throw new MissingAssignee;
            }
            if ($item->tier === Tier::N2 && (($item->estimate ?? 0) <= 0)) {
                throw new MissingEstimateForN2;
            }

            // On first start, snapshot started_at.
            $startedAt = $item->startedAt ?? $now;

            return $item->with(status: $to, startedAt: $startedAt);
        }

        if ($to === WorkItemStatus::Blocked) {
            $reason = $blockedReason !== null ? trim($blockedReason) : trim((string) $item->blockedReason);
            if ($reason === '') {
                throw new MissingBlockedReason;
            }

            return $item->with(
                status: $to,
                blockedAt: $now,
                blockedReason: $reason,
            );
        }

        if ($to === WorkItemStatus::Done) {
            return $item->with(status: $to, completedAt: $now);
        }

        return $item->with(status: $to);
    }
}
