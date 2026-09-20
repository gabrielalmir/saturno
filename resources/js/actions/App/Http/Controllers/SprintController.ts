import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\SprintController::index
* @see app/Http/Controllers/SprintController.php:15
* @route '/sprint-planning'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/sprint-planning',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\SprintController::index
* @see app/Http/Controllers/SprintController.php:15
* @route '/sprint-planning'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\SprintController::index
* @see app/Http/Controllers/SprintController.php:15
* @route '/sprint-planning'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\SprintController::index
* @see app/Http/Controllers/SprintController.php:15
* @route '/sprint-planning'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\SprintController::index
* @see app/Http/Controllers/SprintController.php:15
* @route '/sprint-planning'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\SprintController::index
* @see app/Http/Controllers/SprintController.php:15
* @route '/sprint-planning'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\SprintController::index
* @see app/Http/Controllers/SprintController.php:15
* @route '/sprint-planning'
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
* @see \App\Http\Controllers\SprintController::store
* @see app/Http/Controllers/SprintController.php:67
* @route '/sprints'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/sprints',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\SprintController::store
* @see app/Http/Controllers/SprintController.php:67
* @route '/sprints'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\SprintController::store
* @see app/Http/Controllers/SprintController.php:67
* @route '/sprints'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\SprintController::store
* @see app/Http/Controllers/SprintController.php:67
* @route '/sprints'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\SprintController::store
* @see app/Http/Controllers/SprintController.php:67
* @route '/sprints'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\SprintController::update
* @see app/Http/Controllers/SprintController.php:109
* @route '/sprints/{sprint}'
*/
export const update = (args: { sprint: number | { id: number } } | [sprint: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/sprints/{sprint}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\SprintController::update
* @see app/Http/Controllers/SprintController.php:109
* @route '/sprints/{sprint}'
*/
update.url = (args: { sprint: number | { id: number } } | [sprint: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return update.definition.url
            .replace('{sprint}', parsedArgs.sprint.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\SprintController::update
* @see app/Http/Controllers/SprintController.php:109
* @route '/sprints/{sprint}'
*/
update.put = (args: { sprint: number | { id: number } } | [sprint: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\SprintController::update
* @see app/Http/Controllers/SprintController.php:109
* @route '/sprints/{sprint}'
*/
const updateForm = (args: { sprint: number | { id: number } } | [sprint: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\SprintController::update
* @see app/Http/Controllers/SprintController.php:109
* @route '/sprints/{sprint}'
*/
updateForm.put = (args: { sprint: number | { id: number } } | [sprint: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\SprintController::start
* @see app/Http/Controllers/SprintController.php:273
* @route '/sprints/{sprint}/start'
*/
export const start = (args: { sprint: number | { id: number } } | [sprint: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: start.url(args, options),
    method: 'post',
})

start.definition = {
    methods: ["post"],
    url: '/sprints/{sprint}/start',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\SprintController::start
* @see app/Http/Controllers/SprintController.php:273
* @route '/sprints/{sprint}/start'
*/
start.url = (args: { sprint: number | { id: number } } | [sprint: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return start.definition.url
            .replace('{sprint}', parsedArgs.sprint.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\SprintController::start
* @see app/Http/Controllers/SprintController.php:273
* @route '/sprints/{sprint}/start'
*/
start.post = (args: { sprint: number | { id: number } } | [sprint: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: start.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\SprintController::start
* @see app/Http/Controllers/SprintController.php:273
* @route '/sprints/{sprint}/start'
*/
const startForm = (args: { sprint: number | { id: number } } | [sprint: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: start.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\SprintController::start
* @see app/Http/Controllers/SprintController.php:273
* @route '/sprints/{sprint}/start'
*/
startForm.post = (args: { sprint: number | { id: number } } | [sprint: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: start.url(args, options),
    method: 'post',
})

start.form = startForm

/**
* @see \App\Http\Controllers\SprintController::complete
* @see app/Http/Controllers/SprintController.php:314
* @route '/sprints/{sprint}/complete'
*/
export const complete = (args: { sprint: number | { id: number } } | [sprint: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: complete.url(args, options),
    method: 'post',
})

complete.definition = {
    methods: ["post"],
    url: '/sprints/{sprint}/complete',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\SprintController::complete
* @see app/Http/Controllers/SprintController.php:314
* @route '/sprints/{sprint}/complete'
*/
complete.url = (args: { sprint: number | { id: number } } | [sprint: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return complete.definition.url
            .replace('{sprint}', parsedArgs.sprint.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\SprintController::complete
* @see app/Http/Controllers/SprintController.php:314
* @route '/sprints/{sprint}/complete'
*/
complete.post = (args: { sprint: number | { id: number } } | [sprint: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: complete.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\SprintController::complete
* @see app/Http/Controllers/SprintController.php:314
* @route '/sprints/{sprint}/complete'
*/
const completeForm = (args: { sprint: number | { id: number } } | [sprint: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: complete.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\SprintController::complete
* @see app/Http/Controllers/SprintController.php:314
* @route '/sprints/{sprint}/complete'
*/
completeForm.post = (args: { sprint: number | { id: number } } | [sprint: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: complete.url(args, options),
    method: 'post',
})

complete.form = completeForm

const SprintController = { index, store, update, start, complete }

export default SprintController