<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\WorkItem;
use App\Models\WorkItemAllocation;
use Illuminate\Http\Request;

class WorkItemAllocationController extends Controller
{
    public function index(WorkItem $workItem)
    {
        $allocations = $workItem->allocations()
            ->with('user:id,name,email')
            ->get();

        return response()->json($allocations);
    }

    public function store(Request $request, WorkItem $workItem)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'allocation_percentage' => 'required|integer|min:1|max:100',
        ]);

        // Check if allocation already exists
        $existing = WorkItemAllocation::where('work_item_id', $workItem->id)
            ->where('user_id', $validated['user_id'])
            ->first();

        if ($existing) {
            return response()->json([
                'message' => 'Allocation already exists for this user',
            ], 422);
        }

        $allocation = WorkItemAllocation::create([
            'work_item_id' => $workItem->id,
            'user_id' => $validated['user_id'],
            'allocation_percentage' => $validated['allocation_percentage'],
        ]);

        return response()->json($allocation->load('user:id,name,email'), 201);
    }

    public function update(Request $request, WorkItem $workItem, $userId)
    {
        $validated = $request->validate([
            'allocation_percentage' => 'required|integer|min:1|max:100',
        ]);

        $allocation = WorkItemAllocation::where('work_item_id', $workItem->id)
            ->where('user_id', $userId)
            ->firstOrFail();

        $allocation->update($validated);

        return response()->json($allocation->load('user:id,name,email'));
    }

    public function destroy(WorkItem $workItem, $userId)
    {
        $allocation = WorkItemAllocation::where('work_item_id', $workItem->id)
            ->where('user_id', $userId)
            ->firstOrFail();

        $allocation->delete();

        return response()->json(null, 204);
    }
}
