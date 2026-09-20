import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\BoardItemController::move
* @see app/Http/Controllers/BoardItemController.php:85
* @route '/boards/{board}/items/move'
*/
export const move = (args: { board: string | number } | [board: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: move.url(args, options),
    method: 'post',
})

move.definition = {
    methods: ["post"],
    url: '/boards/{board}/items/move',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\BoardItemController::move
* @see app/Http/Controllers/BoardItemController.php:85
* @route '/boards/{board}/items/move'
*/
move.url = (args: { board: string | number } | [board: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { board: args }
    }

    if (Array.isArray(args)) {
        args = {
            board: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        board: args.board,
    }

    return move.definition.url
            .replace('{board}', parsedArgs.board.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\BoardItemController::move
* @see app/Http/Controllers/BoardItemController.php:85
* @route '/boards/{board}/items/move'
*/
move.post = (args: { board: string | number } | [board: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: move.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\BoardItemController::move
* @see app/Http/Controllers/BoardItemController.php:85
* @route '/boards/{board}/items/move'
*/
const moveForm = (args: { board: string | number } | [board: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: move.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\BoardItemController::move
* @see app/Http/Controllers/BoardItemController.php:85
* @route '/boards/{board}/items/move'
*/
moveForm.post = (args: { board: string | number } | [board: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: move.url(args, options),
    method: 'post',
})

move.form = moveForm

/**
* @see \App\Http\Controllers\BoardItemController::store
* @see app/Http/Controllers/BoardItemController.php:22
* @route '/boards/{board}/items/{workItem}'
*/
export const store = (args: { board: number | { id: number }, workItem: string | number } | [board: number | { id: number }, workItem: string | number ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/boards/{board}/items/{workItem}',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\BoardItemController::store
* @see app/Http/Controllers/BoardItemController.php:22
* @route '/boards/{board}/items/{workItem}'
*/
store.url = (args: { board: number | { id: number }, workItem: string | number } | [board: number | { id: number }, workItem: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            board: args[0],
            workItem: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        board: typeof args.board === 'object'
        ? args.board.id
        : args.board,
        workItem: args.workItem,
    }

    return store.definition.url
            .replace('{board}', parsedArgs.board.toString())
            .replace('{workItem}', parsedArgs.workItem.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\BoardItemController::store
* @see app/Http/Controllers/BoardItemController.php:22
* @route '/boards/{board}/items/{workItem}'
*/
store.post = (args: { board: number | { id: number }, workItem: string | number } | [board: number | { id: number }, workItem: string | number ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\BoardItemController::store
* @see app/Http/Controllers/BoardItemController.php:22
* @route '/boards/{board}/items/{workItem}'
*/
const storeForm = (args: { board: number | { id: number }, workItem: string | number } | [board: number | { id: number }, workItem: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\BoardItemController::store
* @see app/Http/Controllers/BoardItemController.php:22
* @route '/boards/{board}/items/{workItem}'
*/
storeForm.post = (args: { board: number | { id: number }, workItem: string | number } | [board: number | { id: number }, workItem: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
})

store.form = storeForm

const BoardItemController = { move, store }

export default BoardItemController