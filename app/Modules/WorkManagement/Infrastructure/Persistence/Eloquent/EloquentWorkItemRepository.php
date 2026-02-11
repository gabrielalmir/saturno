<?php

namespace App\Modules\WorkManagement\Infrastructure\Persistence\Eloquent;

use App\Models\WorkItem as WorkItemModel;
use App\Modules\WorkManagement\Application\Ports\Repositories\WorkItemRepository;
use App\Modules\WorkManagement\Domain\WorkItems\Tier;
use App\Modules\WorkManagement\Domain\WorkItems\WorkItem;
use App\Modules\WorkManagement\Domain\WorkItems\WorkItemStatus;
use DateTimeImmutable;
use Illuminate\Support\Carbon;

class EloquentWorkItemRepository implements WorkItemRepository
{
    public function findForOrg(int $organizationId, int $id): ?WorkItem
    {
        $model = WorkItemModel::query()
            ->where('organization_id', $organizationId)
            ->where('id', $id)
            ->first();

        return $model ? $this->toDomain($model) : null;
    }

    public function create(array $attributes): WorkItem
    {
        $model = WorkItemModel::create($attributes);

        return $this->toDomain($model);
    }

    public function save(WorkItem $workItem): void
    {
        WorkItemModel::query()
            ->where('organization_id', $workItem->organizationId)
            ->where('id', $workItem->id)
            ->update([
                'title' => $workItem->title,
                'description' => $workItem->description,
                'tier' => $workItem->tier->value,
                'type' => $workItem->type,
                'size' => $workItem->size,
                'priority' => $workItem->priority,
                'status' => $workItem->status->value,
                'sprint_id' => $workItem->sprintId,
                'assignee_id' => $workItem->assigneeId,
                'reporter_id' => $workItem->reporterId,
                'estimate' => $workItem->estimate,
                'due_date' => $workItem->dueDate?->format('Y-m-d'),
                'planned_for' => $workItem->plannedFor?->format('Y-m-d'),
                'planned_rank' => $workItem->plannedRank,
                'epic_id' => $workItem->epicId,
                'ticket_id' => $workItem->ticketId,
                'parent_id' => $workItem->parentId,
                'started_at' => $workItem->startedAt?->format('Y-m-d H:i:s'),
                'blocked_at' => $workItem->blockedAt?->format('Y-m-d H:i:s'),
                'blocked_reason' => $workItem->blockedReason,
                'completed_at' => $workItem->completedAt?->format('Y-m-d H:i:s'),
            ]);
    }

    public function delete(WorkItem $workItem): void
    {
        WorkItemModel::query()
            ->where('organization_id', $workItem->organizationId)
            ->where('id', $workItem->id)
            ->delete();
    }

    public function countInProgressInSprint(int $organizationId, int $sprintId): int
    {
        return WorkItemModel::query()
            ->where('organization_id', $organizationId)
            ->where('sprint_id', $sprintId)
            ->where('status', WorkItemStatus::InProgress->value)
            ->count();
    }

    private function toDomain(WorkItemModel $model): WorkItem
    {
        return new WorkItem(
            id: (int) $model->id,
            organizationId: (int) $model->organization_id,
            title: (string) $model->title,
            description: $model->description !== null ? (string) $model->description : null,
            tier: Tier::from((string) $model->tier),
            type: (string) $model->type,
            size: (string) $model->size,
            priority: (string) $model->priority,
            status: WorkItemStatus::from((string) $model->status),
            sprintId: $model->sprint_id !== null ? (int) $model->sprint_id : null,
            assigneeId: $model->assignee_id !== null ? (int) $model->assignee_id : null,
            reporterId: $model->reporter_id !== null ? (int) $model->reporter_id : 0,
            estimate: $model->estimate !== null ? (int) $model->estimate : null,
            dueDate: $this->toImmutable($model->due_date),
            plannedFor: $this->toImmutable($model->planned_for),
            plannedRank: $model->planned_rank !== null ? (int) $model->planned_rank : null,
            epicId: $model->epic_id !== null ? (int) $model->epic_id : null,
            ticketId: $model->ticket_id !== null ? (int) $model->ticket_id : null,
            parentId: $model->parent_id !== null ? (int) $model->parent_id : null,
            startedAt: $this->toImmutable($model->started_at),
            blockedAt: $this->toImmutable($model->blocked_at),
            blockedReason: $model->blocked_reason !== null ? (string) $model->blocked_reason : null,
            completedAt: $this->toImmutable($model->completed_at),
        );
    }

    private function toImmutable(mixed $value): ?DateTimeImmutable
    {
        if ($value === null) {
            return null;
        }
        if ($value instanceof DateTimeImmutable) {
            return $value;
        }
        if ($value instanceof Carbon) {
            return $value->toDateTimeImmutable();
        }
        if ($value instanceof \DateTimeInterface) {
            return DateTimeImmutable::createFromInterface($value);
        }

        return new DateTimeImmutable((string) $value);
    }
}
