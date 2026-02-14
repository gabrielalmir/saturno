<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Sprint;
use App\Models\SprintUserN1Reservation;
use App\Models\User;
use Illuminate\Http\Request;

class SprintN1ReservationController extends Controller
{
    public function index(Request $request, Sprint $sprint)
    {
        $user = $request->user();
        $orgId = (int) $user->current_organization_id;

        if ((int) $sprint->organization_id !== $orgId) {
            abort(404);
        }

        if ($user->current_project_id && (int) $sprint->project_id !== (int) $user->current_project_id) {
            abort(404);
        }

        $orgRole = $user->currentOrganizationRole();
        $canManageAll = in_array($orgRole, ['admin', 'maintainer'], true);

        $users = User::whereHas('organizations', function ($query) use ($orgId) {
            $query->where('organizations.id', $orgId);
        })
            ->orderBy('name')
            ->get(['id', 'name', 'email']);

        $reservations = SprintUserN1Reservation::where('sprint_id', $sprint->id)
            ->get()
            ->keyBy('user_id');

        return response()->json([
            'sprint_id' => $sprint->id,
            'use_member_n1_reserve' => (bool) $sprint->use_member_n1_reserve,
            'default_reserved_n1' => (int) ($sprint->capacity_reserved_n1 ?? 0),
            'reservations' => $users->map(function (User $u) use ($reservations, $user, $canManageAll) {
                $reservation = $reservations->get($u->id);

                return [
                    'user_id' => $u->id,
                    'user_name' => $u->name,
                    'reserved_n1' => $reservation?->reserved_n1, // nullable until configured
                    'can_edit' => $canManageAll || (int) $user->id === (int) $u->id,
                ];
            })->values()->all(),
        ]);
    }

    public function upsert(Request $request, Sprint $sprint, User $user)
    {
        $actor = $request->user();
        $orgId = (int) $actor->current_organization_id;

        if ((int) $sprint->organization_id !== $orgId) {
            abort(404);
        }

        if ($actor->current_project_id && (int) $sprint->project_id !== (int) $actor->current_project_id) {
            abort(404);
        }

        $orgRole = $actor->currentOrganizationRole();
        $canManageAll = in_array($orgRole, ['admin', 'maintainer'], true);
        if (! $canManageAll && (int) $actor->id !== (int) $user->id) {
            abort(403);
        }

        $belongsToOrg = $user->organizations()
            ->where('organizations.id', $orgId)
            ->exists();
        if (! $belongsToOrg) {
            abort(422, 'Usuario nao pertence a organizacao atual.');
        }

        $validated = $request->validate([
            'reserved_n1' => 'nullable|integer|min:0|max:100000',
        ]);

        $reservation = SprintUserN1Reservation::updateOrCreate(
            ['sprint_id' => $sprint->id, 'user_id' => $user->id],
            ['reserved_n1' => $validated['reserved_n1'] ?? null],
        );

        return response()->json([
            'sprint_id' => $sprint->id,
            'user_id' => $user->id,
            'reserved_n1' => $reservation->reserved_n1,
        ]);
    }
}
