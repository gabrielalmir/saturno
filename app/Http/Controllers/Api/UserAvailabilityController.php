<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\UserAvailability;
use Illuminate\Http\Request;

class UserAvailabilityController extends Controller
{
    public function index(Request $request)
    {
        $orgId = $request->user()->current_organization_id;

        $query = UserAvailability::where('organization_id', $orgId)
            ->with('user:id,name,email');

        if ($request->has('user_id')) {
            $query->where('user_id', $request->user_id);
        }

        if ($request->has('start_date')) {
            $query->where('end_date', '>=', $request->start_date);
        }

        if ($request->has('end_date')) {
            $query->where('start_date', '<=', $request->end_date);
        }

        $availabilities = $query->orderBy('start_date')->get();

        return response()->json($availabilities);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'availability_percentage' => 'required|integer|min:0|max:100',
            'reason' => 'nullable|string|max:255',
        ]);

        $validated['organization_id'] = $request->user()->current_organization_id;

        $availability = UserAvailability::create($validated);

        return response()->json($availability->load('user:id,name,email'), 201);
    }

    public function update(Request $request, UserAvailability $availability)
    {
        $validated = $request->validate([
            'start_date' => 'sometimes|date',
            'end_date' => 'sometimes|date|after_or_equal:start_date',
            'availability_percentage' => 'sometimes|integer|min:0|max:100',
            'reason' => 'nullable|string|max:255',
        ]);

        $availability->update($validated);

        return response()->json($availability->load('user:id,name,email'));
    }

    public function destroy(UserAvailability $availability)
    {
        $availability->delete();

        return response()->json(null, 204);
    }
}
