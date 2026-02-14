<?php

namespace App\Http\Controllers;

use App\Models\WorkCadence;
use Illuminate\Http\Request;
use Inertia\Inertia;

class WorkCadenceController extends Controller
{
    public function index(Request $request)
    {
        $orgId = $request->user()->current_organization_id;
        $cadences = WorkCadence::where('organization_id', $orgId)
            ->with('team')
            ->orderBy('team_id')
            ->get();

        $teams = $request->user()->currentOrganization->teams()->get();

        return Inertia::render('settings/work-cadences', [
            'cadences' => $cadences,
            'teams' => $teams,
        ]);
    }

    public function store(Request $request)
    {
        $this->ensureManager($request);

        $orgId = $request->user()->current_organization_id;
        $validated = $request->validate([
            'team_id' => 'required|exists:teams,id',
            'name' => 'required|string|max:255',
            'sprint_duration_weeks' => 'required|integer|min:1|max:4',
            'sprint_start_day' => 'required|string|in:Monday,Tuesday,Wednesday,Thursday,Friday,Saturday,Sunday',
            'n1_n2_split_percentage' => 'required|integer|min:0|max:100',
        ]);

        $validated['organization_id'] = $orgId;
        WorkCadence::create($validated);

        return redirect()->back();
    }

    public function update(Request $request, WorkCadence $cadence)
    {
        $this->ensureManager($request);

        if ($cadence->organization_id !== $request->user()->current_organization_id) {
            abort(403);
        }

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'sprint_duration_weeks' => 'sometimes|integer|min:1|max:4',
            'sprint_start_day' => 'sometimes|string|in:Monday,Tuesday,Wednesday,Thursday,Friday,Saturday,Sunday',
            'n1_n2_split_percentage' => 'sometimes|integer|min:0|max:100',
        ]);

        $cadence->update($validated);

        return redirect()->back();
    }

    public function destroy(Request $request, WorkCadence $cadence)
    {
        $this->ensureManager($request);

        if ($cadence->organization_id !== $request->user()->current_organization_id) {
            abort(403);
        }

        $cadence->delete();

        return redirect()->back();
    }

    private function ensureManager(Request $request): void
    {
        if (! in_array($request->user()->currentOrganizationRole(), ['admin', 'maintainer'], true)) {
            abort(403);
        }
    }
}
