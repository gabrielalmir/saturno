<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Holiday;
use Illuminate\Http\Request;

class HolidayController extends Controller
{
    public function index(Request $request)
    {
        $orgId = $request->user()->current_organization_id;

        $query = Holiday::where('organization_id', $orgId);

        if ($request->has('year')) {
            $year = $request->year;
            $query->where(function ($q) use ($year) {
                $q->whereYear('date', $year)
                    ->orWhere('is_recurring', true);
            });
        }

        $holidays = $query->orderBy('date')->get();

        return response()->json($holidays);
    }

    public function store(Request $request)
    {
        $this->ensureManager($request);

        $validated = $request->validate([
            'date' => 'required|date',
            'name' => 'required|string|max:255',
            'is_recurring' => 'boolean',
        ]);

        $validated['organization_id'] = $request->user()->current_organization_id;

        $holiday = Holiday::create($validated);

        return response()->json($holiday, 201);
    }

    public function update(Request $request, Holiday $holiday)
    {
        $this->ensureManager($request);

        if ((int) $holiday->organization_id !== (int) $request->user()->current_organization_id) {
            abort(404);
        }

        $validated = $request->validate([
            'date' => 'sometimes|date',
            'name' => 'sometimes|string|max:255',
            'is_recurring' => 'sometimes|boolean',
        ]);

        $holiday->update($validated);

        return response()->json($holiday);
    }

    public function destroy(Holiday $holiday)
    {
        $request = request();
        $this->ensureManager($request);

        if ((int) $holiday->organization_id !== (int) $request->user()->current_organization_id) {
            abort(404);
        }

        $holiday->delete();

        return response()->json(null, 204);
    }

    private function ensureManager(Request $request): void
    {
        if (! in_array($request->user()->currentOrganizationRole(), ['admin', 'maintainer'], true)) {
            abort(403);
        }
    }
}
