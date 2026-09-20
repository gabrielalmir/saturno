<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureHasOrganization
{
    /**
     * Routes that should be excluded from the organization check.
     */
    protected array $except = [
        'settings/organization/create',
        'settings/organization',
        'logout',
    ];

    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        // Skip check for guests
        if (! $user) {
            return $next($request);
        }

        // Skip excluded routes
        foreach ($this->except as $pattern) {
            if ($request->is($pattern)) {
                return $next($request);
            }
        }

        // Check if user has a current organization
        if (! $user->current_organization_id) {
            // Try to set one if user has organizations
            $firstOrg = $user->organizations()->first();

            if ($firstOrg) {
                $user->update(['current_organization_id' => $firstOrg->id]);

                return $next($request);
            }

            // Redirect to create organization
            return redirect()->route('organization.create');
        }

        // Ensure a project context exists inside current organization.
        $currentProject = $user->currentProject;
        $projectBelongsToOrg = $currentProject && (int) $currentProject->organization_id === (int) $user->current_organization_id;

        if (! $projectBelongsToOrg) {
            $firstProjectId = $user->projects()
                ->where('organization_id', $user->current_organization_id)
                ->value('projects.id');

            if ($firstProjectId) {
                $user->update(['current_project_id' => $firstProjectId]);
            }
        }

        return $next($request);
    }
}
