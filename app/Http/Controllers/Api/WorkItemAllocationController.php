<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\WorkItem;
use App\Models\WorkItemAllocation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class WorkItemAllocationController extends Controller
{
    public function index(Request $request, WorkItem $workItem)
    {
        $this->authorizeWorkItemScope($request, $workItem);

        $allocations = $workItem->allocations()
            ->with('user:id,name,email')
            ->get();

        return response()->json($allocations);
    }

    public function store(Request $request, WorkItem $workItem)
    {
        $this->authorizeWorkItemScope($request, $workItem);

        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'allocation_percentage' => 'required|integer|min:1|max:100',
        ]);

        $isOrgMember = DB::table('organization_user')
            ->where('organization_id', $workItem->organization_id)
            ->where('user_id', (int) $validated['user_id'])
            ->exists();
        if (! $isOrgMember) {
            abort(422, 'Usuario nao pertence a organizacao atual.');
        }

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
        $this->authorizeWorkItemScope($request, $workItem);

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
        $this->authorizeWorkItemScope(request(), $workItem);

        $allocation = WorkItemAllocation::where('work_item_id', $workItem->id)
            ->where('user_id', $userId)
            ->firstOrFail();

        $allocation->delete();

        return response()->json(null, 204);
    }

    private function authorizeWorkItemScope(Request $request, WorkItem $workItem): void
    {
        $user = $request->user();

        if ((int) $workItem->organization_id !== (int) $user->current_organization_id) {
            abort(404);
        }

        if ($user->current_project_id && (int) $workItem->project_id !== (int) $user->current_project_id) {
            abort(404);
        }
    }
}
