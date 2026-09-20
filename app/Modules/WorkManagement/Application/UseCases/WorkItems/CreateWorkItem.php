<?php

namespace App\Modules\WorkManagement\Application\UseCases\WorkItems;

use App\Modules\WorkManagement\Application\Ports\Auth\CurrentUserProvider;
use App\Modules\WorkManagement\Application\Ports\Repositories\EpicRepository;
use App\Modules\WorkManagement\Application\Ports\Repositories\OrganizationMembershipRepository;
use App\Modules\WorkManagement\Application\Ports\Repositories\SprintRepository;
use App\Modules\WorkManagement\Application\Ports\Repositories\TicketRepository;
use App\Modules\WorkManagement\Application\Ports\Repositories\WorkItemEventRepository;
use App\Modules\WorkManagement\Application\Ports\Repositories\WorkItemRepository;
use App\Modules\WorkManagement\Domain\WorkItems\WorkItemStatus;
use InvalidArgumentException;

final class CreateWorkItem
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
     *  title:string,
     *  description?:string|null,
     *  tier:string,
     *  type:string,
     *  size:string,
     *  priority:string,
     *  status?:string|null,
     *  estimate?:int|null,
     *  due_date?:string|null,
     *  planned_for?:string|null,
     *  planned_rank?:int|null,
     *  assignee_id?:int|null,
     *  epic_id?:int|null,
     *  ticket_id?:int|null,
     *  sprint_id?:int|null,
     *  parent_id?:int|null,
     * } $input
     */
    public function execute(array $input): int
    {
        $orgId = $this->currentUser->organizationId();
        $userId = $this->currentUser->userId();

        $status = $input['status'] ?? WorkItemStatus::Backlog->value;
        if (! in_array($status, [WorkItemStatus::Backlog->value, WorkItemStatus::Ready->value], true)) {
            throw new InvalidArgumentException('Novos itens devem entrar como backlog ou pronto.');
        }

        $assigneeId = $input['assignee_id'] ?? null;
        if ($assigneeId !== null && ! $this->memberships->isMember($orgId, (int) $assigneeId)) {
            throw new InvalidArgumentException('O responsável precisa ser membro da organização atual.');
        }

        $sprintId = $input['sprint_id'] ?? null;
        if ($sprintId !== null && ! $this->sprints->findForOrg($orgId, (int) $sprintId)) {
            throw new InvalidArgumentException('Sprint inválida para a organização atual.');
        }

        $epicId = $input['epic_id'] ?? null;
        if ($epicId !== null && ! $this->epics->existsForOrg($orgId, (int) $epicId)) {
            throw new InvalidArgumentException('Épico inválido para a organização atual.');
        }

        $ticketId = $input['ticket_id'] ?? null;
        if ($ticketId !== null && ! $this->tickets->existsForOrg($orgId, (int) $ticketId)) {
            throw new InvalidArgumentException('Ticket inválido para a organização atual.');
        }

        $workItem = $this->workItems->create([
            'organization_id' => $orgId,
            'title' => $input['title'],
            'description' => $input['description'] ?? null,
            'tier' => $input['tier'],
            'type' => $input['type'],
            'size' => $input['size'],
            'priority' => $input['priority'],
            'status' => $status,
            'assignee_id' => $assigneeId,
            'reporter_id' => $userId,
            'estimate' => $input['estimate'] ?? null,
            'due_date' => $input['due_date'] ?? null,
            'planned_for' => $input['planned_for'] ?? null,
            'planned_rank' => $input['planned_rank'] ?? null,
            'epic_id' => $epicId,
            'ticket_id' => $ticketId,
            'sprint_id' => $sprintId,
            'parent_id' => $input['parent_id'] ?? null,
        ]);

        $this->events->record($orgId, $workItem->id, $userId, 'created', [
            'status' => $workItem->status->value,
            'assignee_id' => $workItem->assigneeId,
            'epic_id' => $workItem->epicId,
            'ticket_id' => $workItem->ticketId,
        ]);

        return $workItem->id;
    }
}
