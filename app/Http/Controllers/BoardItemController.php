<?php

namespace App\Http\Controllers;

use App\Models\Board;
use App\Models\BoardItem;
use App\Models\WorkItem;
use App\Modules\WorkManagement\Application\Exceptions\NotFound;
use App\Modules\WorkManagement\Application\UseCases\WorkItems\ChangeWorkItemStatus;
use App\Modules\WorkManagement\Domain\Exceptions\InvalidWorkItemTransition;
use App\Modules\WorkManagement\Domain\Exceptions\MissingAssignee;
use App\Modules\WorkManagement\Domain\Exceptions\MissingBlockedReason;
use App\Modules\WorkManagement\Domain\Exceptions\MissingEstimateForN2;
use App\Modules\WorkManagement\Domain\Exceptions\WipLimitExceeded;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use InvalidArgumentException;

class BoardItemController extends Controller
{
    public function store(Request $request, Board $board, string $workItem, ChangeWorkItemStatus $changeStatus)
    {
        $projectId = $request->user()->current_project_id;
        if ((int) $board->organization_id !== (int) $request->user()->current_organization_id || ($projectId && (int) $board->project_id !== (int) $projectId)) {
            abort(404);
        }

        $existsInOrg = WorkItem::where('id', $workItem)->where('organization_id', $board->organization_id)->exists();
        if ($projectId) {
            $existsInOrg = WorkItem::where('id', $workItem)
                ->where('organization_id', $board->organization_id)
                ->where('project_id', $projectId)
                ->exists();
        }
        if (! $existsInOrg) {
            abort(404);
        }

        $validated = $request->validate([
            'column_id' => 'required|integer',
        ]);

        $column = $board->columns()->where('id', (int) $validated['column_id'])->first();
        if (! $column) {
            abort(422, 'Coluna invalida.');
        }

        $exists = BoardItem::where('board_id', $board->id)->where('work_item_id', $workItem)->first();
        if ($exists) {
            return redirect()->back();
        }

        $maxPosition = (int) (BoardItem::where('column_id', $column->id)->max('position') ?? 0);

        BoardItem::create([
            'board_id' => $board->id,
            'column_id' => $column->id,
            'work_item_id' => $workItem,
            'position' => $maxPosition + 1,
        ]);

        // Keep status in sync when adding a card to a status-mapped column.
        if ($column->status_mapping) {
            try {
                $changeStatus->execute((int) $workItem, $column->status_mapping);
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
        }

        return redirect()->back();
    }

    public function move(Request $request, int $board, ChangeWorkItemStatus $changeStatus)
    {
        $projectId = $request->user()->current_project_id;
        \Log::info('Board move request received', [
            'board_id_param' => $board,
            'user_id' => $request->user()->id,
            'user_org_id' => $request->user()->current_organization_id,
            'request_data' => $request->all(),
        ]);

        $boardModel = Board::find($board);

        if (! $boardModel) {
            \Log::error('Board not found', ['board_id' => $board]);
            abort(404, 'Board not found');
        }

        \Log::info('Board found', [
            'board_id' => $boardModel->id,
            'board_org_id' => $boardModel->organization_id,
        ]);

        if ((int) $boardModel->organization_id !== (int) $request->user()->current_organization_id || ($projectId && (int) $boardModel->project_id !== (int) $projectId)) {
            \Log::error('Organization mismatch', [
                'board_org' => $boardModel->organization_id,
                'user_org' => $request->user()->current_organization_id,
            ]);
            abort(404, 'Board not found in your organization');
        }

        $validated = $request->validate([
            'work_item_id' => 'required|integer',
            'from_column_id' => 'nullable|integer',
            'to_column_id' => 'required|integer',
            'blocked_reason' => 'nullable|string',
            'sprint_id' => 'nullable|integer',
            'from_order' => 'nullable|array',
            'from_order.*' => 'integer',
            'to_order' => 'nullable|array',
            'to_order.*' => 'integer',
        ]);

        $existsInOrg = WorkItem::where('id', (int) $validated['work_item_id'])
            ->where('organization_id', $boardModel->organization_id)
            ->when($projectId, fn ($q) => $q->where('project_id', $projectId))
            ->exists();
        if (! $existsInOrg) {
            abort(404);
        }

        $toColumn = $boardModel->columns()->where('id', (int) $validated['to_column_id'])->first();
        if (! $toColumn) {
            abort(422, 'Coluna de destino invalida.');
        }

        if (! empty($validated['from_column_id'])) {
            $fromColumn = $boardModel->columns()->where('id', (int) $validated['from_column_id'])->first();
            if (! $fromColumn) {
                abort(422, 'Coluna de origem invalida.');
            }
        }

        $fromStatusMapping = isset($fromColumn) ? $fromColumn->status_mapping : null;

        try {
            DB::transaction(function () use ($validated, $boardModel, $toColumn, $fromStatusMapping, $changeStatus) {
                // Repair older inconsistent data where a card is in a status column but the work item status diverged.
                // We treat the source column mapping as the intended "current" status for transition validation.
                if ($fromStatusMapping && $toColumn->status_mapping) {
                    WorkItem::query()
                        ->where('organization_id', $boardModel->organization_id)
                        ->where('id', (int) $validated['work_item_id'])
                        ->where('status', '!=', $fromStatusMapping)
                        ->update(['status' => $fromStatusMapping]);
                }

                // Apply status transition first. If it fails, the board should not change.
                if ($toColumn->status_mapping) {
                    $changeStatus->execute(
                        (int) $validated['work_item_id'],
                        $toColumn->status_mapping,
                        $validated['blocked_reason'] ?? null,
                        $validated['sprint_id'] ?? null
                    );
                }

                $boardItem = BoardItem::where('board_id', $boardModel->id)
                    ->where('work_item_id', (int) $validated['work_item_id'])
                    ->first();

                if (! $boardItem) {
                    $boardItem = BoardItem::create([
                        'board_id' => $boardModel->id,
                        'column_id' => $toColumn->id,
                        'work_item_id' => (int) $validated['work_item_id'],
                        'position' => 1,
                    ]);
                }

                $boardItem->update([
                    'column_id' => $toColumn->id,
                ]);

                if (empty($validated['to_order'])) {
                    $maxPosition = (int) (BoardItem::where('column_id', $toColumn->id)
                        ->where('id', '!=', $boardItem->id)
                        ->max('position') ?? 0);
                    $boardItem->update(['position' => $maxPosition + 1]);
                }

                if (! empty($validated['from_order'])) {
                    foreach ($validated['from_order'] as $index => $id) {
                        BoardItem::where('board_id', $boardModel->id)
                            ->where('work_item_id', (int) $id)
                            ->update(['position' => $index + 1]);
                    }
                }

                if (! empty($validated['to_order'])) {
                    foreach ($validated['to_order'] as $index => $id) {
                        BoardItem::where('board_id', $boardModel->id)
                            ->where('work_item_id', (int) $id)
                            ->update(['position' => $index + 1]);
                    }
                }
            }, 3);
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

        return redirect()->back();
    }
}
