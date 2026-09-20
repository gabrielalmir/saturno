<?php

namespace App\Http\Controllers;

use App\Models\Sprint;
use App\Models\WorkItem;
use App\Services\SprintCapacityCalculator;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function __construct(
        private SprintCapacityCalculator $capacityCalculator
    ) {}

    public function index()
    {
        $organizationId = auth()->user()->current_organization_id;
        $projectId = auth()->user()->current_project_id;

        $currentSprint = Sprint::with('workItems')
            ->where('organization_id', $organizationId)
            ->when($projectId, fn ($q) => $q->where('project_id', $projectId))
            ->where('status', 'active')
            ->first();

        if (! $currentSprint) {
            return Inertia::render('dashboard', [
                'currentSprint' => null,
                'metrics' => null,
                'n1Items' => [],
                'n2Items' => [],
            ]);
        }

        $n1Items = WorkItem::with('assignee')
            ->where('organization_id', $organizationId)
            ->when($projectId, fn ($q) => $q->where('project_id', $projectId))
            ->where('sprint_id', $currentSprint->id)
            ->where('tier', 'N1')
            ->orderBy('priority')
            ->limit(5)
            ->get();

        $n2Items = WorkItem::with('assignee')
            ->where('organization_id', $organizationId)
            ->when($projectId, fn ($q) => $q->where('project_id', $projectId))
            ->where('sprint_id', $currentSprint->id)
            ->where('tier', 'N2')
            ->orderBy('status')
            ->limit(5)
            ->get();

        // Calculate metrics
        $totalCapacity = $currentSprint->capacity_total;
        $n1Reserved = $this->capacityCalculator->getReservedN1($currentSprint);
        $n2Planned = $currentSprint->workItems()->where('tier', 'N2')->sum('estimate') ?? 0;
        $available = $totalCapacity - $n1Reserved - $n2Planned;

        $blockedCount = WorkItem::where('organization_id', $organizationId)
            ->when($projectId, fn ($q) => $q->where('project_id', $projectId))
            ->where('sprint_id', $currentSprint->id)
            ->where('status', 'blocked')
            ->count();

        $velocitySprints = Sprint::where('organization_id', $organizationId)
            ->when($projectId, fn ($q) => $q->where('project_id', $projectId))
            ->where('status', 'completed')
            ->orderBy('end_date', 'desc')
            ->take(6)
            ->get()
            ->reverse()
            ->values();

        $velocity = $velocitySprints->map(function ($sprint) {
            $donePoints = $sprint->workItems()
                ->where('tier', 'N2')
                ->where('status', 'done')
                ->sum('estimate') ?? 0;

            return [
                'label' => $sprint->name,
                'value' => (int) $donePoints,
            ];
        });

        $metrics = [
            'capacity' => [
                'total' => $totalCapacity,
                'n1Reserved' => $n1Reserved,
                'n2Planned' => $n2Planned,
                'available' => $available,
                'n1ReservedPercent' => $totalCapacity > 0 ? ($n1Reserved / $totalCapacity) * 100 : 0,
                'n2PlannedPercent' => $totalCapacity > 0 ? ($n2Planned / $totalCapacity) * 100 : 0,
                'availablePercent' => $totalCapacity > 0 ? ($available / $totalCapacity) * 100 : 0,
            ],
            'blockedItems' => [
                'count' => $blockedCount,
            ],
        ];

        return Inertia::render('dashboard', [
            'currentSprint' => $currentSprint,
            'metrics' => $metrics,
            'n1Items' => $n1Items,
            'n2Items' => $n2Items,
            'velocity' => $velocity,
        ]);
    }
}
