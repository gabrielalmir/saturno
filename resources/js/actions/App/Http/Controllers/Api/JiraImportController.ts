import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\JiraImportController::store
* @see app/Http/Controllers/Api/JiraImportController.php:12
* @route '/api/jira/import'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/jira/import',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\JiraImportController::store
* @see app/Http/Controllers/Api/JiraImportController.php:12
* @route '/api/jira/import'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\JiraImportController::store
* @see app/Http/Controllers/Api/JiraImportController.php:12
* @route '/api/jira/import'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\JiraImportController::store
* @see app/Http/Controllers/Api/JiraImportController.php:12
* @route '/api/jira/import'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\JiraImportController::store
* @see app/Http/Controllers/Api/JiraImportController.php:12
* @route '/api/jira/import'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

const JiraImportController = { store }

export default JiraImportController