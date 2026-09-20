<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();
        $organizations = $user
            ? $user->organizations()->get()->map(fn ($organization) => [
                'id' => $organization->id,
                'name' => $organization->name,
                'slug' => $organization->slug,
                'logo_path' => $organization->logo_path,
                'planning_unit' => $organization->planning_unit ?? 'story_points',
                'role' => $organization->pivot?->role,
            ])
            : [];

        $currentOrganization = $user && $user->currentOrganization
            ? [
                'id' => $user->currentOrganization->id,
                'name' => $user->currentOrganization->name,
                'slug' => $user->currentOrganization->slug,
                'logo_path' => $user->currentOrganization->logo_path,
                'planning_unit' => $user->currentOrganization->planning_unit ?? 'story_points',
            ]
            : null;

        $projects = ($user && $user->current_organization_id)
            ? $user->projects()
                ->where('projects.organization_id', $user->current_organization_id)
                ->get()
                ->map(fn ($project) => [
                    'id' => $project->id,
                    'name' => $project->name,
                    'slug' => $project->slug,
                    'description' => $project->description,
                    'role' => $project->pivot?->role,
                ])
            : [];

        $currentProject = ($user && $user->currentProject && (int) $user->currentProject->organization_id === (int) $user->current_organization_id)
            ? [
                'id' => $user->currentProject->id,
                'name' => $user->currentProject->name,
                'slug' => $user->currentProject->slug,
                'description' => $user->currentProject->description,
            ]
            : null;

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'auth' => [
                'user' => $user,
                'organizations' => $organizations,
                'currentOrganization' => $currentOrganization,
                'currentOrganizationRole' => $user?->currentOrganizationRole(),
                'projects' => $projects,
                'currentProject' => $currentProject,
            ],
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
        ];
    }
}
