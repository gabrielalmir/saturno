<?php

namespace App\Http\Controllers;

use App\Models\Epic;
use App\Models\Sprint;
use App\Models\WorkItem;
use App\Modules\WorkManagement\Application\Exceptions\NotFound;
use App\Modules\WorkManagement\Application\UseCases\WorkItems\ChangeWorkItemStatus;
use App\Modules\WorkManagement\Domain\Exceptions\InvalidWorkItemTransition;
use App\Modules\WorkManagement\Domain\Exceptions\MissingAssignee;
use App\Modules\WorkManagement\Domain\Exceptions\MissingBlockedReason;
use App\Modules\WorkManagement\Domain\Exceptions\MissingEstimateForN2;
use App\Modules\WorkManagement\Domain\Exceptions\WipLimitExceeded;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use InvalidArgumentException;

class WorkItemController extends Controller
{
    public function index(Request $request)
    {
        $orgId = $request->user()->current_organization_id;
        $projectId = $request->user()->current_project_id;
        $workItems = WorkItem::with(['parent', 'sprint', 'assignee'])
            ->where('organization_id', $orgId)
            ->when($projectId, fn ($q) => $q->where('project_id', $projectId))
            ->orderByDesc('created_at')
            ->paginate(30);

        $sprints = Sprint::where('organization_id', $orgId)
            ->when($projectId, fn ($q) => $q->where('project_id', $projectId))
            ->orderByDesc('start_date')
            ->get();

        $users = $request->user()->currentOrganization->users()->get();
        $epics = Epic::where('organization_id', $orgId)
            ->when($projectId, fn ($q) => $q->where('project_id', $projectId))
            ->orderBy('title')
            ->get();

        return Inertia::render('work-items', [
            'workItems' => $workItems,
            'sprints' => $sprints,
            'users' => $users,
            'epics' => $epics,
        ]);
    }

    public function store(Request $request)
    {
        $orgId = $request->user()->current_organization_id;
        $projectId = $request->user()->current_project_id;
        $validated = $request->validate([
            'team_id' => 'required|exists:teams,id',
            'parent_id' => 'nullable|exists:work_items,id',
            'sprint_id' => 'nullable|exists:sprints,id',
            'assignee_id' => 'nullable|exists:users,id',
            'reporter_id' => 'nullable|exists:users,id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'type' => 'nullable|string',
            'priority' => 'nullable|string',
            'status' => 'nullable|string',
            'estimate' => 'nullable|integer|min:0',
            'tier' => 'sometimes|string',
            'jira_key' => 'nullable|string|max:50',
            'ticket_id' => 'nullable|exists:tickets,id',
        ]);

        $validated['organization_id'] = $orgId;
        $validated['project_id'] = $projectId;

        $workItem = WorkItem::create($validated);

        return redirect()->back()->with('work_item_id', $workItem->id);
    }

    public function show(Request $request, WorkItem $workItem)
    {
        $this->authorizeOrg($request, $workItem->organization_id, $workItem->project_id);

        $workItem->load(['sprint', 'assignee', 'reporter', 'epic', 'ticket', 'parent', 'children', 'events', 'integrationLinks']);

        return Inertia::render('work-item-detail', [
            'workItem' => $workItem,
        ]);
    }

    public function update(Request $request, WorkItem $workItem, ChangeWorkItemStatus $changeStatus)
    {
        $this->authorizeOrg($request, $workItem->organization_id, $workItem->project_id);

        $validated = $request->validate([
            'team_id' => 'sometimes|exists:teams,id',
            'parent_id' => 'nullable|exists:work_items,id',
            'sprint_id' => 'nullable|exists:sprints,id',
            'assignee_id' => 'nullable|exists:users,id',
            'reporter_id' => 'nullable|exists:users,id',
            'title' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'type' => 'nullable|string',
            'priority' => 'nullable|string',
            'status' => 'nullable|string',
            'estimate' => 'nullable|integer|min:0',
            'tier' => 'sometimes|string',
            'started_at' => 'nullable|date',
            'blocked_at' => 'nullable|date',
            'blocked_reason' => 'nullable|string',
            'completed_at' => 'nullable|date',
            'due_date' => 'nullable|date',
            'planned_for' => 'nullable|date',
            'jira_key' => 'nullable|string|max:50',
            'ticket_id' => 'nullable|exists:tickets,id',
        ]);

        // Apply workflow rules for status transitions (WIP limit, invalid jumps, required fields, etc.).
        if (array_key_exists('status', $validated) && is_string($validated['status'])) {
            try {
                $changeStatus->execute(
                    (int) $workItem->id,
                    $validated['status'],
                    $validated['blocked_reason'] ?? null,
                    $validated['sprint_id'] ?? null
                );
            } catch (NotFound) {
                abort(404);
            } catch (InvalidArgumentException $e) {
                throw ValidationException::withMessages(['status' => $e->getMessage()]);
            } catch (MissingAssignee $e) {
                throw ValidationException::withMessages(['assignee_id' => $e->getMessage()]);
            } catch (MissingEstimateForN2 $e) {
                throw ValidationException::withMessages(['estimate' => $e->getMessage()]);
            } catch (MissingBlockedReason $e) {
                throw ValidationException::withMessages(['blocked_reason' => $e->getMessage()]);
            } catch (InvalidWorkItemTransition|WipLimitExceeded $e) {
                throw ValidationException::withMessages(['status' => $e->getMessage()]);
            }

            unset($validated['status']);
        }

        $workItem->update($validated);

        return redirect()->back();
    }

    public function destroy(Request $request, WorkItem $workItem)
    {
        $this->authorizeOrg($request, $workItem->organization_id, $workItem->project_id);

        if ($workItem->status === 'done') {
            throw ValidationException::withMessages([
                'delete' => 'Itens concluídos não podem ser excluídos.',
            ]);
        }

        $workItem->delete();

        return redirect()->back();
    }

    private function authorizeOrg(Request $request, int $organizationId, ?int $projectId): void
    {
        if ($organizationId !== $request->user()->current_organization_id) {
            abort(403);
        }

        $currentProjectId = $request->user()->current_project_id;
        if ($currentProjectId && (int) $projectId !== (int) $currentProjectId) {
            abort(403);
        }
    }
}
