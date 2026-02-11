<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Sprint;
use App\Models\User;
use App\Services\SprintCapacityCalculator;
use Illuminate\Http\Request;

class SprintCapacityController extends Controller
{
    public function __construct(
        private SprintCapacityCalculator $calculator
    ) {}

    public function summary(Sprint $sprint)
    {
        $summary = $this->calculator->getCapacitySummary($sprint);

        return response()->json($summary);
    }

    public function userCapacity(Request $request, Sprint $sprint)
    {
        $orgId = $request->user()->current_organization_id;

        // Get all users in the organization
        $users = User::whereHas('organizations', function ($query) use ($orgId) {
            $query->where('organizations.id', $orgId);
        })->get();

        $capacities = [];

        foreach ($users as $user) {
            $available = $this->calculator->calculateAvailableCapacity($sprint, $user);
            $allocated = $this->calculator->calculateAllocatedCapacity($sprint, $user);
            $remaining = $this->calculator->calculateRemainingCapacity($sprint, $user);

            // Only include users with capacity or allocations
            if ($available > 0 || $allocated > 0) {
                $capacities[] = [
                    'user_id' => $user->id,
                    'user_name' => $user->name,
                    'available' => round($available, 2),
                    'allocated' => round($allocated, 2),
                    'remaining' => round($remaining, 2),
                    'utilization_percentage' => $available > 0 ? round(($allocated / $available) * 100, 1) : 0,
                ];
            }
        }

        return response()->json([
            'sprint_id' => $sprint->id,
            'sprint_name' => $sprint->name,
            'working_days' => $this->calculator->calculateWorkingDays($sprint),
            'users' => $capacities,
        ]);
    }

    public function workingDays(Sprint $sprint)
    {
        $workingDays = $this->calculator->calculateWorkingDays($sprint);

        return response()->json([
            'sprint_id' => $sprint->id,
            'working_days' => $workingDays,
            'start_date' => $sprint->start_date->format('Y-m-d'),
            'end_date' => $sprint->end_date->format('Y-m-d'),
        ]);
    }
}
