import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\IntegrationController::index
* @see app/Http/Controllers/IntegrationController.php:15
* @route '/settings/integrations'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/settings/integrations',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\IntegrationController::index
* @see app/Http/Controllers/IntegrationController.php:15
* @route '/settings/integrations'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\IntegrationController::index
* @see app/Http/Controllers/IntegrationController.php:15
* @route '/settings/integrations'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\IntegrationController::index
* @see app/Http/Controllers/IntegrationController.php:15
* @route '/settings/integrations'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\IntegrationController::index
* @see app/Http/Controllers/IntegrationController.php:15
* @route '/settings/integrations'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\IntegrationController::index
* @see app/Http/Controllers/IntegrationController.php:15
* @route '/settings/integrations'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\IntegrationController::index
* @see app/Http/Controllers/IntegrationController.php:15
* @route '/settings/integrations'
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
* @see \App\Http\Controllers\IntegrationController::store
* @see app/Http/Controllers/IntegrationController.php:28
* @route '/settings/integrations'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/settings/integrations',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\IntegrationController::store
* @see app/Http/Controllers/IntegrationController.php:28
* @route '/settings/integrations'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\IntegrationController::store
* @see app/Http/Controllers/IntegrationController.php:28
* @route '/settings/integrations'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\IntegrationController::store
* @see app/Http/Controllers/IntegrationController.php:28
* @route '/settings/integrations'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\IntegrationController::store
* @see app/Http/Controllers/IntegrationController.php:28
* @route '/settings/integrations'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\IntegrationController::update
* @see app/Http/Controllers/IntegrationController.php:79
* @route '/settings/integrations/{integration}'
*/
export const update = (args: { integration: number | { id: number } } | [integration: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/settings/integrations/{integration}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\IntegrationController::update
* @see app/Http/Controllers/IntegrationController.php:79
* @route '/settings/integrations/{integration}'
*/
update.url = (args: { integration: number | { id: number } } | [integration: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { integration: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { integration: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            integration: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        integration: typeof args.integration === 'object'
        ? args.integration.id
        : args.integration,
    }

    return update.definition.url
            .replace('{integration}', parsedArgs.integration.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\IntegrationController::update
* @see app/Http/Controllers/IntegrationController.php:79
* @route '/settings/integrations/{integration}'
*/
update.put = (args: { integration: number | { id: number } } | [integration: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\IntegrationController::update
* @see app/Http/Controllers/IntegrationController.php:79
* @route '/settings/integrations/{integration}'
*/
const updateForm = (args: { integration: number | { id: number } } | [integration: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\IntegrationController::update
* @see app/Http/Controllers/IntegrationController.php:79
* @route '/settings/integrations/{integration}'
*/
updateForm.put = (args: { integration: number | { id: number } } | [integration: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\IntegrationController::test
* @see app/Http/Controllers/IntegrationController.php:56
* @route '/settings/integrations/{integration}/test'
*/
export const test = (args: { integration: number | { id: number } } | [integration: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: test.url(args, options),
    method: 'post',
})

test.definition = {
    methods: ["post"],
    url: '/settings/integrations/{integration}/test',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\IntegrationController::test
* @see app/Http/Controllers/IntegrationController.php:56
* @route '/settings/integrations/{integration}/test'
*/
test.url = (args: { integration: number | { id: number } } | [integration: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { integration: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { integration: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            integration: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        integration: typeof args.integration === 'object'
        ? args.integration.id
        : args.integration,
    }

    return test.definition.url
            .replace('{integration}', parsedArgs.integration.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\IntegrationController::test
* @see app/Http/Controllers/IntegrationController.php:56
* @route '/settings/integrations/{integration}/test'
*/
test.post = (args: { integration: number | { id: number } } | [integration: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: test.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\IntegrationController::test
* @see app/Http/Controllers/IntegrationController.php:56
* @route '/settings/integrations/{integration}/test'
*/
const testForm = (args: { integration: number | { id: number } } | [integration: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: test.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\IntegrationController::test
* @see app/Http/Controllers/IntegrationController.php:56
* @route '/settings/integrations/{integration}/test'
*/
testForm.post = (args: { integration: number | { id: number } } | [integration: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: test.url(args, options),
    method: 'post',
})

test.form = testForm

/**
* @see \App\Http\Controllers\IntegrationController::sync
* @see app/Http/Controllers/IntegrationController.php:68
* @route '/settings/integrations/{integration}/sync-now'
*/
export const sync = (args: { integration: number | { id: number } } | [integration: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: sync.url(args, options),
    method: 'post',
})

sync.definition = {
    methods: ["post"],
    url: '/settings/integrations/{integration}/sync-now',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\IntegrationController::sync
* @see app/Http/Controllers/IntegrationController.php:68
* @route '/settings/integrations/{integration}/sync-now'
*/
sync.url = (args: { integration: number | { id: number } } | [integration: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { integration: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { integration: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            integration: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        integration: typeof args.integration === 'object'
        ? args.integration.id
        : args.integration,
    }

    return sync.definition.url
            .replace('{integration}', parsedArgs.integration.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\IntegrationController::sync
* @see app/Http/Controllers/IntegrationController.php:68
* @route '/settings/integrations/{integration}/sync-now'
*/
sync.post = (args: { integration: number | { id: number } } | [integration: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: sync.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\IntegrationController::sync
* @see app/Http/Controllers/IntegrationController.php:68
* @route '/settings/integrations/{integration}/sync-now'
*/
const syncForm = (args: { integration: number | { id: number } } | [integration: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: sync.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\IntegrationController::sync
* @see app/Http/Controllers/IntegrationController.php:68
* @route '/settings/integrations/{integration}/sync-now'
*/
syncForm.post = (args: { integration: number | { id: number } } | [integration: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: sync.url(args, options),
    method: 'post',
})

sync.form = syncForm

/**
* @see \App\Http\Controllers\IntegrationController::toggle
* @see app/Http/Controllers/IntegrationController.php:121
* @route '/settings/integrations/{integration}/toggle'
*/
export const toggle = (args: { integration: number | { id: number } } | [integration: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: toggle.url(args, options),
    method: 'post',
})

toggle.definition = {
    methods: ["post"],
    url: '/settings/integrations/{integration}/toggle',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\IntegrationController::toggle
* @see app/Http/Controllers/IntegrationController.php:121
* @route '/settings/integrations/{integration}/toggle'
*/
toggle.url = (args: { integration: number | { id: number } } | [integration: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { integration: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { integration: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            integration: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        integration: typeof args.integration === 'object'
        ? args.integration.id
        : args.integration,
    }

    return toggle.definition.url
            .replace('{integration}', parsedArgs.integration.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\IntegrationController::toggle
* @see app/Http/Controllers/IntegrationController.php:121
* @route '/settings/integrations/{integration}/toggle'
*/
toggle.post = (args: { integration: number | { id: number } } | [integration: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: toggle.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\IntegrationController::toggle
* @see app/Http/Controllers/IntegrationController.php:121
* @route '/settings/integrations/{integration}/toggle'
*/
const toggleForm = (args: { integration: number | { id: number } } | [integration: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: toggle.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\IntegrationController::toggle
* @see app/Http/Controllers/IntegrationController.php:121
* @route '/settings/integrations/{integration}/toggle'
*/
toggleForm.post = (args: { integration: number | { id: number } } | [integration: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: toggle.url(args, options),
    method: 'post',
})

toggle.form = toggleForm

/**
* @see \App\Http\Controllers\IntegrationController::links
* @see app/Http/Controllers/IntegrationController.php:136
* @route '/settings/integrations/{integration}/links'
*/
export const links = (args: { integration: number | { id: number } } | [integration: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: links.url(args, options),
    method: 'get',
})

links.definition = {
    methods: ["get","head"],
    url: '/settings/integrations/{integration}/links',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\IntegrationController::links
* @see app/Http/Controllers/IntegrationController.php:136
* @route '/settings/integrations/{integration}/links'
*/
links.url = (args: { integration: number | { id: number } } | [integration: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { integration: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { integration: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            integration: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        integration: typeof args.integration === 'object'
        ? args.integration.id
        : args.integration,
    }

    return links.definition.url
            .replace('{integration}', parsedArgs.integration.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\IntegrationController::links
* @see app/Http/Controllers/IntegrationController.php:136
* @route '/settings/integrations/{integration}/links'
*/
links.get = (args: { integration: number | { id: number } } | [integration: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: links.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\IntegrationController::links
* @see app/Http/Controllers/IntegrationController.php:136
* @route '/settings/integrations/{integration}/links'
*/
links.head = (args: { integration: number | { id: number } } | [integration: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: links.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\IntegrationController::links
* @see app/Http/Controllers/IntegrationController.php:136
* @route '/settings/integrations/{integration}/links'
*/
const linksForm = (args: { integration: number | { id: number } } | [integration: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: links.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\IntegrationController::links
* @see app/Http/Controllers/IntegrationController.php:136
* @route '/settings/integrations/{integration}/links'
*/
linksForm.get = (args: { integration: number | { id: number } } | [integration: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: links.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\IntegrationController::links
* @see app/Http/Controllers/IntegrationController.php:136
* @route '/settings/integrations/{integration}/links'
*/
linksForm.head = (args: { integration: number | { id: number } } | [integration: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: links.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

links.form = linksForm

/**
* @see \App\Http\Controllers\IntegrationController::destroy
* @see app/Http/Controllers/IntegrationController.php:110
* @route '/settings/integrations/{integration}'
*/
export const destroy = (args: { integration: number | { id: number } } | [integration: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/settings/integrations/{integration}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\IntegrationController::destroy
* @see app/Http/Controllers/IntegrationController.php:110
* @route '/settings/integrations/{integration}'
*/
destroy.url = (args: { integration: number | { id: number } } | [integration: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { integration: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { integration: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            integration: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        integration: typeof args.integration === 'object'
        ? args.integration.id
        : args.integration,
    }

    return destroy.definition.url
            .replace('{integration}', parsedArgs.integration.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\IntegrationController::destroy
* @see app/Http/Controllers/IntegrationController.php:110
* @route '/settings/integrations/{integration}'
*/
destroy.delete = (args: { integration: number | { id: number } } | [integration: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\IntegrationController::destroy
* @see app/Http/Controllers/IntegrationController.php:110
* @route '/settings/integrations/{integration}'
*/
const destroyForm = (args: { integration: number | { id: number } } | [integration: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\IntegrationController::destroy
* @see app/Http/Controllers/IntegrationController.php:110
* @route '/settings/integrations/{integration}'
*/
destroyForm.delete = (args: { integration: number | { id: number } } | [integration: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

const integrations = {
    index: Object.assign(index, index),
    store: Object.assign(store, store),
    update: Object.assign(update, update),
    test: Object.assign(test, test),
    sync: Object.assign(sync, sync),
    toggle: Object.assign(toggle, toggle),
    links: Object.assign(links, links),
    destroy: Object.assign(destroy, destroy),
}

export default integrations