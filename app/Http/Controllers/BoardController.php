<?php

namespace App\Http\Controllers;

use App\Models\Board;
use App\Models\BoardItem;
use App\Models\Epic;
use App\Models\Sprint;
use App\Models\WorkItem;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BoardController extends Controller
{
    public function sprintBoard(Request $request)
    {
        $user = $request->user();
        $orgId = $user->current_organization_id;
        $projectId = $user->current_project_id;
        $board = Board::defaultForOrganization($orgId, $projectId);

        return $this->renderBoard($request, $board);
    }

    public function show(Request $request, Board $board)
    {
        $user = $request->user();
        if ((int) $board->organization_id !== (int) $user->current_organization_id || ($user->current_project_id && (int) $board->project_id !== (int) $user->current_project_id)) {
            abort(404);
        }

        return $this->renderBoard($request, $board);
    }

    public function store(Request $request)
    {
        $orgId = $request->user()->current_organization_id;
        $projectId = $request->user()->current_project_id;

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'context_type' => 'nullable|string|max:50',
            'context_filter' => 'nullable|array',
        ]);

        $board = Board::create([
            'organization_id' => $orgId,
            'project_id' => $projectId,
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
            'context_type' => $validated['context_type'] ?? 'custom',
            'context_filter' => $validated['context_filter'] ?? null,
        ]);

        return redirect()->route('boards.show', $board);
    }

    public function update(Request $request, Board $board)
    {
        $projectId = $request->user()->current_project_id;
        if ((int) $board->organization_id !== (int) $request->user()->current_organization_id || ($projectId && (int) $board->project_id !== (int) $projectId)) {
            abort(404);
        }

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'context_type' => 'nullable|string|max:50',
            'context_filter' => 'nullable|array',
        ]);

        $board->update($validated);

        return redirect()->back();
    }

    public function destroy(Request $request, Board $board)
    {
        $projectId = $request->user()->current_project_id;
        if ((int) $board->organization_id !== (int) $request->user()->current_organization_id || ($projectId && (int) $board->project_id !== (int) $projectId)) {
            abort(404);
        }

        $board->delete();

        return redirect()->route('dashboard');
    }

    private function renderBoard(Request $request, Board $board)
    {
        $user = $request->user();
        $orgId = $user->current_organization_id;
        $projectId = $user->current_project_id;
        $orgUsers = $user->currentOrganization?->users ?? collect();
        $epics = Epic::where('organization_id', $orgId)
            ->when($projectId, fn ($q) => $q->where('project_id', $projectId))
            ->orderBy('title')
            ->get();

        $columns = $board->columns()->get();
        $boardItems = BoardItem::with(['workItem', 'workItem.assignee', 'workItem.ticket'])
            ->where('board_id', $board->id)
            ->orderBy('position')
            ->get();

        $itemsByColumn = $boardItems->groupBy('column_id');

        $columnPayload = $columns->map(function ($column) use ($itemsByColumn) {
            $items = $itemsByColumn->get($column->id, collect())
                ->map(fn ($boardItem) => $boardItem->workItem)
                ->filter();

            return [
                'id' => $column->id,
                'name' => $column->name,
                'kind' => $column->kind,
                'status_mapping' => $column->status_mapping,
                'color' => $column->color,
                'position' => $column->position,
                'items' => $items->values()->all(),
            ];
        })->values()->all();

        $currentSprint = Sprint::with(['workItems'])
            ->where('organization_id', $orgId)
            ->when($projectId, fn ($q) => $q->where('project_id', $projectId))
            ->where('status', 'active')
            ->first();

        $flowMetrics = $currentSprint ? $this->computeFlowMetrics($orgId, $currentSprint, $projectId) : null;

        return Inertia::render('sprint-board', [
            'board' => [
                'id' => $board->id,
                'name' => $board->name,
                'description' => $board->description,
                'context_type' => $board->context_type,
                'context_filter' => $board->context_filter,
                'columns' => $columnPayload,
            ],
            'sprint' => $currentSprint,
            'flowMetrics' => $flowMetrics,
            'users' => $orgUsers,
            'epics' => $epics,
        ]);
    }

    private function computeFlowMetrics(int $orgId, Sprint $sprint, ?int $projectId): array
    {
        $rangeStart = Carbon::parse($sprint->start_date)->startOfDay();
        $rangeEnd = Carbon::parse($sprint->end_date)->endOfDay();

        $completed = WorkItem::where('organization_id', $orgId)
            ->when($projectId, fn ($q) => $q->where('project_id', $projectId))
            ->where('sprint_id', $sprint->id)
            ->whereNotNull('completed_at')
            ->whereBetween('completed_at', [$rangeStart, $rangeEnd])
            ->get(['id', 'started_at', 'completed_at']);

        $cycleHours = $completed
            ->filter(fn ($wi) => $wi->started_at !== null)
            ->map(fn ($wi) => Carbon::parse($wi->started_at)->diffInHours(Carbon::parse($wi->completed_at)));

        $wip = WorkItem::where('organization_id', $orgId)
            ->when($projectId, fn ($q) => $q->where('project_id', $projectId))
            ->where('sprint_id', $sprint->id)
            ->where('status', 'in_progress')
            ->whereNotNull('started_at')
            ->get(['id', 'title', 'assignee_id', 'started_at'])
            ->map(function ($wi) {
                $ageHours = Carbon::parse($wi->started_at)->diffInHours(now());

                return [
                    'id' => $wi->id,
                    'title' => $wi->title,
                    'assignee_id' => $wi->assignee_id,
                    'age_hours' => $ageHours,
                ];
            });

        $blocked = WorkItem::where('organization_id', $orgId)
            ->when($projectId, fn ($q) => $q->where('project_id', $projectId))
            ->where('sprint_id', $sprint->id)
            ->where('status', 'blocked')
            ->whereNotNull('blocked_at')
            ->get(['id', 'title', 'assignee_id', 'blocked_at'])
            ->map(function ($wi) {
                $ageHours = Carbon::parse($wi->blocked_at)->diffInHours(now());

                return [
                    'id' => $wi->id,
                    'title' => $wi->title,
                    'assignee_id' => $wi->assignee_id,
                    'age_hours' => $ageHours,
                ];
            });

        return [
            'throughput' => $completed->count(),
            'avg_cycle_time_hours' => $cycleHours->count() > 0 ? round($cycleHours->avg(), 1) : null,
            'p95_cycle_time_hours' => $cycleHours->count() > 0 ? round($cycleHours->sort()->values()->get((int) floor($cycleHours->count() * 0.95)), 1) : null,
            'wip_aging' => [
                'avg_hours' => $wip->count() > 0 ? round($wip->avg('age_hours'), 1) : null,
                'max_hours' => $wip->count() > 0 ? (int) $wip->max('age_hours') : null,
                'top' => $wip->sortByDesc('age_hours')->take(5)->values()->all(),
            ],
            'blocked_aging' => [
                'avg_hours' => $blocked->count() > 0 ? round($blocked->avg('age_hours'), 1) : null,
                'max_hours' => $blocked->count() > 0 ? (int) $blocked->max('age_hours') : null,
                'top' => $blocked->sortByDesc('age_hours')->take(5)->values()->all(),
            ],
        ];
    }
}
