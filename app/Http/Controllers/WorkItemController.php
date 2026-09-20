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
use Illuminate\Validation\Rule;
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

        $existsInScope = function (string $table) use ($orgId, $projectId) {
            return Rule::exists($table, 'id')->where(function ($query) use ($orgId, $projectId) {
                $query->where('organization_id', $orgId);

                if ($projectId) {
                    $query->where('project_id', $projectId);
                } else {
                    $query->whereNull('project_id');
                }
            });
        };

        $validated = $request->validate([
            'team_id' => ['required', $existsInScope('teams')],
            'parent_id' => ['nullable', $existsInScope('work_items')],
            'sprint_id' => ['nullable', $existsInScope('sprints')],
            'assignee_id' => [
                'nullable',
                'integer',
                Rule::exists('organization_user', 'user_id')->where(fn ($query) => $query->where('organization_id', $orgId)),
            ],
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'type' => 'required|string|max:50',
            'priority' => 'required|string|max:10',
            'status' => 'nullable|in:backlog,ready',
            'estimate' => 'nullable|integer|min:0',
            'tier' => 'required|in:N1,N2',
            'jira_key' => 'nullable|string|max:50',
            'ticket_id' => ['nullable', $existsInScope('tickets')],
        ]);

        $validated['organization_id'] = $orgId;
        $validated['project_id'] = $projectId;
        $validated['reporter_id'] = (int) $request->user()->id;

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

        $orgId = (int) $workItem->organization_id;
        $projectId = $workItem->project_id !== null ? (int) $workItem->project_id : null;
        $existsInScope = function (string $table) use ($orgId, $projectId) {
            return Rule::exists($table, 'id')->where(function ($query) use ($orgId, $projectId) {
                $query->where('organization_id', $orgId);

                if ($projectId) {
                    $query->where('project_id', $projectId);
                } else {
                    $query->whereNull('project_id');
                }
            });
        };

        $validated = $request->validate([
            'team_id' => ['sometimes', $existsInScope('teams')],
            'parent_id' => ['nullable', $existsInScope('work_items')],
            'sprint_id' => ['nullable', $existsInScope('sprints')],
            'assignee_id' => [
                'nullable',
                'integer',
                Rule::exists('organization_user', 'user_id')->where(fn ($query) => $query->where('organization_id', $orgId)),
            ],
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
            'ticket_id' => ['nullable', $existsInScope('tickets')],
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
