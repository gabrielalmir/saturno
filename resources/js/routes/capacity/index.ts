import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
/**
* @see \App\Http\Controllers\CapacitySettingsController::settings
* @see app/Http/Controllers/CapacitySettingsController.php:9
* @route '/settings/capacity'
*/
export const settings = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: settings.url(options),
    method: 'get',
})

settings.definition = {
    methods: ["get","head"],
    url: '/settings/capacity',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CapacitySettingsController::settings
* @see app/Http/Controllers/CapacitySettingsController.php:9
* @route '/settings/capacity'
*/
settings.url = (options?: RouteQueryOptions) => {
    return settings.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CapacitySettingsController::settings
* @see app/Http/Controllers/CapacitySettingsController.php:9
* @route '/settings/capacity'
*/
settings.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: settings.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\CapacitySettingsController::settings
* @see app/Http/Controllers/CapacitySettingsController.php:9
* @route '/settings/capacity'
*/
settings.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: settings.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\CapacitySettingsController::settings
* @see app/Http/Controllers/CapacitySettingsController.php:9
* @route '/settings/capacity'
*/
const settingsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: settings.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\CapacitySettingsController::settings
* @see app/Http/Controllers/CapacitySettingsController.php:9
* @route '/settings/capacity'
*/
settingsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: settings.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\CapacitySettingsController::settings
* @see app/Http/Controllers/CapacitySettingsController.php:9
* @route '/settings/capacity'
*/
settingsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: settings.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

settings.form = settingsForm

const capacity = {
    settings: Object.assign(settings, settings),
}

export default capacity