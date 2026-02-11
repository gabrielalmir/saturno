<?php

namespace App\Modules\WorkManagement\Application\UseCases\WorkItems;

use App\Modules\WorkManagement\Application\Exceptions\NotFound;
use App\Modules\WorkManagement\Application\Ports\Auth\CurrentUserProvider;
use App\Modules\WorkManagement\Application\Ports\Repositories\SprintRepository;
use App\Modules\WorkManagement\Application\Ports\Repositories\WorkItemEventRepository;
use App\Modules\WorkManagement\Application\Ports\Repositories\WorkItemRepository;
use App\Modules\WorkManagement\Domain\Exceptions\WipLimitExceeded;
use App\Modules\WorkManagement\Domain\WorkItems\WorkItemStatus;
use App\Modules\WorkManagement\Domain\WorkItems\WorkItemWorkflow;
use DateTimeImmutable;
use InvalidArgumentException;

final class ChangeWorkItemStatus
{
    public function __construct(
        private CurrentUserProvider $currentUser,
        private WorkItemRepository $workItems,
        private SprintRepository $sprints,
        private WorkItemEventRepository $events,
        private WorkItemWorkflow $workflow,
    ) {}

    public function execute(int $workItemId, string $toStatus, ?string $blockedReason = null, ?int $sprintId = null): void
    {
        $orgId = $this->currentUser->organizationId();
        $userId = $this->currentUser->userId();

        $workItem = $this->workItems->findForOrg($orgId, $workItemId);
        if (! $workItem) {
            throw new NotFound('Work item não encontrado.');
        }

        try {
            $to = WorkItemStatus::from($toStatus);
        } catch (\ValueError) {
            throw new InvalidArgumentException('Status inválido.');
        }

        $targetSprintId = $sprintId ?? $workItem->sprintId;
        if ($sprintId !== null && $workItem->sprintId === null) {
            $workItem = $workItem->with(sprintId: $sprintId);
        }

        if ($to === WorkItemStatus::InProgress && $targetSprintId !== null && $workItem->status !== WorkItemStatus::InProgress) {
            $sprint = $this->sprints->findForOrg($orgId, $targetSprintId);
            if ($sprint && $sprint->status->value === 'active' && $sprint->wipLimit > 0) {
                $current = $this->workItems->countInProgressInSprint($orgId, $targetSprintId);
                if ($current >= $sprint->wipLimit) {
                    throw new WipLimitExceeded($current, $sprint->wipLimit);
                }
            }
        }

        $from = $workItem->status;
        $now = new DateTimeImmutable('now');
        $updated = $this->workflow->transition($workItem, $to, $blockedReason, $now);

        $this->workItems->save($updated);

        $this->events->record($orgId, $updated->id, $userId, 'status_changed', [
            'from' => $from->value,
            'to' => $to->value,
            'blocked_reason' => $to === WorkItemStatus::Blocked ? ($updated->blockedReason ?? null) : null,
        ]);
    }
}
