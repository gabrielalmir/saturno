import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Settings\OrganizationController::invite
* @see app/Http/Controllers/Settings/OrganizationController.php:179
* @route '/settings/organization/members'
*/
export const invite = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: invite.url(options),
    method: 'post',
})

invite.definition = {
    methods: ["post"],
    url: '/settings/organization/members',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Settings\OrganizationController::invite
* @see app/Http/Controllers/Settings/OrganizationController.php:179
* @route '/settings/organization/members'
*/
invite.url = (options?: RouteQueryOptions) => {
    return invite.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\OrganizationController::invite
* @see app/Http/Controllers/Settings/OrganizationController.php:179
* @route '/settings/organization/members'
*/
invite.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: invite.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Settings\OrganizationController::invite
* @see app/Http/Controllers/Settings/OrganizationController.php:179
* @route '/settings/organization/members'
*/
const inviteForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: invite.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Settings\OrganizationController::invite
* @see app/Http/Controllers/Settings/OrganizationController.php:179
* @route '/settings/organization/members'
*/
inviteForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: invite.url(options),
    method: 'post',
})

invite.form = inviteForm

/**
* @see \App\Http\Controllers\Settings\OrganizationController::update
* @see app/Http/Controllers/Settings/OrganizationController.php:224
* @route '/settings/organization/members/{member}'
*/
export const update = (args: { member: number | { id: number } } | [member: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/settings/organization/members/{member}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Settings\OrganizationController::update
* @see app/Http/Controllers/Settings/OrganizationController.php:224
* @route '/settings/organization/members/{member}'
*/
update.url = (args: { member: number | { id: number } } | [member: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { member: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { member: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            member: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        member: typeof args.member === 'object'
        ? args.member.id
        : args.member,
    }

    return update.definition.url
            .replace('{member}', parsedArgs.member.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\OrganizationController::update
* @see app/Http/Controllers/Settings/OrganizationController.php:224
* @route '/settings/organization/members/{member}'
*/
update.put = (args: { member: number | { id: number } } | [member: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\Settings\OrganizationController::update
* @see app/Http/Controllers/Settings/OrganizationController.php:224
* @route '/settings/organization/members/{member}'
*/
const updateForm = (args: { member: number | { id: number } } | [member: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Settings\OrganizationController::update
* @see app/Http/Controllers/Settings/OrganizationController.php:224
* @route '/settings/organization/members/{member}'
*/
updateForm.put = (args: { member: number | { id: number } } | [member: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\Settings\OrganizationController::remove
* @see app/Http/Controllers/Settings/OrganizationController.php:239
* @route '/settings/organization/members/{member}'
*/
export const remove = (args: { member: number | { id: number } } | [member: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: remove.url(args, options),
    method: 'delete',
})

remove.definition = {
    methods: ["delete"],
    url: '/settings/organization/members/{member}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Settings\OrganizationController::remove
* @see app/Http/Controllers/Settings/OrganizationController.php:239
* @route '/settings/organization/members/{member}'
*/
remove.url = (args: { member: number | { id: number } } | [member: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { member: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { member: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            member: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        member: typeof args.member === 'object'
        ? args.member.id
        : args.member,
    }

    return remove.definition.url
            .replace('{member}', parsedArgs.member.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\OrganizationController::remove
* @see app/Http/Controllers/Settings/OrganizationController.php:239
* @route '/settings/organization/members/{member}'
*/
remove.delete = (args: { member: number | { id: number } } | [member: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: remove.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Settings\OrganizationController::remove
* @see app/Http/Controllers/Settings/OrganizationController.php:239
* @route '/settings/organization/members/{member}'
*/
const removeForm = (args: { member: number | { id: number } } | [member: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: remove.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Settings\OrganizationController::remove
* @see app/Http/Controllers/Settings/OrganizationController.php:239
* @route '/settings/organization/members/{member}'
*/
removeForm.delete = (args: { member: number | { id: number } } | [member: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: remove.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

remove.form = removeForm

const members = {
    invite: Object.assign(invite, invite),
    update: Object.assign(update, update),
    remove: Object.assign(remove, remove),
}

export default members