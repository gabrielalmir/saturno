import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\StoryController::index
* @see app/Http/Controllers/StoryController.php:12
* @route '/stories'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/stories',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\StoryController::index
* @see app/Http/Controllers/StoryController.php:12
* @route '/stories'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\StoryController::index
* @see app/Http/Controllers/StoryController.php:12
* @route '/stories'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\StoryController::index
* @see app/Http/Controllers/StoryController.php:12
* @route '/stories'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\StoryController::index
* @see app/Http/Controllers/StoryController.php:12
* @route '/stories'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\StoryController::index
* @see app/Http/Controllers/StoryController.php:12
* @route '/stories'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\StoryController::index
* @see app/Http/Controllers/StoryController.php:12
* @route '/stories'
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
* @see \App\Http\Controllers\StoryController::create
* @see app/Http/Controllers/StoryController.php:0
* @route '/stories/create'
*/
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/stories/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\StoryController::create
* @see app/Http/Controllers/StoryController.php:0
* @route '/stories/create'
*/
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\StoryController::create
* @see app/Http/Controllers/StoryController.php:0
* @route '/stories/create'
*/
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\StoryController::create
* @see app/Http/Controllers/StoryController.php:0
* @route '/stories/create'
*/
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\StoryController::create
* @see app/Http/Controllers/StoryController.php:0
* @route '/stories/create'
*/
const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\StoryController::create
* @see app/Http/Controllers/StoryController.php:0
* @route '/stories/create'
*/
createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\StoryController::create
* @see app/Http/Controllers/StoryController.php:0
* @route '/stories/create'
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
* @see \App\Http\Controllers\StoryController::store
* @see app/Http/Controllers/StoryController.php:33
* @route '/stories'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/stories',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\StoryController::store
* @see app/Http/Controllers/StoryController.php:33
* @route '/stories'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\StoryController::store
* @see app/Http/Controllers/StoryController.php:33
* @route '/stories'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\StoryController::store
* @see app/Http/Controllers/StoryController.php:33
* @route '/stories'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\StoryController::store
* @see app/Http/Controllers/StoryController.php:33
* @route '/stories'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\StoryController::show
* @see app/Http/Controllers/StoryController.php:0
* @route '/stories/{story}'
*/
export const show = (args: { story: string | number } | [story: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/stories/{story}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\StoryController::show
* @see app/Http/Controllers/StoryController.php:0
* @route '/stories/{story}'
*/
show.url = (args: { story: string | number } | [story: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { story: args }
    }

    if (Array.isArray(args)) {
        args = {
            story: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        story: args.story,
    }

    return show.definition.url
            .replace('{story}', parsedArgs.story.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\StoryController::show
* @see app/Http/Controllers/StoryController.php:0
* @route '/stories/{story}'
*/
show.get = (args: { story: string | number } | [story: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\StoryController::show
* @see app/Http/Controllers/StoryController.php:0
* @route '/stories/{story}'
*/
show.head = (args: { story: string | number } | [story: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\StoryController::show
* @see app/Http/Controllers/StoryController.php:0
* @route '/stories/{story}'
*/
const showForm = (args: { story: string | number } | [story: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\StoryController::show
* @see app/Http/Controllers/StoryController.php:0
* @route '/stories/{story}'
*/
showForm.get = (args: { story: string | number } | [story: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\StoryController::show
* @see app/Http/Controllers/StoryController.php:0
* @route '/stories/{story}'
*/
showForm.head = (args: { story: string | number } | [story: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\StoryController::edit
* @see app/Http/Controllers/StoryController.php:0
* @route '/stories/{story}/edit'
*/
export const edit = (args: { story: string | number } | [story: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/stories/{story}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\StoryController::edit
* @see app/Http/Controllers/StoryController.php:0
* @route '/stories/{story}/edit'
*/
edit.url = (args: { story: string | number } | [story: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { story: args }
    }

    if (Array.isArray(args)) {
        args = {
            story: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        story: args.story,
    }

    return edit.definition.url
            .replace('{story}', parsedArgs.story.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\StoryController::edit
* @see app/Http/Controllers/StoryController.php:0
* @route '/stories/{story}/edit'
*/
edit.get = (args: { story: string | number } | [story: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\StoryController::edit
* @see app/Http/Controllers/StoryController.php:0
* @route '/stories/{story}/edit'
*/
edit.head = (args: { story: string | number } | [story: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\StoryController::edit
* @see app/Http/Controllers/StoryController.php:0
* @route '/stories/{story}/edit'
*/
const editForm = (args: { story: string | number } | [story: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\StoryController::edit
* @see app/Http/Controllers/StoryController.php:0
* @route '/stories/{story}/edit'
*/
editForm.get = (args: { story: string | number } | [story: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\StoryController::edit
* @see app/Http/Controllers/StoryController.php:0
* @route '/stories/{story}/edit'
*/
editForm.head = (args: { story: string | number } | [story: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\StoryController::update
* @see app/Http/Controllers/StoryController.php:55
* @route '/stories/{story}'
*/
export const update = (args: { story: number | { id: number } } | [story: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/stories/{story}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\StoryController::update
* @see app/Http/Controllers/StoryController.php:55
* @route '/stories/{story}'
*/
update.url = (args: { story: number | { id: number } } | [story: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { story: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { story: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            story: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        story: typeof args.story === 'object'
        ? args.story.id
        : args.story,
    }

    return update.definition.url
            .replace('{story}', parsedArgs.story.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\StoryController::update
* @see app/Http/Controllers/StoryController.php:55
* @route '/stories/{story}'
*/
update.put = (args: { story: number | { id: number } } | [story: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\StoryController::update
* @see app/Http/Controllers/StoryController.php:55
* @route '/stories/{story}'
*/
update.patch = (args: { story: number | { id: number } } | [story: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\StoryController::update
* @see app/Http/Controllers/StoryController.php:55
* @route '/stories/{story}'
*/
const updateForm = (args: { story: number | { id: number } } | [story: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\StoryController::update
* @see app/Http/Controllers/StoryController.php:55
* @route '/stories/{story}'
*/
updateForm.put = (args: { story: number | { id: number } } | [story: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\StoryController::update
* @see app/Http/Controllers/StoryController.php:55
* @route '/stories/{story}'
*/
updateForm.patch = (args: { story: number | { id: number } } | [story: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\StoryController::destroy
* @see app/Http/Controllers/StoryController.php:75
* @route '/stories/{story}'
*/
export const destroy = (args: { story: number | { id: number } } | [story: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/stories/{story}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\StoryController::destroy
* @see app/Http/Controllers/StoryController.php:75
* @route '/stories/{story}'
*/
destroy.url = (args: { story: number | { id: number } } | [story: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { story: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { story: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            story: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        story: typeof args.story === 'object'
        ? args.story.id
        : args.story,
    }

    return destroy.definition.url
            .replace('{story}', parsedArgs.story.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\StoryController::destroy
* @see app/Http/Controllers/StoryController.php:75
* @route '/stories/{story}'
*/
destroy.delete = (args: { story: number | { id: number } } | [story: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\StoryController::destroy
* @see app/Http/Controllers/StoryController.php:75
* @route '/stories/{story}'
*/
const destroyForm = (args: { story: number | { id: number } } | [story: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\StoryController::destroy
* @see app/Http/Controllers/StoryController.php:75
* @route '/stories/{story}'
*/
destroyForm.delete = (args: { story: number | { id: number } } | [story: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

const StoryController = { index, create, store, show, edit, update, destroy }

export default StoryController