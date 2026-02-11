<?php

namespace App\Modules\WorkManagement\Application\UseCases\WorkItems;

use App\Modules\WorkManagement\Application\Exceptions\NotFound;
use App\Modules\WorkManagement\Application\Ports\Auth\CurrentUserProvider;
use App\Modules\WorkManagement\Application\Ports\Repositories\EpicRepository;
use App\Modules\WorkManagement\Application\Ports\Repositories\OrganizationMembershipRepository;
use App\Modules\WorkManagement\Application\Ports\Repositories\SprintRepository;
use App\Modules\WorkManagement\Application\Ports\Repositories\TicketRepository;
use App\Modules\WorkManagement\Application\Ports\Repositories\WorkItemEventRepository;
use App\Modules\WorkManagement\Application\Ports\Repositories\WorkItemRepository;
use DateTimeImmutable;
use InvalidArgumentException;

final class UpdateWorkItem
{
    public function __construct(
        private CurrentUserProvider $currentUser,
        private WorkItemRepository $workItems,
        private WorkItemEventRepository $events,
        private OrganizationMembershipRepository $memberships,
        private SprintRepository $sprints,
        private EpicRepository $epics,
        private TicketRepository $tickets,
    ) {}

    /**
     * @param array{
     *  title?:string,
     *  description?:string|null,
     *  tier?:string,
     *  type?:string,
     *  size?:string,
     *  priority?:string,
     *  assignee_id?:int|null,
     *  estimate?:int|null,
     *  due_date?:string|null,
     *  planned_for?:string|null,
     *  planned_rank?:int|null,
     *  epic_id?:int|null,
     *  ticket_id?:int|null,
     *  sprint_id?:int|null,
     *  parent_id?:int|null,
     * } $input
     */
    public function execute(int $workItemId, array $input): void
    {
        $orgId = $this->currentUser->organizationId();
        $userId = $this->currentUser->userId();

        $workItem = $this->workItems->findForOrg($orgId, $workItemId);
        if (! $workItem) {
            throw new NotFound('Work item não encontrado.');
        }

        $nextAssigneeId = array_key_exists('assignee_id', $input) ? $input['assignee_id'] : $workItem->assigneeId;
        if ($nextAssigneeId !== null && ! $this->memberships->isMember($orgId, (int) $nextAssigneeId)) {
            throw new InvalidArgumentException('O responsável precisa ser membro da organização atual.');
        }

        $nextSprintId = array_key_exists('sprint_id', $input) ? $input['sprint_id'] : $workItem->sprintId;
        if ($nextSprintId !== null && ! $this->sprints->findForOrg($orgId, (int) $nextSprintId)) {
            throw new InvalidArgumentException('Sprint inválida para a organização atual.');
        }

        $nextEpicId = array_key_exists('epic_id', $input) ? $input['epic_id'] : $workItem->epicId;
        if ($nextEpicId !== null && ! $this->epics->existsForOrg($orgId, (int) $nextEpicId)) {
            throw new InvalidArgumentException('Épico inválido para a organização atual.');
        }

        $nextTicketId = array_key_exists('ticket_id', $input) ? $input['ticket_id'] : $workItem->ticketId;
        if ($nextTicketId !== null && ! $this->tickets->existsForOrg($orgId, (int) $nextTicketId)) {
            throw new InvalidArgumentException('Ticket inválido para a organização atual.');
        }

        $nextParentId = array_key_exists('parent_id', $input) ? $input['parent_id'] : $workItem->parentId;
        if ($nextParentId !== null && (int) $nextParentId === $workItem->id) {
            throw new InvalidArgumentException('O item pai não pode ser o próprio item.');
        }

        $dueDate = $workItem->dueDate;
        if (array_key_exists('due_date', $input)) {
            $dueDate = $input['due_date'] ? new DateTimeImmutable($input['due_date']) : null;
        }

        $plannedFor = $workItem->plannedFor;
        if (array_key_exists('planned_for', $input)) {
            $plannedFor = $input['planned_for'] ? new DateTimeImmutable($input['planned_for']) : null;
        }

        $plannedRank = $workItem->plannedRank;
        if (array_key_exists('planned_rank', $input)) {
            $plannedRank = $input['planned_rank'] !== null ? (int) $input['planned_rank'] : null;
        }

        $tier = $workItem->tier;
        if (array_key_exists('tier', $input) && is_string($input['tier'])) {
            $tier = \App\Modules\WorkManagement\Domain\WorkItems\Tier::from($input['tier']);
        }

        $updated = $workItem->with(
            title: $input['title'] ?? $workItem->title,
            description: array_key_exists('description', $input) ? $input['description'] : $workItem->description,
            tier: $tier,
            type: $input['type'] ?? $workItem->type,
            size: $input['size'] ?? $workItem->size,
            priority: $input['priority'] ?? $workItem->priority,
            assigneeId: $nextAssigneeId,
            sprintId: $nextSprintId,
            estimate: array_key_exists('estimate', $input) ? $input['estimate'] : $workItem->estimate,
            dueDate: $dueDate,
            plannedFor: $plannedFor,
            plannedRank: $plannedRank,
            epicId: $nextEpicId,
            ticketId: $nextTicketId,
            parentId: $nextParentId,
        );

        $this->workItems->save($updated);

        if ($updated->assigneeId !== $workItem->assigneeId) {
            $this->events->record($orgId, $updated->id, $userId, 'assignee_changed', [
                'from' => $workItem->assigneeId,
                'to' => $updated->assigneeId,
            ]);
        }
        if ($updated->epicId !== $workItem->epicId) {
            $this->events->record($orgId, $updated->id, $userId, 'epic_changed', [
                'from' => $workItem->epicId,
                'to' => $updated->epicId,
            ]);
        }
        if ($updated->ticketId !== $workItem->ticketId) {
            $this->events->record($orgId, $updated->id, $userId, 'ticket_changed', [
                'from' => $workItem->ticketId,
                'to' => $updated->ticketId,
            ]);
        }
    }
}
