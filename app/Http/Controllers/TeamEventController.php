<?php

namespace App\Http\Controllers;

use App\Models\TeamEvent;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TeamEventController extends Controller
{
    public function index(Request $request)
    {
        $orgId = $request->user()->current_organization_id;
        $events = TeamEvent::where('organization_id', $orgId)
            ->with('team')
            ->orderBy('start_date')
            ->get();

        $teams = $request->user()->currentOrganization->teams()->get();

        return Inertia::render('settings/team-events', [
            'events' => $events,
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
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'is_full_day' => 'required|boolean',
        ]);

        $validated['organization_id'] = $orgId;
        TeamEvent::create($validated);

        return redirect()->back();
    }

    public function update(Request $request, TeamEvent $event)
    {
        $this->ensureManager($request);

        if ($event->organization_id !== $request->user()->current_organization_id) {
            abort(403);
        }

        $validated = $request->validate([
            'team_id' => 'sometimes|exists:teams,id',
            'name' => 'sometimes|string|max:255',
            'start_date' => 'sometimes|date',
            'end_date' => 'sometimes|date|after_or_equal:start_date',
            'is_full_day' => 'sometimes|boolean',
        ]);

        $event->update($validated);

        return redirect()->back();
    }

    public function destroy(Request $request, TeamEvent $event)
    {
        $this->ensureManager($request);

        if ($event->organization_id !== $request->user()->current_organization_id) {
            abort(403);
        }

        $event->delete();

        return redirect()->back();
    }

    private function ensureManager(Request $request): void
    {
        if (! in_array($request->user()->currentOrganizationRole(), ['admin', 'maintainer'], true)) {
            abort(403);
        }
    }
}
