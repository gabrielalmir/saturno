<?php

namespace App\Modules\WorkManagement\Application\Ports\Repositories;

use App\Modules\WorkManagement\Domain\WorkItems\WorkItem;

interface WorkItemRepository
{
    public function findForOrg(int $organizationId, int $id): ?WorkItem;

    /**
     * @param array{
     *  organization_id:int,
     *  title:string,
     *  description?:string|null,
     *  tier:string,
     *  type:string,
     *  size:string,
     *  priority:string,
     *  status:string,
     *  assignee_id?:int|null,
     *  reporter_id:int,
     *  estimate?:int|null,
     *  due_date?:string|null,
     *  epic_id?:int|null,
     *  ticket_id?:int|null,
     *  sprint_id?:int|null,
     *  parent_id?:int|null,
     * } $attributes
     */
    public function create(array $attributes): WorkItem;

    public function save(WorkItem $workItem): void;

    public function delete(WorkItem $workItem): void;

    public function countInProgressInSprint(int $organizationId, int $sprintId): int;
}
