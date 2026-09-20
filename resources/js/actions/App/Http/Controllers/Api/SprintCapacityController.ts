import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\SprintCapacityController::summary
* @see app/Http/Controllers/Api/SprintCapacityController.php:17
* @route '/api/sprints/{sprint}/capacity'
*/
export const summary = (args: { sprint: number | { id: number } } | [sprint: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: summary.url(args, options),
    method: 'get',
})

summary.definition = {
    methods: ["get","head"],
    url: '/api/sprints/{sprint}/capacity',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\SprintCapacityController::summary
* @see app/Http/Controllers/Api/SprintCapacityController.php:17
* @route '/api/sprints/{sprint}/capacity'
*/
summary.url = (args: { sprint: number | { id: number } } | [sprint: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return summary.definition.url
            .replace('{sprint}', parsedArgs.sprint.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\SprintCapacityController::summary
* @see app/Http/Controllers/Api/SprintCapacityController.php:17
* @route '/api/sprints/{sprint}/capacity'
*/
summary.get = (args: { sprint: number | { id: number } } | [sprint: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: summary.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\SprintCapacityController::summary
* @see app/Http/Controllers/Api/SprintCapacityController.php:17
* @route '/api/sprints/{sprint}/capacity'
*/
summary.head = (args: { sprint: number | { id: number } } | [sprint: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: summary.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\SprintCapacityController::summary
* @see app/Http/Controllers/Api/SprintCapacityController.php:17
* @route '/api/sprints/{sprint}/capacity'
*/
const summaryForm = (args: { sprint: number | { id: number } } | [sprint: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: summary.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\SprintCapacityController::summary
* @see app/Http/Controllers/Api/SprintCapacityController.php:17
* @route '/api/sprints/{sprint}/capacity'
*/
summaryForm.get = (args: { sprint: number | { id: number } } | [sprint: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: summary.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\SprintCapacityController::summary
* @see app/Http/Controllers/Api/SprintCapacityController.php:17
* @route '/api/sprints/{sprint}/capacity'
*/
summaryForm.head = (args: { sprint: number | { id: number } } | [sprint: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: summary.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

summary.form = summaryForm

/**
* @see \App\Http\Controllers\Api\SprintCapacityController::userCapacity
* @see app/Http/Controllers/Api/SprintCapacityController.php:24
* @route '/api/sprints/{sprint}/capacity/users'
*/
export const userCapacity = (args: { sprint: number | { id: number } } | [sprint: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: userCapacity.url(args, options),
    method: 'get',
})

userCapacity.definition = {
    methods: ["get","head"],
    url: '/api/sprints/{sprint}/capacity/users',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\SprintCapacityController::userCapacity
* @see app/Http/Controllers/Api/SprintCapacityController.php:24
* @route '/api/sprints/{sprint}/capacity/users'
*/
userCapacity.url = (args: { sprint: number | { id: number } } | [sprint: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return userCapacity.definition.url
            .replace('{sprint}', parsedArgs.sprint.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\SprintCapacityController::userCapacity
* @see app/Http/Controllers/Api/SprintCapacityController.php:24
* @route '/api/sprints/{sprint}/capacity/users'
*/
userCapacity.get = (args: { sprint: number | { id: number } } | [sprint: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: userCapacity.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\SprintCapacityController::userCapacity
* @see app/Http/Controllers/Api/SprintCapacityController.php:24
* @route '/api/sprints/{sprint}/capacity/users'
*/
userCapacity.head = (args: { sprint: number | { id: number } } | [sprint: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: userCapacity.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\SprintCapacityController::userCapacity
* @see app/Http/Controllers/Api/SprintCapacityController.php:24
* @route '/api/sprints/{sprint}/capacity/users'
*/
const userCapacityForm = (args: { sprint: number | { id: number } } | [sprint: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: userCapacity.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\SprintCapacityController::userCapacity
* @see app/Http/Controllers/Api/SprintCapacityController.php:24
* @route '/api/sprints/{sprint}/capacity/users'
*/
userCapacityForm.get = (args: { sprint: number | { id: number } } | [sprint: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: userCapacity.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\SprintCapacityController::userCapacity
* @see app/Http/Controllers/Api/SprintCapacityController.php:24
* @route '/api/sprints/{sprint}/capacity/users'
*/
userCapacityForm.head = (args: { sprint: number | { id: number } } | [sprint: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: userCapacity.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

userCapacity.form = userCapacityForm

/**
* @see \App\Http\Controllers\Api\SprintCapacityController::workingDays
* @see app/Http/Controllers/Api/SprintCapacityController.php:61
* @route '/api/sprints/{sprint}/capacity/working-days'
*/
export const workingDays = (args: { sprint: number | { id: number } } | [sprint: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: workingDays.url(args, options),
    method: 'get',
})

workingDays.definition = {
    methods: ["get","head"],
    url: '/api/sprints/{sprint}/capacity/working-days',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\SprintCapacityController::workingDays
* @see app/Http/Controllers/Api/SprintCapacityController.php:61
* @route '/api/sprints/{sprint}/capacity/working-days'
*/
workingDays.url = (args: { sprint: number | { id: number } } | [sprint: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return workingDays.definition.url
            .replace('{sprint}', parsedArgs.sprint.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\SprintCapacityController::workingDays
* @see app/Http/Controllers/Api/SprintCapacityController.php:61
* @route '/api/sprints/{sprint}/capacity/working-days'
*/
workingDays.get = (args: { sprint: number | { id: number } } | [sprint: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: workingDays.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\SprintCapacityController::workingDays
* @see app/Http/Controllers/Api/SprintCapacityController.php:61
* @route '/api/sprints/{sprint}/capacity/working-days'
*/
workingDays.head = (args: { sprint: number | { id: number } } | [sprint: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: workingDays.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\SprintCapacityController::workingDays
* @see app/Http/Controllers/Api/SprintCapacityController.php:61
* @route '/api/sprints/{sprint}/capacity/working-days'
*/
const workingDaysForm = (args: { sprint: number | { id: number } } | [sprint: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: workingDays.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\SprintCapacityController::workingDays
* @see app/Http/Controllers/Api/SprintCapacityController.php:61
* @route '/api/sprints/{sprint}/capacity/working-days'
*/
workingDaysForm.get = (args: { sprint: number | { id: number } } | [sprint: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: workingDays.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\SprintCapacityController::workingDays
* @see app/Http/Controllers/Api/SprintCapacityController.php:61
* @route '/api/sprints/{sprint}/capacity/working-days'
*/
workingDaysForm.head = (args: { sprint: number | { id: number } } | [sprint: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: workingDays.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

workingDays.form = workingDaysForm

const SprintCapacityController = { summary, userCapacity, workingDays }

export default SprintCapacityController