import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\BoardController::sprintBoard
* @see app/Http/Controllers/BoardController.php:16
* @route '/sprint-board'
*/
export const sprintBoard = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: sprintBoard.url(options),
    method: 'get',
})

sprintBoard.definition = {
    methods: ["get","head"],
    url: '/sprint-board',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\BoardController::sprintBoard
* @see app/Http/Controllers/BoardController.php:16
* @route '/sprint-board'
*/
sprintBoard.url = (options?: RouteQueryOptions) => {
    return sprintBoard.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\BoardController::sprintBoard
* @see app/Http/Controllers/BoardController.php:16
* @route '/sprint-board'
*/
sprintBoard.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: sprintBoard.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\BoardController::sprintBoard
* @see app/Http/Controllers/BoardController.php:16
* @route '/sprint-board'
*/
sprintBoard.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: sprintBoard.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\BoardController::sprintBoard
* @see app/Http/Controllers/BoardController.php:16
* @route '/sprint-board'
*/
const sprintBoardForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: sprintBoard.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\BoardController::sprintBoard
* @see app/Http/Controllers/BoardController.php:16
* @route '/sprint-board'
*/
sprintBoardForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: sprintBoard.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\BoardController::sprintBoard
* @see app/Http/Controllers/BoardController.php:16
* @route '/sprint-board'
*/
sprintBoardForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: sprintBoard.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

sprintBoard.form = sprintBoardForm

/**
* @see \App\Http\Controllers\BoardController::show
* @see app/Http/Controllers/BoardController.php:26
* @route '/boards/{board}'
*/
export const show = (args: { board: number | { id: number } } | [board: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/boards/{board}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\BoardController::show
* @see app/Http/Controllers/BoardController.php:26
* @route '/boards/{board}'
*/
show.url = (args: { board: number | { id: number } } | [board: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return show.definition.url
            .replace('{board}', parsedArgs.board.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\BoardController::show
* @see app/Http/Controllers/BoardController.php:26
* @route '/boards/{board}'
*/
show.get = (args: { board: number | { id: number } } | [board: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\BoardController::show
* @see app/Http/Controllers/BoardController.php:26
* @route '/boards/{board}'
*/
show.head = (args: { board: number | { id: number } } | [board: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\BoardController::show
* @see app/Http/Controllers/BoardController.php:26
* @route '/boards/{board}'
*/
const showForm = (args: { board: number | { id: number } } | [board: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\BoardController::show
* @see app/Http/Controllers/BoardController.php:26
* @route '/boards/{board}'
*/
showForm.get = (args: { board: number | { id: number } } | [board: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\BoardController::show
* @see app/Http/Controllers/BoardController.php:26
* @route '/boards/{board}'
*/
showForm.head = (args: { board: number | { id: number } } | [board: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

show.form = showForm

/**
* @see \App\Http\Controllers\BoardController::store
* @see app/Http/Controllers/BoardController.php:36
* @route '/boards'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/boards',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\BoardController::store
* @see app/Http/Controllers/BoardController.php:36
* @route '/boards'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\BoardController::store
* @see app/Http/Controllers/BoardController.php:36
* @route '/boards'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\BoardController::store
* @see app/Http/Controllers/BoardController.php:36
* @route '/boards'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\BoardController::store
* @see app/Http/Controllers/BoardController.php:36
* @route '/boards'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\BoardController::update
* @see app/Http/Controllers/BoardController.php:60
* @route '/boards/{board}'
*/
export const update = (args: { board: number | { id: number } } | [board: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/boards/{board}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\BoardController::update
* @see app/Http/Controllers/BoardController.php:60
* @route '/boards/{board}'
*/
update.url = (args: { board: number | { id: number } } | [board: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return update.definition.url
            .replace('{board}', parsedArgs.board.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\BoardController::update
* @see app/Http/Controllers/BoardController.php:60
* @route '/boards/{board}'
*/
update.put = (args: { board: number | { id: number } } | [board: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\BoardController::update
* @see app/Http/Controllers/BoardController.php:60
* @route '/boards/{board}'
*/
const updateForm = (args: { board: number | { id: number } } | [board: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\BoardController::update
* @see app/Http/Controllers/BoardController.php:60
* @route '/boards/{board}'
*/
updateForm.put = (args: { board: number | { id: number } } | [board: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\BoardController::destroy
* @see app/Http/Controllers/BoardController.php:79
* @route '/boards/{board}'
*/
export const destroy = (args: { board: number | { id: number } } | [board: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/boards/{board}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\BoardController::destroy
* @see app/Http/Controllers/BoardController.php:79
* @route '/boards/{board}'
*/
destroy.url = (args: { board: number | { id: number } } | [board: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return destroy.definition.url
            .replace('{board}', parsedArgs.board.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\BoardController::destroy
* @see app/Http/Controllers/BoardController.php:79
* @route '/boards/{board}'
*/
destroy.delete = (args: { board: number | { id: number } } | [board: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\BoardController::destroy
* @see app/Http/Controllers/BoardController.php:79
* @route '/boards/{board}'
*/
const destroyForm = (args: { board: number | { id: number } } | [board: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\BoardController::destroy
* @see app/Http/Controllers/BoardController.php:79
* @route '/boards/{board}'
*/
destroyForm.delete = (args: { board: number | { id: number } } | [board: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

const BoardController = { sprintBoard, show, store, update, destroy }

export default BoardController