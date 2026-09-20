<?php

namespace App\Http\Controllers;

use App\Models\Ticket;
use App\Models\WorkItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class TicketController extends Controller
{
    private const STATUSES = ['open', 'triage', 'in_progress', 'done'];

    private const PRIORITIES = ['P0', 'P1', 'P2', 'P3'];

    public function index(Request $request)
    {
        $orgId = $request->user()->current_organization_id;
        $projectId = $request->user()->current_project_id;
        $orgUsers = $request->user()->currentOrganization?->users ?? collect();

        $tickets = Ticket::with(['assignee', 'reporter'])
            ->where('organization_id', $orgId)
            ->when($projectId, fn ($q) => $q->where('project_id', $projectId))
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('tickets', [
            'tickets' => $tickets,
            'users' => $orgUsers,
        ]);
    }

    public function show(Request $request, Ticket $ticket)
    {
        $projectId = $request->user()->current_project_id;
        if ($ticket->organization_id !== $request->user()->current_organization_id || ($projectId && (int) $ticket->project_id !== (int) $projectId)) {
            abort(404);
        }

        $orgUsers = $request->user()->currentOrganization?->users ?? collect();

        $workItems = WorkItem::where('organization_id', $request->user()->current_organization_id)
            ->when($projectId, fn ($q) => $q->where('project_id', $projectId))
            ->whereNull('ticket_id')
            ->with('assignee')
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('ticket-detail', [
            'ticket' => $ticket->load(['assignee', 'reporter', 'workItems.assignee', 'workItems.epic']),
            'users' => $orgUsers,
            'availableWorkItems' => $workItems,
        ]);
    }

    public function store(Request $request)
    {
        $orgId = $request->user()->current_organization_id;
        $projectId = $request->user()->current_project_id;

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'required|in:open,triage,in_progress,done',
            'priority' => 'required|in:P0,P1,P2,P3',
            'assignee_id' => [
                'nullable',
                'exists:users,id',
                function (string $attribute, mixed $value, \Closure $fail) use ($orgId) {
                    if ($value === null) {
                        return;
                    }
                    $isMember = DB::table('organization_user')
                        ->where('organization_id', $orgId)
                        ->where('user_id', $value)
                        ->exists();
                    if (! $isMember) {
                        $fail('O responsável precisa ser membro da organização atual.');
                    }
                },
            ],
            'due_date' => 'nullable|date',
        ]);

        $validated['organization_id'] = $orgId;
        $validated['project_id'] = $projectId;
        $validated['reporter_id'] = $request->user()->id;

        Ticket::create($validated);

        return redirect()->back();
    }

    public function update(Request $request, Ticket $ticket)
    {
        $orgId = $request->user()->current_organization_id;
        $projectId = $request->user()->current_project_id;
        if ($ticket->organization_id !== $orgId || ($projectId && (int) $ticket->project_id !== (int) $projectId)) {
            abort(404);
        }

        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'status' => 'sometimes|in:open,triage,in_progress,done',
            'priority' => 'sometimes|in:P0,P1,P2,P3',
            'assignee_id' => [
                'nullable',
                'exists:users,id',
                function (string $attribute, mixed $value, \Closure $fail) use ($orgId) {
                    if ($value === null) {
                        return;
                    }
                    $isMember = DB::table('organization_user')
                        ->where('organization_id', $orgId)
                        ->where('user_id', $value)
                        ->exists();
                    if (! $isMember) {
                        $fail('O responsável precisa ser membro da organização atual.');
                    }
                },
            ],
            'due_date' => 'nullable|date',
        ]);

        $ticket->update($validated);

        return redirect()->back();
    }

    public function destroy(Request $request, Ticket $ticket)
    {
        $projectId = $request->user()->current_project_id;
        if ($ticket->organization_id !== $request->user()->current_organization_id || ($projectId && (int) $ticket->project_id !== (int) $projectId)) {
            abort(404);
        }

        $ticket->delete();

        return redirect()->back();
    }
}
