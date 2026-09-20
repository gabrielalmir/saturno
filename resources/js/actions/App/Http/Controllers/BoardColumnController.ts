import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\BoardColumnController::store
* @see app/Http/Controllers/BoardColumnController.php:12
* @route '/boards/{board}/columns'
*/
export const store = (args: { board: number | { id: number } } | [board: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/boards/{board}/columns',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\BoardColumnController::store
* @see app/Http/Controllers/BoardColumnController.php:12
* @route '/boards/{board}/columns'
*/
store.url = (args: { board: number | { id: number } } | [board: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { board: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { board: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            board: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        board: typeof args.board === 'object'
        ? args.board.id
        : args.board,
    }

    return store.definition.url
            .replace('{board}', parsedArgs.board.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\BoardColumnController::store
* @see app/Http/Controllers/BoardColumnController.php:12
* @route '/boards/{board}/columns'
*/
store.post = (args: { board: number | { id: number } } | [board: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\BoardColumnController::store
* @see app/Http/Controllers/BoardColumnController.php:12
* @route '/boards/{board}/columns'
*/
const storeForm = (args: { board: number | { id: number } } | [board: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\BoardColumnController::store
* @see app/Http/Controllers/BoardColumnController.php:12
* @route '/boards/{board}/columns'
*/
storeForm.post = (args: { board: number | { id: number } } | [board: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\BoardColumnController::update
* @see app/Http/Controllers/BoardColumnController.php:43
* @route '/boards/{board}/columns/{column}'
*/
export const update = (args: { board: number | { id: number }, column: number | { id: number } } | [board: number | { id: number }, column: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/boards/{board}/columns/{column}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\BoardColumnController::update
* @see app/Http/Controllers/BoardColumnController.php:43
* @route '/boards/{board}/columns/{column}'
*/
update.url = (args: { board: number | { id: number }, column: number | { id: number } } | [board: number | { id: number }, column: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            board: args[0],
            column: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        board: typeof args.board === 'object'
        ? args.board.id
        : args.board,
        column: typeof args.column === 'object'
        ? args.column.id
        : args.column,
    }

    return update.definition.url
            .replace('{board}', parsedArgs.board.toString())
            .replace('{column}', parsedArgs.column.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\BoardColumnController::update
* @see app/Http/Controllers/BoardColumnController.php:43
* @route '/boards/{board}/columns/{column}'
*/
update.put = (args: { board: number | { id: number }, column: number | { id: number } } | [board: number | { id: number }, column: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\BoardColumnController::update
* @see app/Http/Controllers/BoardColumnController.php:43
* @route '/boards/{board}/columns/{column}'
*/
const updateForm = (args: { board: number | { id: number }, column: number | { id: number } } | [board: number | { id: number }, column: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\BoardColumnController::update
* @see app/Http/Controllers/BoardColumnController.php:43
* @route '/boards/{board}/columns/{column}'
*/
updateForm.put = (args: { board: number | { id: number }, column: number | { id: number } } | [board: number | { id: number }, column: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\BoardColumnController::reorder
* @see app/Http/Controllers/BoardColumnController.php:70
* @route '/boards/{board}/columns/reorder'
*/
export const reorder = (args: { board: number | { id: number } } | [board: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reorder.url(args, options),
    method: 'post',
})

reorder.definition = {
    methods: ["post"],
    url: '/boards/{board}/columns/reorder',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\BoardColumnController::reorder
* @see app/Http/Controllers/BoardColumnController.php:70
* @route '/boards/{board}/columns/reorder'
*/
reorder.url = (args: { board: number | { id: number } } | [board: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { board: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { board: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            board: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        board: typeof args.board === 'object'
        ? args.board.id
        : args.board,
    }

    return reorder.definition.url
            .replace('{board}', parsedArgs.board.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\BoardColumnController::reorder
* @see app/Http/Controllers/BoardColumnController.php:70
* @route '/boards/{board}/columns/reorder'
*/
reorder.post = (args: { board: number | { id: number } } | [board: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reorder.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\BoardColumnController::reorder
* @see app/Http/Controllers/BoardColumnController.php:70
* @route '/boards/{board}/columns/reorder'
*/
const reorderForm = (args: { board: number | { id: number } } | [board: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: reorder.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\BoardColumnController::reorder
* @see app/Http/Controllers/BoardColumnController.php:70
* @route '/boards/{board}/columns/reorder'
*/
reorderForm.post = (args: { board: number | { id: number } } | [board: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: reorder.url(args, options),
    method: 'post',
})

reorder.form = reorderForm

/**
* @see \App\Http\Controllers\BoardColumnController::destroy
* @see app/Http/Controllers/BoardColumnController.php:95
* @route '/boards/{board}/columns/{column}'
*/
export const destroy = (args: { board: number | { id: number }, column: number | { id: number } } | [board: number | { id: number }, column: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/boards/{board}/columns/{column}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\BoardColumnController::destroy
* @see app/Http/Controllers/BoardColumnController.php:95
* @route '/boards/{board}/columns/{column}'
*/
destroy.url = (args: { board: number | { id: number }, column: number | { id: number } } | [board: number | { id: number }, column: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            board: args[0],
            column: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        board: typeof args.board === 'object'
        ? args.board.id
        : args.board,
        column: typeof args.column === 'object'
        ? args.column.id
        : args.column,
    }

    return destroy.definition.url
            .replace('{board}', parsedArgs.board.toString())
            .replace('{column}', parsedArgs.column.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\BoardColumnController::destroy
* @see app/Http/Controllers/BoardColumnController.php:95
* @route '/boards/{board}/columns/{column}'
*/
destroy.delete = (args: { board: number | { id: number }, column: number | { id: number } } | [board: number | { id: number }, column: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\BoardColumnController::destroy
* @see app/Http/Controllers/BoardColumnController.php:95
* @route '/boards/{board}/columns/{column}'
*/
const destroyForm = (args: { board: number | { id: number }, column: number | { id: number } } | [board: number | { id: number }, column: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\BoardColumnController::destroy
* @see app/Http/Controllers/BoardColumnController.php:95
* @route '/boards/{board}/columns/{column}'
*/
destroyForm.delete = (args: { board: number | { id: number }, column: number | { id: number } } | [board: number | { id: number }, column: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

const BoardColumnController = { store, update, reorder, destroy }

export default BoardColumnController