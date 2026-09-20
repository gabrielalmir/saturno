import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\WorkCadenceController::index
* @see app/Http/Controllers/WorkCadenceController.php:11
* @route '/settings/cadences'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/settings/cadences',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\WorkCadenceController::index
* @see app/Http/Controllers/WorkCadenceController.php:11
* @route '/settings/cadences'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\WorkCadenceController::index
* @see app/Http/Controllers/WorkCadenceController.php:11
* @route '/settings/cadences'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\WorkCadenceController::index
* @see app/Http/Controllers/WorkCadenceController.php:11
* @route '/settings/cadences'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\WorkCadenceController::index
* @see app/Http/Controllers/WorkCadenceController.php:11
* @route '/settings/cadences'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\WorkCadenceController::index
* @see app/Http/Controllers/WorkCadenceController.php:11
* @route '/settings/cadences'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\WorkCadenceController::index
* @see app/Http/Controllers/WorkCadenceController.php:11
* @route '/settings/cadences'
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

/**
* @see \App\Http\Controllers\WorkCadenceController::store
* @see app/Http/Controllers/WorkCadenceController.php:27
* @route '/settings/cadences'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/settings/cadences',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\WorkCadenceController::store
* @see app/Http/Controllers/WorkCadenceController.php:27
* @route '/settings/cadences'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\WorkCadenceController::store
* @see app/Http/Controllers/WorkCadenceController.php:27
* @route '/settings/cadences'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\WorkCadenceController::store
* @see app/Http/Controllers/WorkCadenceController.php:27
* @route '/settings/cadences'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\WorkCadenceController::store
* @see app/Http/Controllers/WorkCadenceController.php:27
* @route '/settings/cadences'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\WorkCadenceController::update
* @see app/Http/Controllers/WorkCadenceController.php:44
* @route '/settings/cadences/{cadence}'
*/
export const update = (args: { cadence: number | { id: number } } | [cadence: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/settings/cadences/{cadence}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\WorkCadenceController::update
* @see app/Http/Controllers/WorkCadenceController.php:44
* @route '/settings/cadences/{cadence}'
*/
update.url = (args: { cadence: number | { id: number } } | [cadence: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { cadence: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { cadence: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            cadence: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        cadence: typeof args.cadence === 'object'
        ? args.cadence.id
        : args.cadence,
    }

    return update.definition.url
            .replace('{cadence}', parsedArgs.cadence.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\WorkCadenceController::update
* @see app/Http/Controllers/WorkCadenceController.php:44
* @route '/settings/cadences/{cadence}'
*/
update.put = (args: { cadence: number | { id: number } } | [cadence: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\WorkCadenceController::update
* @see app/Http/Controllers/WorkCadenceController.php:44
* @route '/settings/cadences/{cadence}'
*/
const updateForm = (args: { cadence: number | { id: number } } | [cadence: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\WorkCadenceController::update
* @see app/Http/Controllers/WorkCadenceController.php:44
* @route '/settings/cadences/{cadence}'
*/
updateForm.put = (args: { cadence: number | { id: number } } | [cadence: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

update.form = updateForm

/**
* @see \App\Http\Controllers\WorkCadenceController::destroy
* @see app/Http/Controllers/WorkCadenceController.php:62
* @route '/settings/cadences/{cadence}'
*/
export const destroy = (args: { cadence: number | { id: number } } | [cadence: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/settings/cadences/{cadence}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\WorkCadenceController::destroy
* @see app/Http/Controllers/WorkCadenceController.php:62
* @route '/settings/cadences/{cadence}'
*/
destroy.url = (args: { cadence: number | { id: number } } | [cadence: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { cadence: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { cadence: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            cadence: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        cadence: typeof args.cadence === 'object'
        ? args.cadence.id
        : args.cadence,
    }

    return destroy.definition.url
            .replace('{cadence}', parsedArgs.cadence.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\WorkCadenceController::destroy
* @see app/Http/Controllers/WorkCadenceController.php:62
* @route '/settings/cadences/{cadence}'
*/
destroy.delete = (args: { cadence: number | { id: number } } | [cadence: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\WorkCadenceController::destroy
* @see app/Http/Controllers/WorkCadenceController.php:62
* @route '/settings/cadences/{cadence}'
*/
const destroyForm = (args: { cadence: number | { id: number } } | [cadence: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\WorkCadenceController::destroy
* @see app/Http/Controllers/WorkCadenceController.php:62
* @route '/settings/cadences/{cadence}'
*/
destroyForm.delete = (args: { cadence: number | { id: number } } | [cadence: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

const cadences = {
    index: Object.assign(index, index),
    store: Object.assign(store, store),
    update: Object.assign(update, update),
    destroy: Object.assign(destroy, destroy),
}

export default cadences