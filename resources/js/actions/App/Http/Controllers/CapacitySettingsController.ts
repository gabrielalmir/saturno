import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\CapacitySettingsController::index
* @see app/Http/Controllers/CapacitySettingsController.php:9
* @route '/settings/capacity'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/settings/capacity',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CapacitySettingsController::index
* @see app/Http/Controllers/CapacitySettingsController.php:9
* @route '/settings/capacity'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CapacitySettingsController::index
* @see app/Http/Controllers/CapacitySettingsController.php:9
* @route '/settings/capacity'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\CapacitySettingsController::index
* @see app/Http/Controllers/CapacitySettingsController.php:9
* @route '/settings/capacity'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\CapacitySettingsController::index
* @see app/Http/Controllers/CapacitySettingsController.php:9
* @route '/settings/capacity'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\CapacitySettingsController::index
* @see app/Http/Controllers/CapacitySettingsController.php:9
* @route '/settings/capacity'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\CapacitySettingsController::index
* @see app/Http/Controllers/CapacitySettingsController.php:9
* @route '/settings/capacity'
*/
indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

index.form = indexForm

const CapacitySettingsController = { index }

export default CapacitySettingsController