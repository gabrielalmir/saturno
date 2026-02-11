import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
/**
* @see \App\Http\Controllers\Settings\OrganizationController::switchMethod
* @see app/Http/Controllers/Settings/OrganizationController.php:263
* @route '/organizations/switch'
*/
export const switchMethod = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: switchMethod.url(options),
    method: 'post',
})

switchMethod.definition = {
    methods: ["post"],
    url: '/organizations/switch',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Settings\OrganizationController::switchMethod
* @see app/Http/Controllers/Settings/OrganizationController.php:263
* @route '/organizations/switch'
*/
switchMethod.url = (options?: RouteQueryOptions) => {
    return switchMethod.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\OrganizationController::switchMethod
* @see app/Http/Controllers/Settings/OrganizationController.php:263
* @route '/organizations/switch'
*/
switchMethod.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: switchMethod.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Settings\OrganizationController::switchMethod
* @see app/Http/Controllers/Settings/OrganizationController.php:263
* @route '/organizations/switch'
*/
const switchMethodForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: switchMethod.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Settings\OrganizationController::switchMethod
* @see app/Http/Controllers/Settings/OrganizationController.php:263
* @route '/organizations/switch'
*/
switchMethodForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: switchMethod.url(options),
    method: 'post',
})

switchMethod.form = switchMethodForm

const organizations = {
    switch: Object.assign(switchMethod, switchMethod),
}

export default organizations