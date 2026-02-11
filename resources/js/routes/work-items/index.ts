import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\WorkItemController::index
* @see app/Http/Controllers/WorkItemController.php:30
* @route '/work-items'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/work-items',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\WorkItemController::index
* @see app/Http/Controllers/WorkItemController.php:30
* @route '/work-items'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\WorkItemController::index
* @see app/Http/Controllers/WorkItemController.php:30
* @route '/work-items'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\WorkItemController::index
* @see app/Http/Controllers/WorkItemController.php:30
* @route '/work-items'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\WorkItemController::index
* @see app/Http/Controllers/WorkItemController.php:30
* @route '/work-items'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\WorkItemController::index
* @see app/Http/Controllers/WorkItemController.php:30
* @route '/work-items'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\WorkItemController::index
* @see app/Http/Controllers/WorkItemController.php:30
* @route '/work-items'
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
* @see \App\Http\Controllers\WorkItemController::create
* @see app/Http/Controllers/WorkItemController.php:0
* @route '/work-items/create'
*/
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/work-items/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\WorkItemController::create
* @see app/Http/Controllers/WorkItemController.php:0
* @route '/work-items/create'
*/
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\WorkItemController::create
* @see app/Http/Controllers/WorkItemController.php:0
* @route '/work-items/create'
*/
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\WorkItemController::create
* @see app/Http/Controllers/WorkItemController.php:0
* @route '/work-items/create'
*/
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\WorkItemController::create
* @see app/Http/Controllers/WorkItemController.php:0
* @route '/work-items/create'
*/
const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\WorkItemController::create
* @see app/Http/Controllers/WorkItemController.php:0
* @route '/work-items/create'
*/
createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\WorkItemController::create
* @see app/Http/Controllers/WorkItemController.php:0
* @route '/work-items/create'
*/
createForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

create.form = createForm

/**
* @see \App\Http\Controllers\WorkItemController::store
* @see app/Http/Controllers/WorkItemController.php:121
* @route '/work-items'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/work-items',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\WorkItemController::store
* @see app/Http/Controllers/WorkItemController.php:121
* @route '/work-items'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\WorkItemController::store
* @see app/Http/Controllers/WorkItemController.php:121
* @route '/work-items'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\WorkItemController::store
* @see app/Http/Controllers/WorkItemController.php:121
* @route '/work-items'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\WorkItemController::store
* @see app/Http/Controllers/WorkItemController.php:121
* @route '/work-items'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\WorkItemController::show
* @see app/Http/Controllers/WorkItemController.php:93
* @route '/work-items/{work_item}'
*/
export const show = (args: { work_item: string | number } | [work_item: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/work-items/{work_item}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\WorkItemController::show
* @see app/Http/Controllers/WorkItemController.php:93
* @route '/work-items/{work_item}'
*/
show.url = (args: { work_item: string | number } | [work_item: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { work_item: args }
    }

    if (Array.isArray(args)) {
        args = {
            work_item: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        work_item: args.work_item,
    }

    return show.definition.url
            .replace('{work_item}', parsedArgs.work_item.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\WorkItemController::show
* @see app/Http/Controllers/WorkItemController.php:93
* @route '/work-items/{work_item}'
*/
show.get = (args: { work_item: string | number } | [work_item: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\WorkItemController::show
* @see app/Http/Controllers/WorkItemController.php:93
* @route '/work-items/{work_item}'
*/
show.head = (args: { work_item: string | number } | [work_item: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\WorkItemController::show
* @see app/Http/Controllers/WorkItemController.php:93
* @route '/work-items/{work_item}'
*/
const showForm = (args: { work_item: string | number } | [work_item: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\WorkItemController::show
* @see app/Http/Controllers/WorkItemController.php:93
* @route '/work-items/{work_item}'
*/
showForm.get = (args: { work_item: string | number } | [work_item: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\WorkItemController::show
* @see app/Http/Controllers/WorkItemController.php:93
* @route '/work-items/{work_item}'
*/
showForm.head = (args: { work_item: string | number } | [work_item: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\WorkItemController::edit
* @see app/Http/Controllers/WorkItemController.php:0
* @route '/work-items/{work_item}/edit'
*/
export const edit = (args: { work_item: string | number } | [work_item: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/work-items/{work_item}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\WorkItemController::edit
* @see app/Http/Controllers/WorkItemController.php:0
* @route '/work-items/{work_item}/edit'
*/
edit.url = (args: { work_item: string | number } | [work_item: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { work_item: args }
    }

    if (Array.isArray(args)) {
        args = {
            work_item: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        work_item: args.work_item,
    }

    return edit.definition.url
            .replace('{work_item}', parsedArgs.work_item.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\WorkItemController::edit
* @see app/Http/Controllers/WorkItemController.php:0
* @route '/work-items/{work_item}/edit'
*/
edit.get = (args: { work_item: string | number } | [work_item: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\WorkItemController::edit
* @see app/Http/Controllers/WorkItemController.php:0
* @route '/work-items/{work_item}/edit'
*/
edit.head = (args: { work_item: string | number } | [work_item: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\WorkItemController::edit
* @see app/Http/Controllers/WorkItemController.php:0
* @route '/work-items/{work_item}/edit'
*/
const editForm = (args: { work_item: string | number } | [work_item: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\WorkItemController::edit
* @see app/Http/Controllers/WorkItemController.php:0
* @route '/work-items/{work_item}/edit'
*/
editForm.get = (args: { work_item: string | number } | [work_item: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\WorkItemController::edit
* @see app/Http/Controllers/WorkItemController.php:0
* @route '/work-items/{work_item}/edit'
*/
editForm.head = (args: { work_item: string | number } | [work_item: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

edit.form = editForm

/**
* @see \App\Http\Controllers\WorkItemController::update
* @see app/Http/Controllers/WorkItemController.php:156
* @route '/work-items/{work_item}'
*/
export const update = (args: { work_item: string | number } | [work_item: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/work-items/{work_item}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\WorkItemController::update
* @see app/Http/Controllers/WorkItemController.php:156
* @route '/work-items/{work_item}'
*/
update.url = (args: { work_item: string | number } | [work_item: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { work_item: args }
    }

    if (Array.isArray(args)) {
        args = {
            work_item: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        work_item: args.work_item,
    }

    return update.definition.url
            .replace('{work_item}', parsedArgs.work_item.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\WorkItemController::update
* @see app/Http/Controllers/WorkItemController.php:156
* @route '/work-items/{work_item}'
*/
update.put = (args: { work_item: string | number } | [work_item: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\WorkItemController::update
* @see app/Http/Controllers/WorkItemController.php:156
* @route '/work-items/{work_item}'
*/
update.patch = (args: { work_item: string | number } | [work_item: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\WorkItemController::update
* @see app/Http/Controllers/WorkItemController.php:156
* @route '/work-items/{work_item}'
*/
const updateForm = (args: { work_item: string | number } | [work_item: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\WorkItemController::update
* @see app/Http/Controllers/WorkItemController.php:156
* @route '/work-items/{work_item}'
*/
updateForm.put = (args: { work_item: string | number } | [work_item: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\WorkItemController::update
* @see app/Http/Controllers/WorkItemController.php:156
* @route '/work-items/{work_item}'
*/
updateForm.patch = (args: { work_item: string | number } | [work_item: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

update.form = updateForm

/**
* @see \App\Http\Controllers\WorkItemController::destroy
* @see app/Http/Controllers/WorkItemController.php:204
* @route '/work-items/{work_item}'
*/
export const destroy = (args: { work_item: string | number } | [work_item: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/work-items/{work_item}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\WorkItemController::destroy
* @see app/Http/Controllers/WorkItemController.php:204
* @route '/work-items/{work_item}'
*/
destroy.url = (args: { work_item: string | number } | [work_item: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { work_item: args }
    }

    if (Array.isArray(args)) {
        args = {
            work_item: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        work_item: args.work_item,
    }

    return destroy.definition.url
            .replace('{work_item}', parsedArgs.work_item.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\WorkItemController::destroy
* @see app/Http/Controllers/WorkItemController.php:204
* @route '/work-items/{work_item}'
*/
destroy.delete = (args: { work_item: string | number } | [work_item: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\WorkItemController::destroy
* @see app/Http/Controllers/WorkItemController.php:204
* @route '/work-items/{work_item}'
*/
const destroyForm = (args: { work_item: string | number } | [work_item: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\WorkItemController::destroy
* @see app/Http/Controllers/WorkItemController.php:204
* @route '/work-items/{work_item}'
*/
destroyForm.delete = (args: { work_item: string | number } | [work_item: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

const workItems = {
    index: Object.assign(index, index),
    create: Object.assign(create, create),
    store: Object.assign(store, store),
    show: Object.assign(show, show),
    edit: Object.assign(edit, edit),
    update: Object.assign(update, update),
    destroy: Object.assign(destroy, destroy),
}

export default workItems