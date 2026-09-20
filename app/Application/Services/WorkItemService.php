<?php

namespace App\Application\Services;

use App\Models\Sprint;
use App\Models\WorkItem;
use Illuminate\Database\Eloquent\Collection;

class WorkItemService
{
    /**
     * Create a work item within org/team context.
     */
    public function create(array $data): WorkItem
    {
        return WorkItem::create($data);
    }

    /**
     * Move work item to sprint and optionally change status.
     */
    public function assignToSprint(WorkItem $item, ?Sprint $sprint, ?string $status = null): WorkItem
    {
        $item->sprint()->associate($sprint);
        if ($status) {
            $item->status = $status;
        }
        $item->save();

        return $item;
    }

    /**
     * Bulk load kanban columns for a sprint (or backlog when sprint is null).
     */
    public function kanbanColumns(?Sprint $sprint, int $orgId): array
    {
        $query = WorkItem::with(['assignee', 'parent', 'ticket'])
            ->where('organization_id', $orgId);

        if ($sprint) {
            $query->where('sprint_id', $sprint->id);
        } else {
            $query->whereNull('sprint_id');
        }

        /** @var Collection<int, WorkItem> $items */
        $items = $query->orderBy('priority')->get();

        return $items->groupBy('status')->map(fn ($group) => $group->values()->all())->toArray();
    }

    /**
     * Transition status safely.
     */
    public function transition(WorkItem $item, string $status): WorkItem
    {
        $item->status = $status;
        if ($status === 'in_progress' && $item->started_at === null) {
            $item->started_at = now();
        }
        if ($status === 'blocked' && $item->blocked_at === null) {
            $item->blocked_at = now();
        }
        if ($status === 'done') {
            $item->completed_at = now();
        }
        $item->save();

        return $item;
    }

    /**
     * Carry over incomplete work items to backlog (remove sprint, set status backlog).
     */
    public function carryOverIncomplete(Sprint $sprint): int
    {
        return WorkItem::where('sprint_id', $sprint->id)
            ->whereNotIn('status', ['done'])
            ->update([
                'sprint_id' => null,
                'status' => 'backlog',
            ]);
    }
}
