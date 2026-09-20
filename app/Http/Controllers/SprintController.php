<?php

namespace App\Http\Controllers;

use App\Models\Epic;
use App\Models\Sprint;
use App\Models\SprintEvent;
use App\Models\WorkItem;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SprintController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user()->load(['currentOrganization.users']);
        $orgId = $user->current_organization_id;
        $projectId = $user->current_project_id;
        $orgUsers = $user->currentOrganization?->users ?? collect();

        $sprints = Sprint::where('organization_id', $orgId)
            ->when($projectId, fn ($q) => $q->where('project_id', $projectId))
            ->orderBy('start_date', 'desc')
            ->get();

        $currentSprint = Sprint::with('workItems')
            ->where('organization_id', $orgId)
            ->when($projectId, fn ($q) => $q->where('project_id', $projectId))
            ->where('status', 'planning')
            ->orderBy('start_date', 'desc')
            ->first();

        $readyItems = WorkItem::where('organization_id', $orgId)
            ->when($projectId, fn ($q) => $q->where('project_id', $projectId))
            ->where('status', 'ready')
            ->where('tier', 'N2')
            ->whereNull('sprint_id')
            ->with(['assignee', 'epic', 'ticket'])
            ->get();

        $backlogItems = WorkItem::where('organization_id', $orgId)
            ->when($projectId, fn ($q) => $q->where('project_id', $projectId))
            ->where('status', 'backlog')
            ->where('tier', 'N2')
            ->whereNull('sprint_id')
            ->with(['assignee', 'epic', 'ticket'])
            ->orderBy('priority')
            ->get();

        $epics = Epic::where('organization_id', $orgId)
            ->when($projectId, fn ($q) => $q->where('project_id', $projectId))
            ->orderBy('title')
            ->get();

        return Inertia::render('sprint-planning', [
            'sprints' => $sprints,
            'currentSprint' => $currentSprint,
            'readyItems' => $readyItems,
            'backlogItems' => $backlogItems,
            'currentScopeItems' => $currentSprint ? $currentSprint->workItems : collect(),
            'users' => $orgUsers,
            'epics' => $epics,
        ]);
    }

    public function store(Request $request)
    {
        $user = $request->user();

        // Role check: only admin/maintainer can create sprints
        $role = $user->currentOrganizationRole();
        if (! in_array($role, ['admin', 'maintainer'])) {
            abort(403, 'Apenas administradores e mantenedores podem criar sprints.');
        }

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'goal' => 'nullable|string|max:255',
            'start_date' => 'sometimes|date',
            'end_date' => 'sometimes|date|after:start_date',
            'capacity_total' => 'sometimes|integer|min:0',
            'capacity_reserved_n1' => 'sometimes|integer|min:0',
            'use_member_n1_reserve' => 'sometimes|boolean',
            'wip_limit' => 'sometimes|integer|min:0',
            'item_ids' => 'sometimes|array',
            'item_ids.*' => 'integer|exists:work_items,id',
        ]);

        $validated['organization_id'] = $user->current_organization_id;
        $validated['project_id'] = $user->current_project_id;
        $validated['status'] = 'planning';

        $itemIds = $validated['item_ids'] ?? [];
        unset($validated['item_ids']);

        $sprint = Sprint::create($validated);

        if (! empty($itemIds)) {
            WorkItem::where('organization_id', $user->current_organization_id)
                ->when($user->current_project_id, fn ($q) => $q->where('project_id', $user->current_project_id))
                ->whereIn('id', $itemIds)
                ->update(['sprint_id' => $sprint->id]);
        }

        return redirect()->back();
    }

    public function update(Request $request, Sprint $sprint)
    {
        $user = $request->user();

        if ($sprint->organization_id !== $user->current_organization_id || ($user->current_project_id && (int) $sprint->project_id !== (int) $user->current_project_id)) {
            abort(403);
        }

        // Role check: only admin/maintainer can update sprints
        $role = $user->currentOrganizationRole();
        if (! in_array($role, ['admin', 'maintainer'])) {
            abort(403, 'Apenas administradores e mantenedores podem editar sprints.');
        }

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'goal' => 'nullable|string|max:255',
            'start_date' => 'sometimes|date',
            'end_date' => 'sometimes|date|after:start_date',
            'capacity_total' => 'sometimes|integer|min:0',
            'capacity_reserved_n1' => 'sometimes|integer|min:0',
            'use_member_n1_reserve' => 'sometimes|boolean',
            'wip_limit' => 'sometimes|integer|min:0',
        ]);

        $sprint->update($validated);

        return redirect()->back();
    }

    public function board(Request $request)
    {
        $user = $request->user();
        $orgId = $user->current_organization_id;
        $projectId = $user->current_project_id;
        $orgUsers = $user->currentOrganization?->users ?? collect();
        $epics = Epic::where('organization_id', $orgId)->when($projectId, fn ($q) => $q->where('project_id', $projectId))->orderBy('title')->get();

        $currentSprint = Sprint::with(['workItems.assignee', 'workItems.epic', 'workItems.ticket'])
            ->where('organization_id', $orgId)
            ->when($projectId, fn ($q) => $q->where('project_id', $projectId))
            ->where('status', 'active')
            ->first();

        // Also get backlog items without sprint
        $backlogItems = WorkItem::where('organization_id', $orgId)
            ->when($projectId, fn ($q) => $q->where('project_id', $projectId))
            ->whereNull('sprint_id')
            ->where('status', 'backlog')
            ->with(['assignee', 'epic', 'ticket'])
            ->orderBy('priority')
            ->get();
        if (! $currentSprint) {
            return Inertia::render('sprint-board', [
                'sprint' => null,
                'columns' => [
                    'backlog' => $backlogItems->toArray(),
                    'ready' => [],
                    'in_progress' => [],
                    'blocked' => [],
                    'done' => [],
                ],
                'flowMetrics' => null,
                'users' => $orgUsers,
                'epics' => $epics,
            ]);
        }

        $items = $currentSprint->workItems
            ->sortBy('priority')
            ->groupBy('status')
            ->toArray();

        // Merge backlog items (from sprint + without sprint)
        $sprintBacklog = $items['backlog'] ?? [];

        $columns = [
            'backlog' => array_merge($sprintBacklog, $backlogItems->toArray()),
            'ready' => $items['ready'] ?? [],
            'in_progress' => $items['in_progress'] ?? [],
            'blocked' => $items['blocked'] ?? [],
            'done' => $items['done'] ?? [],
        ];

        $flowMetrics = $this->computeFlowMetrics($orgId, $currentSprint, $projectId);

        return Inertia::render('sprint-board', [
            'sprint' => $currentSprint,
            'columns' => $columns,
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
                'count' => $wip->count(),
                'avg_hours' => $wip->count() > 0 ? round($wip->avg('age_hours'), 1) : null,
                'max_hours' => $wip->count() > 0 ? (int) $wip->max('age_hours') : null,
                'top' => $wip->sortByDesc('age_hours')->take(5)->values()->all(),
            ],
            'blocked_aging' => [
                'count' => $blocked->count(),
                'avg_hours' => $blocked->count() > 0 ? round($blocked->avg('age_hours'), 1) : null,
                'max_hours' => $blocked->count() > 0 ? (int) $blocked->max('age_hours') : null,
                'top' => $blocked->sortByDesc('age_hours')->take(5)->values()->all(),
            ],
        ];
    }

    public function start(Request $request, Sprint $sprint)
    {
        $user = $request->user();

        if ($sprint->organization_id !== $user->current_organization_id || ($user->current_project_id && (int) $sprint->project_id !== (int) $user->current_project_id)) {
            abort(403);
        }

        $role = $user->currentOrganizationRole();
        if (! in_array($role, ['admin', 'maintainer'], true)) {
            abort(403, 'Apenas administradores e mantenedores podem iniciar sprints.');
        }

        if ($sprint->status === 'active') {
            return redirect()->back()->withErrors([
                'start' => 'Esta sprint já está ativa.',
            ]);
        }

        if ($sprint->status === 'completed') {
            return redirect()->back()->withErrors([
                'start' => 'Esta sprint já foi finalizada.',
            ]);
        }

        $activeSprintExists = Sprint::where('organization_id', $user->current_organization_id)
            ->when($user->current_project_id, fn ($q) => $q->where('project_id', $user->current_project_id))
            ->where('status', 'active')
            ->where('id', '!=', $sprint->id)
            ->exists();

        if ($activeSprintExists) {
            return redirect()->back()->withErrors([
                'start' => 'Já existe uma sprint ativa nesta organização.',
            ]);
        }

        try {
            app(\App\Application\Services\SprintService::class)->start($sprint, $user);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return redirect()->back()->withErrors($e->errors());
        }

        return redirect()->route('sprint-board');
    }

    public function complete(Request $request, Sprint $sprint)
    {
        $user = $request->user();

        if ($sprint->organization_id !== $user->current_organization_id || ($user->current_project_id && (int) $sprint->project_id !== (int) $user->current_project_id)) {
            abort(403);
        }

        // Role check: only admin/maintainer can complete sprints
        $role = $user->currentOrganizationRole();
        if (! in_array($role, ['admin', 'maintainer'])) {
            abort(403, 'Apenas administradores e mantenedores podem encerrar sprints.');
        }

        if ($sprint->status !== 'active') {
            return redirect()->back()->withErrors([
                'complete' => 'Apenas sprints ativas podem ser encerradas.',
            ]);
        }

        $summary = app(\App\Application\Services\SprintService::class)->complete($sprint);

        SprintEvent::create([
            'sprint_id' => $sprint->id,
            'user_id' => $user->id,
            'type' => 'completed',
            'payload' => [
                'done_count' => $summary['done'],
                'total_count' => $summary['total'],
                'incomplete_moved_to_backlog' => $summary['total'] - $summary['done'],
            ],
        ]);

        return redirect()->route('sprint-planning');
    }
}
