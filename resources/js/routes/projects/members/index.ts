import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Settings\ProjectController::invite
* @see app/Http/Controllers/Settings/ProjectController.php:62
* @route '/settings/projects/{project}/members'
*/
export const invite = (args: { project: number | { id: number } } | [project: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: invite.url(args, options),
    method: 'post',
})

invite.definition = {
    methods: ["post"],
    url: '/settings/projects/{project}/members',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Settings\ProjectController::invite
* @see app/Http/Controllers/Settings/ProjectController.php:62
* @route '/settings/projects/{project}/members'
*/
invite.url = (args: { project: number | { id: number } } | [project: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { project: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { project: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            project: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        project: typeof args.project === 'object'
        ? args.project.id
        : args.project,
    }

    return invite.definition.url
            .replace('{project}', parsedArgs.project.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\ProjectController::invite
* @see app/Http/Controllers/Settings/ProjectController.php:62
* @route '/settings/projects/{project}/members'
*/
invite.post = (args: { project: number | { id: number } } | [project: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: invite.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Settings\ProjectController::invite
* @see app/Http/Controllers/Settings/ProjectController.php:62
* @route '/settings/projects/{project}/members'
*/
const inviteForm = (args: { project: number | { id: number } } | [project: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: invite.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Settings\ProjectController::invite
* @see app/Http/Controllers/Settings/ProjectController.php:62
* @route '/settings/projects/{project}/members'
*/
inviteForm.post = (args: { project: number | { id: number } } | [project: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: invite.url(args, options),
    method: 'post',
})

invite.form = inviteForm

const members = {
    invite: Object.assign(invite, invite),
}

export default members