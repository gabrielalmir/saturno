import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\HealthcheckController::__invoke
* @see app/Http/Controllers/HealthcheckController.php:7
* @route '/health'
*/
const HealthcheckController = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: HealthcheckController.url(options),
    method: 'get',
})

HealthcheckController.definition = {
    methods: ["get","head"],
    url: '/health',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\HealthcheckController::__invoke
* @see app/Http/Controllers/HealthcheckController.php:7
* @route '/health'
*/
HealthcheckController.url = (options?: RouteQueryOptions) => {
    return HealthcheckController.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\HealthcheckController::__invoke
* @see app/Http/Controllers/HealthcheckController.php:7
* @route '/health'
*/
HealthcheckController.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: HealthcheckController.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\HealthcheckController::__invoke
* @see app/Http/Controllers/HealthcheckController.php:7
* @route '/health'
*/
HealthcheckController.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: HealthcheckController.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\HealthcheckController::__invoke
* @see app/Http/Controllers/HealthcheckController.php:7
* @route '/health'
*/
const HealthcheckControllerForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: HealthcheckController.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\HealthcheckController::__invoke
* @see app/Http/Controllers/HealthcheckController.php:7
* @route '/health'
*/
HealthcheckControllerForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: HealthcheckController.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\HealthcheckController::__invoke
* @see app/Http/Controllers/HealthcheckController.php:7
* @route '/health'
*/
HealthcheckControllerForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: HealthcheckController.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

HealthcheckController.form = HealthcheckControllerForm

export default HealthcheckController