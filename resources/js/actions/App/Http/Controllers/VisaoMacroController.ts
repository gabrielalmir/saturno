import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\VisaoMacroController::index
* @see app/Http/Controllers/VisaoMacroController.php:13
* @route '/visao-macro'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/visao-macro',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\VisaoMacroController::index
* @see app/Http/Controllers/VisaoMacroController.php:13
* @route '/visao-macro'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\VisaoMacroController::index
* @see app/Http/Controllers/VisaoMacroController.php:13
* @route '/visao-macro'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\VisaoMacroController::index
* @see app/Http/Controllers/VisaoMacroController.php:13
* @route '/visao-macro'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\VisaoMacroController::index
* @see app/Http/Controllers/VisaoMacroController.php:13
* @route '/visao-macro'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\VisaoMacroController::index
* @see app/Http/Controllers/VisaoMacroController.php:13
* @route '/visao-macro'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\VisaoMacroController::index
* @see app/Http/Controllers/VisaoMacroController.php:13
* @route '/visao-macro'
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

const VisaoMacroController = { index }

export default VisaoMacroController