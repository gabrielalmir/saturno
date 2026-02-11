<?php

namespace App\Http\Controllers;

use App\Models\Epic;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EpicController extends Controller
{
    public function index(Request $request)
    {
        $orgId = $request->user()->current_organization_id;
        $projectId = $request->user()->current_project_id;

        $epics = Epic::query()
            ->where('organization_id', $orgId)
            ->when($projectId, fn ($q) => $q->where('project_id', $projectId))
            ->withCount('workItems')
            ->withCount(['workItems as done_work_items_count' => fn ($q) => $q->where('status', 'done')])
            ->orderBy('created_at', 'desc')
            ->get([
                'id',
                'organization_id',
                'title',
                'description',
                'status',
                'created_at',
                'updated_at',
            ]);

        return Inertia::render('epics', [
            'epics' => $epics,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'required|in:planning,in_progress,completed,cancelled',
        ]);

        $validated['organization_id'] = $request->user()->current_organization_id;
        $validated['project_id'] = $request->user()->current_project_id;
        $validated['owner_id'] = $request->user()->id;

        Epic::create($validated);

        return redirect()->back();
    }

    public function update(Request $request, int $epic)
    {
        $orgId = $request->user()->current_organization_id;
        $projectId = $request->user()->current_project_id;
        $model = Epic::query()
            ->where('organization_id', $orgId)
            ->when($projectId, fn ($q) => $q->where('project_id', $projectId))
            ->where('id', $epic)
            ->first();
        if (! $model) {
            abort(404);
        }

        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'status' => 'sometimes|in:planning,in_progress,completed,cancelled',
        ]);

        $model->update($validated);

        return redirect()->back();
    }

    public function destroy(Request $request, int $epic)
    {
        $orgId = $request->user()->current_organization_id;
        $projectId = $request->user()->current_project_id;
        $model = Epic::query()
            ->where('organization_id', $orgId)
            ->when($projectId, fn ($q) => $q->where('project_id', $projectId))
            ->where('id', $epic)
            ->first();
        if (! $model) {
            abort(404);
        }

        $model->delete();

        return redirect()->back();
    }
}
