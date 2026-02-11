<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ProjectController extends Controller
{
    public function store(Request $request)
    {
        $user = $request->user();
        $organization = $user->currentOrganization;
        if (! $organization) {
            abort(404);
        }

        if (! in_array($user->currentOrganizationRole(), ['admin', 'maintainer'], true)) {
            abort(403);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255',
            'description' => 'nullable|string',
        ]);

        $slug = isset($validated['slug']) && $validated['slug'] !== ''
            ? Str::slug($validated['slug'])
            : Str::slug($validated['name']);

        $project = Project::create([
            'organization_id' => $organization->id,
            'name' => $validated['name'],
            'slug' => $slug,
            'description' => $validated['description'] ?? null,
            'settings' => [],
        ]);

        // Creator always becomes manager of the project.
        $project->users()->syncWithoutDetaching([
            $user->id => ['role' => 'manager'],
        ]);

        $organization->users()
            ->wherePivotIn('role', ['admin', 'maintainer'])
            ->get(['users.id'])
            ->each(function ($member) use ($project) {
                $project->users()->syncWithoutDetaching([
                    $member->id => ['role' => 'manager'],
                ]);
            });

        $user->update(['current_project_id' => $project->id]);

        return redirect()->back();
    }

    public function inviteMember(Request $request, Project $project)
    {
        $user = $request->user();
        $organization = $user->currentOrganization;

        if (! $organization || (int) $project->organization_id !== (int) $organization->id) {
            abort(404);
        }

        if (! in_array($user->currentOrganizationRole(), ['admin', 'maintainer'], true)) {
            abort(403);
        }

        $validated = $request->validate([
            'email' => 'required|email',
            'role' => 'required|in:manager,member',
        ]);

        $member = User::where('email', $validated['email'])->first();
        if (! $member) {
            return redirect()->back()->withErrors([
                'email' => 'Usuário não encontrado. Convide-o primeiro para a organização.',
            ]);
        }

        $isOrgMember = $organization->users()->where('users.id', $member->id)->exists();
        if (! $isOrgMember) {
            return redirect()->back()->withErrors([
                'email' => 'O usuário precisa ser membro da organização para entrar no projeto.',
            ]);
        }

        $project->users()->syncWithoutDetaching([
            $member->id => ['role' => $validated['role']],
        ]);

        return redirect()->back();
    }

    public function switchProject(Request $request)
    {
        $validated = $request->validate([
            'project_id' => 'required|exists:projects,id',
        ]);

        $user = $request->user();
        $project = Project::query()->findOrFail((int) $validated['project_id']);

        if ((int) $project->organization_id !== (int) $user->current_organization_id) {
            abort(403);
        }

        $isProjectMember = $user->projects()->where('projects.id', $project->id)->exists();
        if (! $isProjectMember) {
            abort(403);
        }

        $user->current_project_id = $project->id;
        $user->save();

        return redirect()->back();
    }
}
