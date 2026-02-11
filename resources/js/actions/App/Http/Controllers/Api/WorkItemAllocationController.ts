import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\WorkItemAllocationController::index
* @see app/Http/Controllers/Api/WorkItemAllocationController.php:12
* @route '/api/work-items/{workItem}/allocations'
*/
export const index = (args: { workItem: number | { id: number } } | [workItem: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/work-items/{workItem}/allocations',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\WorkItemAllocationController::index
* @see app/Http/Controllers/Api/WorkItemAllocationController.php:12
* @route '/api/work-items/{workItem}/allocations'
*/
index.url = (args: { workItem: number | { id: number } } | [workItem: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { workItem: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { workItem: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            workItem: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        workItem: typeof args.workItem === 'object'
        ? args.workItem.id
        : args.workItem,
    }

    return index.definition.url
            .replace('{workItem}', parsedArgs.workItem.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\WorkItemAllocationController::index
* @see app/Http/Controllers/Api/WorkItemAllocationController.php:12
* @route '/api/work-items/{workItem}/allocations'
*/
index.get = (args: { workItem: number | { id: number } } | [workItem: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\WorkItemAllocationController::index
* @see app/Http/Controllers/Api/WorkItemAllocationController.php:12
* @route '/api/work-items/{workItem}/allocations'
*/
index.head = (args: { workItem: number | { id: number } } | [workItem: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\WorkItemAllocationController::index
* @see app/Http/Controllers/Api/WorkItemAllocationController.php:12
* @route '/api/work-items/{workItem}/allocations'
*/
const indexForm = (args: { workItem: number | { id: number } } | [workItem: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\WorkItemAllocationController::index
* @see app/Http/Controllers/Api/WorkItemAllocationController.php:12
* @route '/api/work-items/{workItem}/allocations'
*/
indexForm.get = (args: { workItem: number | { id: number } } | [workItem: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\WorkItemAllocationController::index
* @see app/Http/Controllers/Api/WorkItemAllocationController.php:12
* @route '/api/work-items/{workItem}/allocations'
*/
indexForm.head = (args: { workItem: number | { id: number } } | [workItem: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

index.form = indexForm

/**
* @see \App\Http\Controllers\Api\WorkItemAllocationController::store
* @see app/Http/Controllers/Api/WorkItemAllocationController.php:21
* @route '/api/work-items/{workItem}/allocations'
*/
export const store = (args: { workItem: number | { id: number } } | [workItem: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/work-items/{workItem}/allocations',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\WorkItemAllocationController::store
* @see app/Http/Controllers/Api/WorkItemAllocationController.php:21
* @route '/api/work-items/{workItem}/allocations'
*/
store.url = (args: { workItem: number | { id: number } } | [workItem: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { workItem: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { workItem: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            workItem: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        workItem: typeof args.workItem === 'object'
        ? args.workItem.id
        : args.workItem,
    }

    return store.definition.url
            .replace('{workItem}', parsedArgs.workItem.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\WorkItemAllocationController::store
* @see app/Http/Controllers/Api/WorkItemAllocationController.php:21
* @route '/api/work-items/{workItem}/allocations'
*/
store.post = (args: { workItem: number | { id: number } } | [workItem: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\WorkItemAllocationController::store
* @see app/Http/Controllers/Api/WorkItemAllocationController.php:21
* @route '/api/work-items/{workItem}/allocations'
*/
const storeForm = (args: { workItem: number | { id: number } } | [workItem: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\WorkItemAllocationController::store
* @see app/Http/Controllers/Api/WorkItemAllocationController.php:21
* @route '/api/work-items/{workItem}/allocations'
*/
storeForm.post = (args: { workItem: number | { id: number } } | [workItem: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\Api\WorkItemAllocationController::update
* @see app/Http/Controllers/Api/WorkItemAllocationController.php:48
* @route '/api/work-items/{workItem}/allocations/{userId}'
*/
export const update = (args: { workItem: number | { id: number }, userId: string | number } | [workItem: number | { id: number }, userId: string | number ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/api/work-items/{workItem}/allocations/{userId}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Api\WorkItemAllocationController::update
* @see app/Http/Controllers/Api/WorkItemAllocationController.php:48
* @route '/api/work-items/{workItem}/allocations/{userId}'
*/
update.url = (args: { workItem: number | { id: number }, userId: string | number } | [workItem: number | { id: number }, userId: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            workItem: args[0],
            userId: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        workItem: typeof args.workItem === 'object'
        ? args.workItem.id
        : args.workItem,
        userId: args.userId,
    }

    return update.definition.url
            .replace('{workItem}', parsedArgs.workItem.toString())
            .replace('{userId}', parsedArgs.userId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\WorkItemAllocationController::update
* @see app/Http/Controllers/Api/WorkItemAllocationController.php:48
* @route '/api/work-items/{workItem}/allocations/{userId}'
*/
update.put = (args: { workItem: number | { id: number }, userId: string | number } | [workItem: number | { id: number }, userId: string | number ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\Api\WorkItemAllocationController::update
* @see app/Http/Controllers/Api/WorkItemAllocationController.php:48
* @route '/api/work-items/{workItem}/allocations/{userId}'
*/
const updateForm = (args: { workItem: number | { id: number }, userId: string | number } | [workItem: number | { id: number }, userId: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\WorkItemAllocationController::update
* @see app/Http/Controllers/Api/WorkItemAllocationController.php:48
* @route '/api/work-items/{workItem}/allocations/{userId}'
*/
updateForm.put = (args: { workItem: number | { id: number }, userId: string | number } | [workItem: number | { id: number }, userId: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\Api\WorkItemAllocationController::destroy
* @see app/Http/Controllers/Api/WorkItemAllocationController.php:63
* @route '/api/work-items/{workItem}/allocations/{userId}'
*/
export const destroy = (args: { workItem: number | { id: number }, userId: string | number } | [workItem: number | { id: number }, userId: string | number ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/api/work-items/{workItem}/allocations/{userId}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Api\WorkItemAllocationController::destroy
* @see app/Http/Controllers/Api/WorkItemAllocationController.php:63
* @route '/api/work-items/{workItem}/allocations/{userId}'
*/
destroy.url = (args: { workItem: number | { id: number }, userId: string | number } | [workItem: number | { id: number }, userId: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            workItem: args[0],
            userId: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        workItem: typeof args.workItem === 'object'
        ? args.workItem.id
        : args.workItem,
        userId: args.userId,
    }

    return destroy.definition.url
            .replace('{workItem}', parsedArgs.workItem.toString())
            .replace('{userId}', parsedArgs.userId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\WorkItemAllocationController::destroy
* @see app/Http/Controllers/Api/WorkItemAllocationController.php:63
* @route '/api/work-items/{workItem}/allocations/{userId}'
*/
destroy.delete = (args: { workItem: number | { id: number }, userId: string | number } | [workItem: number | { id: number }, userId: string | number ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Api\WorkItemAllocationController::destroy
* @see app/Http/Controllers/Api/WorkItemAllocationController.php:63
* @route '/api/work-items/{workItem}/allocations/{userId}'
*/
const destroyForm = (args: { workItem: number | { id: number }, userId: string | number } | [workItem: number | { id: number }, userId: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\WorkItemAllocationController::destroy
* @see app/Http/Controllers/Api/WorkItemAllocationController.php:63
* @route '/api/work-items/{workItem}/allocations/{userId}'
*/
destroyForm.delete = (args: { workItem: number | { id: number }, userId: string | number } | [workItem: number | { id: number }, userId: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

const WorkItemAllocationController = { index, store, update, destroy }

export default WorkItemAllocationController