<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\UserAvailability;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class UserAvailabilityController extends Controller
{
    public function index(Request $request)
    {
        $actor = $request->user();
        $orgId = $request->user()->current_organization_id;
        $canManageAll = in_array($actor->currentOrganizationRole(), ['admin', 'maintainer'], true);

        $query = UserAvailability::where('organization_id', $orgId)
            ->with('user:id,name,email');

        if ($request->has('user_id')) {
            $requestedUserId = (int) $request->user_id;
            if (! $canManageAll && $requestedUserId !== (int) $actor->id) {
                abort(403);
            }

            $query->where('user_id', $requestedUserId);
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
        $actor = $request->user();
        $orgId = (int) $actor->current_organization_id;
        $canManageAll = in_array($actor->currentOrganizationRole(), ['admin', 'maintainer'], true);

        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'availability_percentage' => 'required|integer|min:0|max:100',
            'reason' => 'nullable|string|max:255',
        ]);

        $targetUserId = (int) $validated['user_id'];
        $isOrgMember = DB::table('organization_user')
            ->where('organization_id', $orgId)
            ->where('user_id', $targetUserId)
            ->exists();
        if (! $isOrgMember) {
            abort(422, 'Usuario nao pertence a organizacao atual.');
        }

        if (! $canManageAll && $targetUserId !== (int) $actor->id) {
            abort(403);
        }

        $validated['organization_id'] = $orgId;

        $availability = UserAvailability::create($validated);

        return response()->json($availability->load('user:id,name,email'), 201);
    }

    public function update(Request $request, UserAvailability $availability)
    {
        $actor = $request->user();
        $orgId = (int) $actor->current_organization_id;
        $canManageAll = in_array($actor->currentOrganizationRole(), ['admin', 'maintainer'], true);

        if ((int) $availability->organization_id !== $orgId) {
            abort(404);
        }

        if (! $canManageAll && (int) $availability->user_id !== (int) $actor->id) {
            abort(403);
        }

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
        $actor = request()->user();
        $orgId = (int) $actor->current_organization_id;
        $canManageAll = in_array($actor->currentOrganizationRole(), ['admin', 'maintainer'], true);

        if ((int) $availability->organization_id !== $orgId) {
            abort(404);
        }

        if (! $canManageAll && (int) $availability->user_id !== (int) $actor->id) {
            abort(403);
        }

        $availability->delete();

        return response()->json(null, 204);
    }
}
