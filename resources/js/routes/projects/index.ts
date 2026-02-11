import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
import members from './members'
/**
* @see \App\Http\Controllers\Settings\ProjectController::switchMethod
* @see app/Http/Controllers/Settings/ProjectController.php:101
* @route '/projects/switch'
*/
export const switchMethod = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: switchMethod.url(options),
    method: 'post',
})

switchMethod.definition = {
    methods: ["post"],
    url: '/projects/switch',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Settings\ProjectController::switchMethod
* @see app/Http/Controllers/Settings/ProjectController.php:101
* @route '/projects/switch'
*/
switchMethod.url = (options?: RouteQueryOptions) => {
    return switchMethod.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\ProjectController::switchMethod
* @see app/Http/Controllers/Settings/ProjectController.php:101
* @route '/projects/switch'
*/
switchMethod.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: switchMethod.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Settings\ProjectController::switchMethod
* @see app/Http/Controllers/Settings/ProjectController.php:101
* @route '/projects/switch'
*/
const switchMethodForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: switchMethod.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Settings\ProjectController::switchMethod
* @see app/Http/Controllers/Settings/ProjectController.php:101
* @route '/projects/switch'
*/
switchMethodForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: switchMethod.url(options),
    method: 'post',
})

switchMethod.form = switchMethodForm

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

const projects = {
    switch: Object.assign(switchMethod, switchMethod),
    store: Object.assign(store, store),
    members: Object.assign(members, members),
}

export default projects