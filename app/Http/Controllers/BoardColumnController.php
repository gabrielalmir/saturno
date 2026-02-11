<?php

namespace App\Http\Controllers;

use App\Models\Board;
use App\Models\BoardColumn;
use App\Models\BoardItem;
use Illuminate\Http\Request;

class BoardColumnController extends Controller
{
    public function store(Request $request, Board $board)
    {
        $projectId = $request->user()->current_project_id;
        if ((int) $board->organization_id !== (int) $request->user()->current_organization_id || ($projectId && (int) $board->project_id !== (int) $projectId)) {
            abort(404);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'kind' => 'required|in:status,category,priority,grouping',
            'status_mapping' => 'nullable|in:backlog,ready,in_progress,blocked,done',
            'color' => 'nullable|string|max:20',
        ]);

        if ($validated['kind'] !== 'status') {
            $validated['status_mapping'] = null;
        }

        $nextPosition = ($board->columns()->max('position') ?? 0) + 1;

        $board->columns()->create([
            'name' => $validated['name'],
            'kind' => $validated['kind'],
            'status_mapping' => $validated['status_mapping'] ?? null,
            'color' => $validated['color'] ?? null,
            'position' => $nextPosition,
        ]);

        return redirect()->back();
    }

    public function update(Request $request, Board $board, BoardColumn $column)
    {
        $projectId = $request->user()->current_project_id;
        if ((int) $board->organization_id !== (int) $request->user()->current_organization_id || ($projectId && (int) $board->project_id !== (int) $projectId)) {
            abort(404);
        }

        if ((int) $column->board_id !== (int) $board->id) {
            abort(404);
        }

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'kind' => 'sometimes|in:status,category,priority,grouping',
            'status_mapping' => 'nullable|in:backlog,ready,in_progress,blocked,done',
            'color' => 'nullable|string|max:20',
        ]);

        if (isset($validated['kind']) && $validated['kind'] !== 'status') {
            $validated['status_mapping'] = null;
        }

        $column->update($validated);

        return redirect()->back();
    }

    public function reorder(Request $request, Board $board)
    {
        $projectId = $request->user()->current_project_id;
        if ((int) $board->organization_id !== (int) $request->user()->current_organization_id || ($projectId && (int) $board->project_id !== (int) $projectId)) {
            abort(404);
        }

        $validated = $request->validate([
            'column_ids' => 'required|array',
            'column_ids.*' => 'integer',
        ]);

        $ids = $validated['column_ids'];
        $existing = $board->columns()->whereIn('id', $ids)->pluck('id')->all();

        foreach ($ids as $index => $id) {
            if (! in_array($id, $existing, true)) {
                continue;
            }
            BoardColumn::where('id', $id)->update(['position' => $index + 1]);
        }

        return redirect()->back();
    }

    public function destroy(Request $request, Board $board, BoardColumn $column)
    {
        $projectId = $request->user()->current_project_id;
        if ((int) $board->organization_id !== (int) $request->user()->current_organization_id || ($projectId && (int) $board->project_id !== (int) $projectId)) {
            abort(404);
        }

        if ((int) $column->board_id !== (int) $board->id) {
            abort(404);
        }

        if ($board->columns()->count() <= 1) {
            abort(422, 'O board precisa ter ao menos uma coluna.');
        }

        $validated = $request->validate([
            'fallback_column_id' => 'required|integer',
        ]);

        $fallbackId = (int) $validated['fallback_column_id'];
        $fallback = $board->columns()->where('id', $fallbackId)->first();
        if (! $fallback) {
            abort(422, 'Coluna de destino invalida.');
        }

        $maxPosition = (int) (BoardItem::where('column_id', $fallbackId)->max('position') ?? 0);
        $items = BoardItem::where('column_id', $column->id)->orderBy('position')->get();
        foreach ($items as $item) {
            $maxPosition += 1;
            $item->update([
                'column_id' => $fallbackId,
                'position' => $maxPosition,
            ]);
        }

        $column->delete();

        return redirect()->back();
    }
}
