<?php

namespace App\Http\Controllers;

use App\Models\Sprint;
use App\Models\WorkItem;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class VisaoMacroController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $orgId = (int) $user->current_organization_id;
        $projectId = $user->current_project_id ? (int) $user->current_project_id : null;

        $currentSprint = Sprint::where('organization_id', $orgId)
            ->when($projectId, fn ($q) => $q->where('project_id', $projectId))
            ->where('status', 'active')
            ->first();

        $velocitySprints = Sprint::where('organization_id', $orgId)
            ->when($projectId, fn ($q) => $q->where('project_id', $projectId))
            ->where('status', 'completed')
            ->orderBy('end_date', 'desc')
            ->take(6)
            ->get()
            ->reverse()
            ->values();

        $velocity = $velocitySprints->map(function (Sprint $sprint) use ($orgId, $projectId) {
            $donePoints = WorkItem::where('organization_id', $orgId)
                ->when($projectId, fn ($q) => $q->where('project_id', $projectId))
                ->where('sprint_id', $sprint->id)
                ->where('tier', 'N2')
                ->where('status', 'done')
                ->sum('estimate') ?? 0;

            return [
                'label' => $sprint->name,
                'value' => (int) $donePoints,
            ];
        });

        $capacity = null;
        $flowMetrics = null;
        $wip = null;

        if ($currentSprint) {
            $totalCapacity = (int) $currentSprint->capacity_total;
            $n1Reserved = (int) $currentSprint->capacity_reserved_n1;
            $n2Planned = (int) (WorkItem::where('organization_id', $orgId)
                ->when($projectId, fn ($q) => $q->where('project_id', $projectId))
                ->where('sprint_id', $currentSprint->id)
                ->where('tier', 'N2')
                ->sum('estimate') ?? 0);
            $available = $totalCapacity - $n1Reserved - $n2Planned;

            $capacity = [
                'total' => $totalCapacity,
                'n1Reserved' => $n1Reserved,
                'n2Planned' => $n2Planned,
                'available' => $available,
                'n1ReservedPercent' => $totalCapacity > 0 ? ($n1Reserved / $totalCapacity) * 100 : 0,
                'n2PlannedPercent' => $totalCapacity > 0 ? ($n2Planned / $totalCapacity) * 100 : 0,
                'availablePercent' => $totalCapacity > 0 ? ($available / $totalCapacity) * 100 : 0,
            ];

            $flowMetrics = $this->computeFlowMetrics($orgId, $currentSprint, $projectId);

            $wipCount = WorkItem::where('organization_id', $orgId)
                ->when($projectId, fn ($q) => $q->where('project_id', $projectId))
                ->where('sprint_id', $currentSprint->id)
                ->where('status', 'in_progress')
                ->count();

            $wip = [
                'count' => (int) $wipCount,
                'limit' => (int) $currentSprint->wip_limit,
            ];
        }

        $now = now();
        $blockedThreshold = $now->copy()->subHours(48);
        $dueSoonThreshold = $now->copy()->addDays(2)->endOfDay();

        $blockedAlerts = WorkItem::with(['assignee'])
            ->where('organization_id', $orgId)
            ->when($projectId, fn ($q) => $q->where('project_id', $projectId))
            ->where('status', 'blocked')
            ->whereNotNull('blocked_at')
            ->where('blocked_at', '<=', $blockedThreshold)
            ->orderBy('blocked_at')
            ->limit(10)
            ->get(['id', 'title', 'assignee_id', 'blocked_at'])
            ->map(function (WorkItem $wi) use ($now) {
                $blockedAt = Carbon::parse($wi->blocked_at);

                return [
                    'kind' => 'blocked_aging',
                    'severity' => 'high',
                    'title' => 'Item bloqueado ha mais de 48h',
                    'work_item' => [
                        'id' => $wi->id,
                        'title' => $wi->title,
                        'assignee' => $wi->assignee?->name,
                    ],
                    'age_hours' => (int) $blockedAt->diffInHours($now),
                    'href' => "/work-items/{$wi->id}",
                ];
            })
            ->values()
            ->all();

        $dueSoonAlerts = WorkItem::with(['assignee'])
            ->where('organization_id', $orgId)
            ->when($projectId, fn ($q) => $q->where('project_id', $projectId))
            ->whereNotNull('due_date')
            ->where('status', '!=', 'done')
            ->whereDate('due_date', '<=', $dueSoonThreshold->toDateString())
            ->orderBy('due_date')
            ->limit(10)
            ->get(['id', 'title', 'assignee_id', 'due_date', 'status'])
            ->map(function (WorkItem $wi) use ($now) {
                $dueDate = Carbon::parse($wi->due_date)->endOfDay();
                $isOverdue = $dueDate->lt($now);
                $days = (int) $now->copy()
                    ->startOfDay()
                    ->diffInDays($dueDate->copy()->startOfDay(), false);

                return [
                    'kind' => $isOverdue ? 'due_overdue' : 'due_soon',
                    'severity' => $isOverdue ? 'high' : 'medium',
                    'title' => $isOverdue ? 'Item atrasado (due date estourou)' : 'Item com due date em ate 2 dias',
                    'work_item' => [
                        'id' => $wi->id,
                        'title' => $wi->title,
                        'assignee' => $wi->assignee?->name,
                        'status' => $wi->status,
                    ],
                    'days_to_due' => $days,
                    'href' => "/work-items/{$wi->id}",
                ];
            })
            ->values()
            ->all();

        $alerts = array_values(array_merge($blockedAlerts, $dueSoonAlerts));

        return Inertia::render('visao-macro', [
            'currentSprint' => $currentSprint,
            'capacity' => $capacity,
            'wip' => $wip,
            'flowMetrics' => $flowMetrics,
            'velocity' => $velocity,
            'alerts' => $alerts,
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
}
