import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
import members from './members'
/**
* @see \App\Http\Controllers\Settings\OrganizationController::edit
* @see app/Http/Controllers/Settings/OrganizationController.php:49
* @route '/settings/organization'
*/
export const edit = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/settings/organization',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Settings\OrganizationController::edit
* @see app/Http/Controllers/Settings/OrganizationController.php:49
* @route '/settings/organization'
*/
edit.url = (options?: RouteQueryOptions) => {
    return edit.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\OrganizationController::edit
* @see app/Http/Controllers/Settings/OrganizationController.php:49
* @route '/settings/organization'
*/
edit.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Settings\OrganizationController::edit
* @see app/Http/Controllers/Settings/OrganizationController.php:49
* @route '/settings/organization'
*/
edit.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Settings\OrganizationController::edit
* @see app/Http/Controllers/Settings/OrganizationController.php:49
* @route '/settings/organization'
*/
const editForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Settings\OrganizationController::edit
* @see app/Http/Controllers/Settings/OrganizationController.php:49
* @route '/settings/organization'
*/
editForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Settings\OrganizationController::edit
* @see app/Http/Controllers/Settings/OrganizationController.php:49
* @route '/settings/organization'
*/
editForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

edit.form = editForm

/**
* @see \App\Http\Controllers\Settings\OrganizationController::create
* @see app/Http/Controllers/Settings/OrganizationController.php:94
* @route '/settings/organization/create'
*/
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/settings/organization/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Settings\OrganizationController::create
* @see app/Http/Controllers/Settings/OrganizationController.php:94
* @route '/settings/organization/create'
*/
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\OrganizationController::create
* @see app/Http/Controllers/Settings/OrganizationController.php:94
* @route '/settings/organization/create'
*/
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Settings\OrganizationController::create
* @see app/Http/Controllers/Settings/OrganizationController.php:94
* @route '/settings/organization/create'
*/
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Settings\OrganizationController::create
* @see app/Http/Controllers/Settings/OrganizationController.php:94
* @route '/settings/organization/create'
*/
const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Settings\OrganizationController::create
* @see app/Http/Controllers/Settings/OrganizationController.php:94
* @route '/settings/organization/create'
*/
createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Settings\OrganizationController::create
* @see app/Http/Controllers/Settings/OrganizationController.php:94
* @route '/settings/organization/create'
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
* @see \App\Http\Controllers\Settings\OrganizationController::store
* @see app/Http/Controllers/Settings/OrganizationController.php:99
* @route '/settings/organization'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/settings/organization',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Settings\OrganizationController::store
* @see app/Http/Controllers/Settings/OrganizationController.php:99
* @route '/settings/organization'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\OrganizationController::store
* @see app/Http/Controllers/Settings/OrganizationController.php:99
* @route '/settings/organization'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Settings\OrganizationController::store
* @see app/Http/Controllers/Settings/OrganizationController.php:99
* @route '/settings/organization'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Settings\OrganizationController::store
* @see app/Http/Controllers/Settings/OrganizationController.php:99
* @route '/settings/organization'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\Settings\OrganizationController::update
* @see app/Http/Controllers/Settings/OrganizationController.php:145
* @route '/settings/organization'
*/
export const update = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/settings/organization',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Settings\OrganizationController::update
* @see app/Http/Controllers/Settings/OrganizationController.php:145
* @route '/settings/organization'
*/
update.url = (options?: RouteQueryOptions) => {
    return update.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\OrganizationController::update
* @see app/Http/Controllers/Settings/OrganizationController.php:145
* @route '/settings/organization'
*/
update.put = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\Settings\OrganizationController::update
* @see app/Http/Controllers/Settings/OrganizationController.php:145
* @route '/settings/organization'
*/
const updateForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Settings\OrganizationController::update
* @see app/Http/Controllers/Settings/OrganizationController.php:145
* @route '/settings/organization'
*/
updateForm.put = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

update.form = updateForm

/**
* @see \App\Http\Controllers\Settings\OrganizationController::destroy
* @see app/Http/Controllers/Settings/OrganizationController.php:286
* @route '/settings/organization'
*/
export const destroy = (options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/settings/organization',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Settings\OrganizationController::destroy
* @see app/Http/Controllers/Settings/OrganizationController.php:286
* @route '/settings/organization'
*/
destroy.url = (options?: RouteQueryOptions) => {
    return destroy.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\OrganizationController::destroy
* @see app/Http/Controllers/Settings/OrganizationController.php:286
* @route '/settings/organization'
*/
destroy.delete = (options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Settings\OrganizationController::destroy
* @see app/Http/Controllers/Settings/OrganizationController.php:286
* @route '/settings/organization'
*/
const destroyForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Settings\OrganizationController::destroy
* @see app/Http/Controllers/Settings/OrganizationController.php:286
* @route '/settings/organization'
*/
destroyForm.delete = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

const organization = {
    edit: Object.assign(edit, edit),
    create: Object.assign(create, create),
    store: Object.assign(store, store),
    update: Object.assign(update, update),
    members: Object.assign(members, members),
    destroy: Object.assign(destroy, destroy),
}

export default organization