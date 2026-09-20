import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Settings\ProjectController::switchProject
* @see app/Http/Controllers/Settings/ProjectController.php:101
* @route '/projects/switch'
*/
export const switchProject = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: switchProject.url(options),
    method: 'post',
})

switchProject.definition = {
    methods: ["post"],
    url: '/projects/switch',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Settings\ProjectController::switchProject
* @see app/Http/Controllers/Settings/ProjectController.php:101
* @route '/projects/switch'
*/
switchProject.url = (options?: RouteQueryOptions) => {
    return switchProject.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\ProjectController::switchProject
* @see app/Http/Controllers/Settings/ProjectController.php:101
* @route '/projects/switch'
*/
switchProject.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: switchProject.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Settings\ProjectController::switchProject
* @see app/Http/Controllers/Settings/ProjectController.php:101
* @route '/projects/switch'
*/
const switchProjectForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: switchProject.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Settings\ProjectController::switchProject
* @see app/Http/Controllers/Settings/ProjectController.php:101
* @route '/projects/switch'
*/
switchProjectForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: switchProject.url(options),
    method: 'post',
})

switchProject.form = switchProjectForm

/**
* @see \App\Http\Controllers\Settings\ProjectController::store
* @see app/Http/Controllers/Settings/ProjectController.php:13
* @route '/settings/projects'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/settings/projects',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Settings\ProjectController::store
* @see app/Http/Controllers/Settings/ProjectController.php:13
* @route '/settings/projects'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\ProjectController::store
* @see app/Http/Controllers/Settings/ProjectController.php:13
* @route '/settings/projects'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Settings\ProjectController::store
* @see app/Http/Controllers/Settings/ProjectController.php:13
* @route '/settings/projects'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Settings\ProjectController::store
* @see app/Http/Controllers/Settings/ProjectController.php:13
* @route '/settings/projects'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\Settings\ProjectController::inviteMember
* @see app/Http/Controllers/Settings/ProjectController.php:62
* @route '/settings/projects/{project}/members'
*/
export const inviteMember = (args: { project: number | { id: number } } | [project: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: inviteMember.url(args, options),
    method: 'post',
})

inviteMember.definition = {
    methods: ["post"],
    url: '/settings/projects/{project}/members',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Settings\ProjectController::inviteMember
* @see app/Http/Controllers/Settings/ProjectController.php:62
* @route '/settings/projects/{project}/members'
*/
inviteMember.url = (args: { project: number | { id: number } } | [project: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return inviteMember.definition.url
            .replace('{project}', parsedArgs.project.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\ProjectController::inviteMember
* @see app/Http/Controllers/Settings/ProjectController.php:62
* @route '/settings/projects/{project}/members'
*/
inviteMember.post = (args: { project: number | { id: number } } | [project: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: inviteMember.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Settings\ProjectController::inviteMember
* @see app/Http/Controllers/Settings/ProjectController.php:62
* @route '/settings/projects/{project}/members'
*/
const inviteMemberForm = (args: { project: number | { id: number } } | [project: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: inviteMember.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Settings\ProjectController::inviteMember
* @see app/Http/Controllers/Settings/ProjectController.php:62
* @route '/settings/projects/{project}/members'
*/
inviteMemberForm.post = (args: { project: number | { id: number } } | [project: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: inviteMember.url(args, options),
    method: 'post',
})

inviteMember.form = inviteMemberForm

const ProjectController = { switchProject, store, inviteMember }

export default ProjectController