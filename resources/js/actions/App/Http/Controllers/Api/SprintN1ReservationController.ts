import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\SprintN1ReservationController::index
* @see app/Http/Controllers/Api/SprintN1ReservationController.php:13
* @route '/api/sprints/{sprint}/n1-reservations'
*/
export const index = (args: { sprint: number | { id: number } } | [sprint: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/sprints/{sprint}/n1-reservations',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\SprintN1ReservationController::index
* @see app/Http/Controllers/Api/SprintN1ReservationController.php:13
* @route '/api/sprints/{sprint}/n1-reservations'
*/
index.url = (args: { sprint: number | { id: number } } | [sprint: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { sprint: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { sprint: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            sprint: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        sprint: typeof args.sprint === 'object'
        ? args.sprint.id
        : args.sprint,
    }

    return index.definition.url
            .replace('{sprint}', parsedArgs.sprint.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\SprintN1ReservationController::index
* @see app/Http/Controllers/Api/SprintN1ReservationController.php:13
* @route '/api/sprints/{sprint}/n1-reservations'
*/
index.get = (args: { sprint: number | { id: number } } | [sprint: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\SprintN1ReservationController::index
* @see app/Http/Controllers/Api/SprintN1ReservationController.php:13
* @route '/api/sprints/{sprint}/n1-reservations'
*/
index.head = (args: { sprint: number | { id: number } } | [sprint: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\SprintN1ReservationController::index
* @see app/Http/Controllers/Api/SprintN1ReservationController.php:13
* @route '/api/sprints/{sprint}/n1-reservations'
*/
const indexForm = (args: { sprint: number | { id: number } } | [sprint: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\SprintN1ReservationController::index
* @see app/Http/Controllers/Api/SprintN1ReservationController.php:13
* @route '/api/sprints/{sprint}/n1-reservations'
*/
indexForm.get = (args: { sprint: number | { id: number } } | [sprint: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\SprintN1ReservationController::index
* @see app/Http/Controllers/Api/SprintN1ReservationController.php:13
* @route '/api/sprints/{sprint}/n1-reservations'
*/
indexForm.head = (args: { sprint: number | { id: number } } | [sprint: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Api\SprintN1ReservationController::upsert
* @see app/Http/Controllers/Api/SprintN1ReservationController.php:52
* @route '/api/sprints/{sprint}/n1-reservations/{user}'
*/
export const upsert = (args: { sprint: number | { id: number }, user: number | { id: number } } | [sprint: number | { id: number }, user: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: upsert.url(args, options),
    method: 'put',
})

upsert.definition = {
    methods: ["put"],
    url: '/api/sprints/{sprint}/n1-reservations/{user}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Api\SprintN1ReservationController::upsert
* @see app/Http/Controllers/Api/SprintN1ReservationController.php:52
* @route '/api/sprints/{sprint}/n1-reservations/{user}'
*/
upsert.url = (args: { sprint: number | { id: number }, user: number | { id: number } } | [sprint: number | { id: number }, user: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            sprint: args[0],
            user: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        sprint: typeof args.sprint === 'object'
        ? args.sprint.id
        : args.sprint,
        user: typeof args.user === 'object'
        ? args.user.id
        : args.user,
    }

    return upsert.definition.url
            .replace('{sprint}', parsedArgs.sprint.toString())
            .replace('{user}', parsedArgs.user.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\SprintN1ReservationController::upsert
* @see app/Http/Controllers/Api/SprintN1ReservationController.php:52
* @route '/api/sprints/{sprint}/n1-reservations/{user}'
*/
upsert.put = (args: { sprint: number | { id: number }, user: number | { id: number } } | [sprint: number | { id: number }, user: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: upsert.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\Api\SprintN1ReservationController::upsert
* @see app/Http/Controllers/Api/SprintN1ReservationController.php:52
* @route '/api/sprints/{sprint}/n1-reservations/{user}'
*/
const upsertForm = (args: { sprint: number | { id: number }, user: number | { id: number } } | [sprint: number | { id: number }, user: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: upsert.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\SprintN1ReservationController::upsert
* @see app/Http/Controllers/Api/SprintN1ReservationController.php:52
* @route '/api/sprints/{sprint}/n1-reservations/{user}'
*/
upsertForm.put = (args: { sprint: number | { id: number }, user: number | { id: number } } | [sprint: number | { id: number }, user: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: upsert.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

upsert.form = upsertForm

const SprintN1ReservationController = { index, upsert }

export default SprintN1ReservationController