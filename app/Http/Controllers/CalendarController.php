<?php

namespace App\Http\Controllers;

use App\Models\Sprint;
use App\Models\WorkItem;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CalendarController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $orgId = $user->current_organization_id;
        $projectId = $user->current_project_id;

        $currentSprint = Sprint::where('organization_id', $orgId)
            ->when($projectId, fn ($q) => $q->where('project_id', $projectId))
            ->where('status', 'active')
            ->first();

        $orgUsers = $user->currentOrganization?->users()
            ->select('users.id', 'users.name', 'users.email')
            ->orderBy('users.name')
            ->get() ?? collect();

        $selectedAssigneeId = (int) $user->id;
        $requestedAssigneeId = $request->query('assignee_id');
        if (is_string($requestedAssigneeId) && ctype_digit($requestedAssigneeId)) {
            $candidate = (int) $requestedAssigneeId;
            $canPlanOthers = (bool) ($user->analyst_role) || in_array($user->currentOrganizationRole(), ['admin', 'owner'], true);

            if ($candidate === $user->id || $canPlanOthers) {
                if ($orgUsers->contains('id', $candidate)) {
                    $selectedAssigneeId = $candidate;
                }
            }
        }

        $sprints = Sprint::where('organization_id', $orgId)
            ->when($projectId, fn ($q) => $q->where('project_id', $projectId))
            ->orderBy('start_date')
            ->get();

        $workItems = WorkItem::query()
            ->where('organization_id', $orgId)
            ->when($projectId, fn ($q) => $q->where('project_id', $projectId))
            ->where(function ($q) {
                $q->whereNotNull('due_date')
                    ->orWhereNotNull('planned_for');
            })
            ->select([
                'id',
                'organization_id',
                'title',
                'priority',
                'due_date',
                'planned_for',
                'assignee_id',
                'epic_id',
                'ticket_id',
                'sprint_id',
            ])
            ->with([
                'assignee:id,name',
                'epic:id,title',
                'ticket:id,title',
                'sprint:id,name,start_date,end_date,status',
            ])
            ->orderByRaw('COALESCE(planned_for, due_date) ASC')
            ->get();

        $focusWorkItems = WorkItem::query()
            ->where('organization_id', $orgId)
            ->when($projectId, fn ($q) => $q->where('project_id', $projectId))
            ->where('assignee_id', $selectedAssigneeId)
            ->whereIn('status', ['ready', 'in_progress', 'blocked'])
            ->select([
                'id',
                'organization_id',
                'title',
                'tier',
                'type',
                'size',
                'priority',
                'status',
                'estimate',
                'due_date',
                'planned_for',
                'planned_rank',
                'blocked_reason',
                'assignee_id',
                'epic_id',
                'ticket_id',
                'sprint_id',
            ])
            ->with([
                'epic:id,title',
                'ticket:id,title',
                'sprint:id,name,start_date,end_date,status',
            ])
            ->orderByRaw("CASE status WHEN 'in_progress' THEN 0 WHEN 'ready' THEN 1 WHEN 'blocked' THEN 2 ELSE 9 END")
            ->orderBy('planned_for')
            ->orderBy('priority')
            ->get();

        return Inertia::render('sprint-calendar', [
            'sprints' => $sprints,
            'workItems' => $workItems,
            'focusWorkItems' => $focusWorkItems,
            'currentSprint' => $currentSprint,
            'users' => $orgUsers,
            'selectedAssigneeId' => $selectedAssigneeId,
        ]);
    }
}
