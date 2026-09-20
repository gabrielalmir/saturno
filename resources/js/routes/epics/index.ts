import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\EpicController::index
* @see app/Http/Controllers/EpicController.php:11
* @route '/epics'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/epics',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\EpicController::index
* @see app/Http/Controllers/EpicController.php:11
* @route '/epics'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\EpicController::index
* @see app/Http/Controllers/EpicController.php:11
* @route '/epics'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\EpicController::index
* @see app/Http/Controllers/EpicController.php:11
* @route '/epics'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\EpicController::index
* @see app/Http/Controllers/EpicController.php:11
* @route '/epics'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\EpicController::index
* @see app/Http/Controllers/EpicController.php:11
* @route '/epics'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\EpicController::index
* @see app/Http/Controllers/EpicController.php:11
* @route '/epics'
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
* @see \App\Http\Controllers\EpicController::create
* @see app/Http/Controllers/EpicController.php:0
* @route '/epics/create'
*/
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/epics/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\EpicController::create
* @see app/Http/Controllers/EpicController.php:0
* @route '/epics/create'
*/
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\EpicController::create
* @see app/Http/Controllers/EpicController.php:0
* @route '/epics/create'
*/
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\EpicController::create
* @see app/Http/Controllers/EpicController.php:0
* @route '/epics/create'
*/
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\EpicController::create
* @see app/Http/Controllers/EpicController.php:0
* @route '/epics/create'
*/
const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\EpicController::create
* @see app/Http/Controllers/EpicController.php:0
* @route '/epics/create'
*/
createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\EpicController::create
* @see app/Http/Controllers/EpicController.php:0
* @route '/epics/create'
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
* @see \App\Http\Controllers\EpicController::store
* @see app/Http/Controllers/EpicController.php:37
* @route '/epics'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/epics',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\EpicController::store
* @see app/Http/Controllers/EpicController.php:37
* @route '/epics'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\EpicController::store
* @see app/Http/Controllers/EpicController.php:37
* @route '/epics'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\EpicController::store
* @see app/Http/Controllers/EpicController.php:37
* @route '/epics'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\EpicController::store
* @see app/Http/Controllers/EpicController.php:37
* @route '/epics'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\EpicController::show
* @see app/Http/Controllers/EpicController.php:0
* @route '/epics/{epic}'
*/
export const show = (args: { epic: string | number } | [epic: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/epics/{epic}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\EpicController::show
* @see app/Http/Controllers/EpicController.php:0
* @route '/epics/{epic}'
*/
show.url = (args: { epic: string | number } | [epic: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { epic: args }
    }

    if (Array.isArray(args)) {
        args = {
            epic: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        epic: args.epic,
    }

    return show.definition.url
            .replace('{epic}', parsedArgs.epic.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EpicController::show
* @see app/Http/Controllers/EpicController.php:0
* @route '/epics/{epic}'
*/
show.get = (args: { epic: string | number } | [epic: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\EpicController::show
* @see app/Http/Controllers/EpicController.php:0
* @route '/epics/{epic}'
*/
show.head = (args: { epic: string | number } | [epic: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\EpicController::show
* @see app/Http/Controllers/EpicController.php:0
* @route '/epics/{epic}'
*/
const showForm = (args: { epic: string | number } | [epic: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\EpicController::show
* @see app/Http/Controllers/EpicController.php:0
* @route '/epics/{epic}'
*/
showForm.get = (args: { epic: string | number } | [epic: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\EpicController::show
* @see app/Http/Controllers/EpicController.php:0
* @route '/epics/{epic}'
*/
showForm.head = (args: { epic: string | number } | [epic: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\EpicController::edit
* @see app/Http/Controllers/EpicController.php:0
* @route '/epics/{epic}/edit'
*/
export const edit = (args: { epic: string | number } | [epic: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/epics/{epic}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\EpicController::edit
* @see app/Http/Controllers/EpicController.php:0
* @route '/epics/{epic}/edit'
*/
edit.url = (args: { epic: string | number } | [epic: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { epic: args }
    }

    if (Array.isArray(args)) {
        args = {
            epic: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        epic: args.epic,
    }

    return edit.definition.url
            .replace('{epic}', parsedArgs.epic.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EpicController::edit
* @see app/Http/Controllers/EpicController.php:0
* @route '/epics/{epic}/edit'
*/
edit.get = (args: { epic: string | number } | [epic: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\EpicController::edit
* @see app/Http/Controllers/EpicController.php:0
* @route '/epics/{epic}/edit'
*/
edit.head = (args: { epic: string | number } | [epic: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\EpicController::edit
* @see app/Http/Controllers/EpicController.php:0
* @route '/epics/{epic}/edit'
*/
const editForm = (args: { epic: string | number } | [epic: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\EpicController::edit
* @see app/Http/Controllers/EpicController.php:0
* @route '/epics/{epic}/edit'
*/
editForm.get = (args: { epic: string | number } | [epic: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\EpicController::edit
* @see app/Http/Controllers/EpicController.php:0
* @route '/epics/{epic}/edit'
*/
editForm.head = (args: { epic: string | number } | [epic: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\EpicController::update
* @see app/Http/Controllers/EpicController.php:54
* @route '/epics/{epic}'
*/
export const update = (args: { epic: string | number } | [epic: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/epics/{epic}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\EpicController::update
* @see app/Http/Controllers/EpicController.php:54
* @route '/epics/{epic}'
*/
update.url = (args: { epic: string | number } | [epic: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { epic: args }
    }

    if (Array.isArray(args)) {
        args = {
            epic: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        epic: args.epic,
    }

    return update.definition.url
            .replace('{epic}', parsedArgs.epic.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EpicController::update
* @see app/Http/Controllers/EpicController.php:54
* @route '/epics/{epic}'
*/
update.put = (args: { epic: string | number } | [epic: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\EpicController::update
* @see app/Http/Controllers/EpicController.php:54
* @route '/epics/{epic}'
*/
update.patch = (args: { epic: string | number } | [epic: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\EpicController::update
* @see app/Http/Controllers/EpicController.php:54
* @route '/epics/{epic}'
*/
const updateForm = (args: { epic: string | number } | [epic: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\EpicController::update
* @see app/Http/Controllers/EpicController.php:54
* @route '/epics/{epic}'
*/
updateForm.put = (args: { epic: string | number } | [epic: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\EpicController::update
* @see app/Http/Controllers/EpicController.php:54
* @route '/epics/{epic}'
*/
updateForm.patch = (args: { epic: string | number } | [epic: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\EpicController::destroy
* @see app/Http/Controllers/EpicController.php:78
* @route '/epics/{epic}'
*/
export const destroy = (args: { epic: string | number } | [epic: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/epics/{epic}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\EpicController::destroy
* @see app/Http/Controllers/EpicController.php:78
* @route '/epics/{epic}'
*/
destroy.url = (args: { epic: string | number } | [epic: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { epic: args }
    }

    if (Array.isArray(args)) {
        args = {
            epic: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        epic: args.epic,
    }

    return destroy.definition.url
            .replace('{epic}', parsedArgs.epic.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EpicController::destroy
* @see app/Http/Controllers/EpicController.php:78
* @route '/epics/{epic}'
*/
destroy.delete = (args: { epic: string | number } | [epic: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\EpicController::destroy
* @see app/Http/Controllers/EpicController.php:78
* @route '/epics/{epic}'
*/
const destroyForm = (args: { epic: string | number } | [epic: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\EpicController::destroy
* @see app/Http/Controllers/EpicController.php:78
* @route '/epics/{epic}'
*/
destroyForm.delete = (args: { epic: string | number } | [epic: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

const epics = {
    index: Object.assign(index, index),
    create: Object.assign(create, create),
    store: Object.assign(store, store),
    show: Object.assign(show, show),
    edit: Object.assign(edit, edit),
    update: Object.assign(update, update),
    destroy: Object.assign(destroy, destroy),
}

export default epics