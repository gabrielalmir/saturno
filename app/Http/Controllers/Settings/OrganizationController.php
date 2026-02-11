<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Models\Organization;
use App\Models\Project;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class OrganizationController extends Controller
{
    private function ensureAdmin(Request $request): Organization
    {
        $user = $request->user();
        $organization = $user->currentOrganization;

        if (! $organization) {
            abort(404);
        }

        $role = $user->currentOrganizationRole();
        if ($role !== 'admin') {
            abort(403);
        }

        return $organization;
    }

    private function ensureManager(Request $request): Organization
    {
        $user = $request->user();
        $organization = $user->currentOrganization;

        if (! $organization) {
            abort(404);
        }

        $role = $user->currentOrganizationRole();
        if (! in_array($role, ['admin', 'maintainer'], true)) {
            abort(403);
        }

        return $organization;
    }

    public function edit(Request $request)
    {
        $user = $request->user();
        $organization = $user->currentOrganization;

        if (! $organization) {
            // Check if user has any other organizations
            $firstOrg = $user->organizations()->first();

            if ($firstOrg) {
                // Switch to the first available organization
                $user->update(['current_organization_id' => $firstOrg->id]);

                return redirect()->route('organization.edit');
            }

            // Redirect to creation page if no organizations exist
            return redirect()->route('organization.create');
        }

        $members = $organization->users()
            ->orderBy('name')
            ->get()
            ->map(fn ($member) => [
                'id' => $member->id,
                'name' => $member->name,
                'email' => $member->email,
                'role' => $member->pivot?->role,
            ]);

        return Inertia::render('settings/organization', [
            'organization' => [
                'id' => $organization->id,
                'name' => $organization->name,
                'slug' => $organization->slug,
                'description' => $organization->description,
                'logo_path' => $organization->logo_path,
                'planning_unit' => $organization->planning_unit ?? 'story_points',
            ],
            'members' => $members,
            'roles' => ['admin', 'maintainer', 'analyst', 'user'],
            'currentUserRole' => $user->currentOrganizationRole(),
        ]);
    }

    public function create()
    {
        return Inertia::render('settings/create-organization');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:organizations,slug',
            'description' => 'nullable|string',
            'logo' => 'nullable|image|max:2048',
            'planning_unit' => 'nullable|in:hours,story_points',
        ]);

        if (! isset($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['name']);
        }

        if ($request->hasFile('logo')) {
            $path = $request->file('logo')->store('organization-logos', 'public');
            $validated['logo_path'] = $path;
        }

        if (! isset($validated['planning_unit'])) {
            $validated['planning_unit'] = 'story_points';
        }

        $organization = Organization::create($validated);

        // Attach user as admin
        $organization->users()->attach($request->user()->id, ['role' => 'admin']);

        // Set as current organization
        $project = Project::create([
            'organization_id' => $organization->id,
            'name' => 'Projeto Principal',
            'slug' => 'projeto-principal',
            'description' => 'Projeto padrão da organização',
            'settings' => [],
        ]);
        $project->users()->attach($request->user()->id, ['role' => 'manager']);

        $request->user()->update([
            'current_organization_id' => $organization->id,
            'current_project_id' => $project->id,
        ]);

        return redirect()->route('dashboard');
    }

    public function update(Request $request)
    {
        $organization = $request->user()->currentOrganization;
        if (! $organization) {
            abort(404);
        }

        $role = $request->user()->currentOrganizationRole();
        if (! in_array($role, ['admin', 'maintainer'], true)) {
            abort(403);
        }

        $rules = [
            'planning_unit' => 'nullable|in:hours,story_points',
        ];

        if ($role === 'admin') {
            $rules['name'] = 'required|string|max:255';
            $rules['description'] = 'nullable|string';
            $rules['logo'] = 'nullable|image|max:2048';
        }

        $validated = $request->validate($rules);

        if ($role === 'admin' && $request->hasFile('logo')) {
            $path = $request->file('logo')->store('organization-logos', 'public');
            $validated['logo_path'] = $path;
        }

        $organization->update($validated);

        return redirect()->back();
    }

    public function inviteMember(Request $request)
    {
        $organization = $this->ensureAdmin($request);

        $validated = $request->validate([
            'email' => 'required|email',
            'role' => 'required|in:admin,maintainer,analyst,user',
        ]);

        $member = User::where('email', $validated['email'])->first();

        if (! $member) {
            $name = Str::before($validated['email'], '@');
            $member = User::create([
                'name' => $name ?: 'Convidado',
                'email' => $validated['email'],
                'password' => bcrypt(Str::random(24)),
                'current_organization_id' => $organization->id,
            ]);
        }

        $organization->users()->syncWithoutDetaching([
            $member->id => ['role' => $validated['role']],
        ]);

        if (! $member->current_organization_id) {
            $member->current_organization_id = $organization->id;
            $member->current_project_id = $organization->projects()->value('id');
            $member->save();
        }

        $defaultProjectId = $organization->projects()->value('id');
        if ($defaultProjectId) {
            $organization->projects()
                ->where('projects.id', $defaultProjectId)
                ->first()
                ?->users()
                ->syncWithoutDetaching([
                    $member->id => ['role' => 'member'],
                ]);
        }

        return redirect()->back();
    }

    public function updateMemberRole(Request $request, User $member)
    {
        $organization = $this->ensureManager($request);

        $validated = $request->validate([
            'role' => 'required|in:admin,maintainer,analyst,user',
        ]);

        $organization->users()->updateExistingPivot($member->id, [
            'role' => $validated['role'],
        ]);

        return redirect()->back();
    }

    public function removeMember(Request $request, User $member)
    {
        $organization = $this->ensureAdmin($request);

        if ((int) $member->id === (int) $request->user()->id) {
            return redirect()->back()->withErrors([
                'member' => 'Nao e possivel remover seu proprio usuario.',
            ]);
        }

        $adminCount = $organization->users()->wherePivot('role', 'admin')->count();
        $memberRole = $organization->users()->where('users.id', $member->id)->first()?->pivot?->role;

        if ($memberRole === 'admin' && $adminCount <= 1) {
            return redirect()->back()->withErrors([
                'member' => 'A organizacao precisa ter pelo menos um administrador.',
            ]);
        }

        $organization->users()->detach($member->id);

        return redirect()->back();
    }

    public function switchOrganization(Request $request)
    {
        $validated = $request->validate([
            'organization_id' => 'required|exists:organizations,id',
        ]);

        $user = $request->user();
        $isMember = $user->organizations()->where('organizations.id', $validated['organization_id'])->exists();

        if (! $isMember) {
            abort(403);
        }

        $user->current_organization_id = $validated['organization_id'];
        $firstProjectId = $user->projects()
            ->where('organization_id', $validated['organization_id'])
            ->value('projects.id');
        $user->current_project_id = $firstProjectId;
        $user->save();

        return redirect()->back();
    }

    public function destroy(Request $request)
    {
        $user = $request->user();
        $organization = $user->currentOrganization;

        if (! $organization) {
            abort(404);
        }

        // Only admin can delete
        $role = $user->currentOrganizationRole();
        if ($role !== 'admin') {
            abort(403);
        }

        // Must have at least one other organization
        $otherOrgs = $user->organizations()->where('organizations.id', '!=', $organization->id)->get();
        if ($otherOrgs->isEmpty()) {
            return redirect()->back()->withErrors([
                'organization' => 'Voce precisa ter pelo menos uma outra organizacao antes de deletar esta.',
            ]);
        }

        // Switch to another organization before deleting
        $user->update(['current_organization_id' => $otherOrgs->first()->id]);

        // Delete the organization (cascade will delete related data)
        $organization->delete();

        return redirect()->route('dashboard');
    }
}
