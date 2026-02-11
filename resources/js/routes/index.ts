import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../wayfinder'
/**
* @see \Laravel\Fortify\Http\Controllers\AuthenticatedSessionController::login
* @see vendor/laravel/fortify/src/Http/Controllers/AuthenticatedSessionController.php:47
* @route '/login'
*/
export const login = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: login.url(options),
    method: 'get',
})

login.definition = {
    methods: ["get","head"],
    url: '/login',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \Laravel\Fortify\Http\Controllers\AuthenticatedSessionController::login
* @see vendor/laravel/fortify/src/Http/Controllers/AuthenticatedSessionController.php:47
* @route '/login'
*/
login.url = (options?: RouteQueryOptions) => {
    return login.definition.url + queryParams(options)
}

/**
* @see \Laravel\Fortify\Http\Controllers\AuthenticatedSessionController::login
* @see vendor/laravel/fortify/src/Http/Controllers/AuthenticatedSessionController.php:47
* @route '/login'
*/
login.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: login.url(options),
    method: 'get',
})

/**
* @see \Laravel\Fortify\Http\Controllers\AuthenticatedSessionController::login
* @see vendor/laravel/fortify/src/Http/Controllers/AuthenticatedSessionController.php:47
* @route '/login'
*/
login.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: login.url(options),
    method: 'head',
})

/**
* @see \Laravel\Fortify\Http\Controllers\AuthenticatedSessionController::login
* @see vendor/laravel/fortify/src/Http/Controllers/AuthenticatedSessionController.php:47
* @route '/login'
*/
const loginForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: login.url(options),
    method: 'get',
})

/**
* @see \Laravel\Fortify\Http\Controllers\AuthenticatedSessionController::login
* @see vendor/laravel/fortify/src/Http/Controllers/AuthenticatedSessionController.php:47
* @route '/login'
*/
loginForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: login.url(options),
    method: 'get',
})

/**
* @see \Laravel\Fortify\Http\Controllers\AuthenticatedSessionController::login
* @see vendor/laravel/fortify/src/Http/Controllers/AuthenticatedSessionController.php:47
* @route '/login'
*/
loginForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: login.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

login.form = loginForm

/**
* @see \Laravel\Fortify\Http\Controllers\AuthenticatedSessionController::logout
* @see vendor/laravel/fortify/src/Http/Controllers/AuthenticatedSessionController.php:100
* @route '/logout'
*/
export const logout = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: logout.url(options),
    method: 'post',
})

logout.definition = {
    methods: ["post"],
    url: '/logout',
} satisfies RouteDefinition<["post"]>

/**
* @see \Laravel\Fortify\Http\Controllers\AuthenticatedSessionController::logout
* @see vendor/laravel/fortify/src/Http/Controllers/AuthenticatedSessionController.php:100
* @route '/logout'
*/
logout.url = (options?: RouteQueryOptions) => {
    return logout.definition.url + queryParams(options)
}

/**
* @see \Laravel\Fortify\Http\Controllers\AuthenticatedSessionController::logout
* @see vendor/laravel/fortify/src/Http/Controllers/AuthenticatedSessionController.php:100
* @route '/logout'
*/
logout.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: logout.url(options),
    method: 'post',
})

/**
* @see \Laravel\Fortify\Http\Controllers\AuthenticatedSessionController::logout
* @see vendor/laravel/fortify/src/Http/Controllers/AuthenticatedSessionController.php:100
* @route '/logout'
*/
const logoutForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: logout.url(options),
    method: 'post',
})

/**
* @see \Laravel\Fortify\Http\Controllers\AuthenticatedSessionController::logout
* @see vendor/laravel/fortify/src/Http/Controllers/AuthenticatedSessionController.php:100
* @route '/logout'
*/
logoutForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: logout.url(options),
    method: 'post',
})

logout.form = logoutForm

/**
* @see \Laravel\Fortify\Http\Controllers\RegisteredUserController::register
* @see vendor/laravel/fortify/src/Http/Controllers/RegisteredUserController.php:41
* @route '/register'
*/
export const register = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: register.url(options),
    method: 'get',
})

register.definition = {
    methods: ["get","head"],
    url: '/register',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \Laravel\Fortify\Http\Controllers\RegisteredUserController::register
* @see vendor/laravel/fortify/src/Http/Controllers/RegisteredUserController.php:41
* @route '/register'
*/
register.url = (options?: RouteQueryOptions) => {
    return register.definition.url + queryParams(options)
}

/**
* @see \Laravel\Fortify\Http\Controllers\RegisteredUserController::register
* @see vendor/laravel/fortify/src/Http/Controllers/RegisteredUserController.php:41
* @route '/register'
*/
register.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: register.url(options),
    method: 'get',
})

/**
* @see \Laravel\Fortify\Http\Controllers\RegisteredUserController::register
* @see vendor/laravel/fortify/src/Http/Controllers/RegisteredUserController.php:41
* @route '/register'
*/
register.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: register.url(options),
    method: 'head',
})

/**
* @see \Laravel\Fortify\Http\Controllers\RegisteredUserController::register
* @see vendor/laravel/fortify/src/Http/Controllers/RegisteredUserController.php:41
* @route '/register'
*/
const registerForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: register.url(options),
    method: 'get',
})

/**
* @see \Laravel\Fortify\Http\Controllers\RegisteredUserController::register
* @see vendor/laravel/fortify/src/Http/Controllers/RegisteredUserController.php:41
* @route '/register'
*/
registerForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: register.url(options),
    method: 'get',
})

/**
* @see \Laravel\Fortify\Http\Controllers\RegisteredUserController::register
* @see vendor/laravel/fortify/src/Http/Controllers/RegisteredUserController.php:41
* @route '/register'
*/
registerForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: register.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

register.form = registerForm

/**
* @see routes/web.php:20
* @route '/'
*/
export const home = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: home.url(options),
    method: 'get',
})

home.definition = {
    methods: ["get","head"],
    url: '/',
} satisfies RouteDefinition<["get","head"]>

/**
* @see routes/web.php:20
* @route '/'
*/
home.url = (options?: RouteQueryOptions) => {
    return home.definition.url + queryParams(options)
}

/**
* @see routes/web.php:20
* @route '/'
*/
home.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: home.url(options),
    method: 'get',
})

/**
* @see routes/web.php:20
* @route '/'
*/
home.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: home.url(options),
    method: 'head',
})

/**
* @see routes/web.php:20
* @route '/'
*/
const homeForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: home.url(options),
    method: 'get',
})

/**
* @see routes/web.php:20
* @route '/'
*/
homeForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: home.url(options),
    method: 'get',
})

/**
* @see routes/web.php:20
* @route '/'
*/
homeForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: home.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

home.form = homeForm

/**
* @see routes/web.php:26
* @route '/manifesto'
*/
export const manifesto = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: manifesto.url(options),
    method: 'get',
})

manifesto.definition = {
    methods: ["get","head"],
    url: '/manifesto',
} satisfies RouteDefinition<["get","head"]>

/**
* @see routes/web.php:26
* @route '/manifesto'
*/
manifesto.url = (options?: RouteQueryOptions) => {
    return manifesto.definition.url + queryParams(options)
}

/**
* @see routes/web.php:26
* @route '/manifesto'
*/
manifesto.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: manifesto.url(options),
    method: 'get',
})

/**
* @see routes/web.php:26
* @route '/manifesto'
*/
manifesto.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: manifesto.url(options),
    method: 'head',
})

/**
* @see routes/web.php:26
* @route '/manifesto'
*/
const manifestoForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: manifesto.url(options),
    method: 'get',
})

/**
* @see routes/web.php:26
* @route '/manifesto'
*/
manifestoForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: manifesto.url(options),
    method: 'get',
})

/**
* @see routes/web.php:26
* @route '/manifesto'
*/
manifestoForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: manifesto.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

manifesto.form = manifestoForm

/**
* @see routes/web.php:27
* @route '/docs'
*/
export const docs = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: docs.url(options),
    method: 'get',
})

docs.definition = {
    methods: ["get","head"],
    url: '/docs',
} satisfies RouteDefinition<["get","head"]>

/**
* @see routes/web.php:27
* @route '/docs'
*/
docs.url = (options?: RouteQueryOptions) => {
    return docs.definition.url + queryParams(options)
}

/**
* @see routes/web.php:27
* @route '/docs'
*/
docs.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: docs.url(options),
    method: 'get',
})

/**
* @see routes/web.php:27
* @route '/docs'
*/
docs.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: docs.url(options),
    method: 'head',
})

/**
* @see routes/web.php:27
* @route '/docs'
*/
const docsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: docs.url(options),
    method: 'get',
})

/**
* @see routes/web.php:27
* @route '/docs'
*/
docsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: docs.url(options),
    method: 'get',
})

/**
* @see routes/web.php:27
* @route '/docs'
*/
docsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: docs.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

docs.form = docsForm

/**
* @see routes/web.php:28
* @route '/api'
*/
export const api = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: api.url(options),
    method: 'get',
})

api.definition = {
    methods: ["get","head"],
    url: '/api',
} satisfies RouteDefinition<["get","head"]>

/**
* @see routes/web.php:28
* @route '/api'
*/
api.url = (options?: RouteQueryOptions) => {
    return api.definition.url + queryParams(options)
}

/**
* @see routes/web.php:28
* @route '/api'
*/
api.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: api.url(options),
    method: 'get',
})

/**
* @see routes/web.php:28
* @route '/api'
*/
api.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: api.url(options),
    method: 'head',
})

/**
* @see routes/web.php:28
* @route '/api'
*/
const apiForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: api.url(options),
    method: 'get',
})

/**
* @see routes/web.php:28
* @route '/api'
*/
apiForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: api.url(options),
    method: 'get',
})

/**
* @see routes/web.php:28
* @route '/api'
*/
apiForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: api.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

api.form = apiForm

/**
* @see routes/web.php:29
* @route '/community'
*/
export const community = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: community.url(options),
    method: 'get',
})

community.definition = {
    methods: ["get","head"],
    url: '/community',
} satisfies RouteDefinition<["get","head"]>

/**
* @see routes/web.php:29
* @route '/community'
*/
community.url = (options?: RouteQueryOptions) => {
    return community.definition.url + queryParams(options)
}

/**
* @see routes/web.php:29
* @route '/community'
*/
community.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: community.url(options),
    method: 'get',
})

/**
* @see routes/web.php:29
* @route '/community'
*/
community.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: community.url(options),
    method: 'head',
})

/**
* @see routes/web.php:29
* @route '/community'
*/
const communityForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: community.url(options),
    method: 'get',
})

/**
* @see routes/web.php:29
* @route '/community'
*/
communityForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: community.url(options),
    method: 'get',
})

/**
* @see routes/web.php:29
* @route '/community'
*/
communityForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: community.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

community.form = communityForm

/**
* @see routes/web.php:30
* @route '/sobre'
*/
export const sobre = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: sobre.url(options),
    method: 'get',
})

sobre.definition = {
    methods: ["get","head"],
    url: '/sobre',
} satisfies RouteDefinition<["get","head"]>

/**
* @see routes/web.php:30
* @route '/sobre'
*/
sobre.url = (options?: RouteQueryOptions) => {
    return sobre.definition.url + queryParams(options)
}

/**
* @see routes/web.php:30
* @route '/sobre'
*/
sobre.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: sobre.url(options),
    method: 'get',
})

/**
* @see routes/web.php:30
* @route '/sobre'
*/
sobre.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: sobre.url(options),
    method: 'head',
})

/**
* @see routes/web.php:30
* @route '/sobre'
*/
const sobreForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: sobre.url(options),
    method: 'get',
})

/**
* @see routes/web.php:30
* @route '/sobre'
*/
sobreForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: sobre.url(options),
    method: 'get',
})

/**
* @see routes/web.php:30
* @route '/sobre'
*/
sobreForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: sobre.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

sobre.form = sobreForm

/**
* @see routes/web.php:31
* @route '/carreiras'
*/
export const carreiras = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: carreiras.url(options),
    method: 'get',
})

carreiras.definition = {
    methods: ["get","head"],
    url: '/carreiras',
} satisfies RouteDefinition<["get","head"]>

/**
* @see routes/web.php:31
* @route '/carreiras'
*/
carreiras.url = (options?: RouteQueryOptions) => {
    return carreiras.definition.url + queryParams(options)
}

/**
* @see routes/web.php:31
* @route '/carreiras'
*/
carreiras.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: carreiras.url(options),
    method: 'get',
})

/**
* @see routes/web.php:31
* @route '/carreiras'
*/
carreiras.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: carreiras.url(options),
    method: 'head',
})

/**
* @see routes/web.php:31
* @route '/carreiras'
*/
const carreirasForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: carreiras.url(options),
    method: 'get',
})

/**
* @see routes/web.php:31
* @route '/carreiras'
*/
carreirasForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: carreiras.url(options),
    method: 'get',
})

/**
* @see routes/web.php:31
* @route '/carreiras'
*/
carreirasForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: carreiras.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

carreiras.form = carreirasForm

/**
* @see routes/web.php:32
* @route '/blog'
*/
export const blog = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: blog.url(options),
    method: 'get',
})

blog.definition = {
    methods: ["get","head"],
    url: '/blog',
} satisfies RouteDefinition<["get","head"]>

/**
* @see routes/web.php:32
* @route '/blog'
*/
blog.url = (options?: RouteQueryOptions) => {
    return blog.definition.url + queryParams(options)
}

/**
* @see routes/web.php:32
* @route '/blog'
*/
blog.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: blog.url(options),
    method: 'get',
})

/**
* @see routes/web.php:32
* @route '/blog'
*/
blog.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: blog.url(options),
    method: 'head',
})

/**
* @see routes/web.php:32
* @route '/blog'
*/
const blogForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: blog.url(options),
    method: 'get',
})

/**
* @see routes/web.php:32
* @route '/blog'
*/
blogForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: blog.url(options),
    method: 'get',
})

/**
* @see routes/web.php:32
* @route '/blog'
*/
blogForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: blog.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

blog.form = blogForm

/**
* @see routes/web.php:33
* @route '/contato'
*/
export const contato = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: contato.url(options),
    method: 'get',
})

contato.definition = {
    methods: ["get","head"],
    url: '/contato',
} satisfies RouteDefinition<["get","head"]>

/**
* @see routes/web.php:33
* @route '/contato'
*/
contato.url = (options?: RouteQueryOptions) => {
    return contato.definition.url + queryParams(options)
}

/**
* @see routes/web.php:33
* @route '/contato'
*/
contato.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: contato.url(options),
    method: 'get',
})

/**
* @see routes/web.php:33
* @route '/contato'
*/
contato.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: contato.url(options),
    method: 'head',
})

/**
* @see routes/web.php:33
* @route '/contato'
*/
const contatoForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: contato.url(options),
    method: 'get',
})

/**
* @see routes/web.php:33
* @route '/contato'
*/
contatoForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: contato.url(options),
    method: 'get',
})

/**
* @see routes/web.php:33
* @route '/contato'
*/
contatoForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: contato.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

contato.form = contatoForm

/**
* @see routes/web.php:34
* @route '/privacidade'
*/
export const privacidade = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: privacidade.url(options),
    method: 'get',
})

privacidade.definition = {
    methods: ["get","head"],
    url: '/privacidade',
} satisfies RouteDefinition<["get","head"]>

/**
* @see routes/web.php:34
* @route '/privacidade'
*/
privacidade.url = (options?: RouteQueryOptions) => {
    return privacidade.definition.url + queryParams(options)
}

/**
* @see routes/web.php:34
* @route '/privacidade'
*/
privacidade.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: privacidade.url(options),
    method: 'get',
})

/**
* @see routes/web.php:34
* @route '/privacidade'
*/
privacidade.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: privacidade.url(options),
    method: 'head',
})

/**
* @see routes/web.php:34
* @route '/privacidade'
*/
const privacidadeForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: privacidade.url(options),
    method: 'get',
})

/**
* @see routes/web.php:34
* @route '/privacidade'
*/
privacidadeForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: privacidade.url(options),
    method: 'get',
})

/**
* @see routes/web.php:34
* @route '/privacidade'
*/
privacidadeForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: privacidade.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

privacidade.form = privacidadeForm

/**
* @see routes/web.php:35
* @route '/termos'
*/
export const termos = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: termos.url(options),
    method: 'get',
})

termos.definition = {
    methods: ["get","head"],
    url: '/termos',
} satisfies RouteDefinition<["get","head"]>

/**
* @see routes/web.php:35
* @route '/termos'
*/
termos.url = (options?: RouteQueryOptions) => {
    return termos.definition.url + queryParams(options)
}

/**
* @see routes/web.php:35
* @route '/termos'
*/
termos.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: termos.url(options),
    method: 'get',
})

/**
* @see routes/web.php:35
* @route '/termos'
*/
termos.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: termos.url(options),
    method: 'head',
})

/**
* @see routes/web.php:35
* @route '/termos'
*/
const termosForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: termos.url(options),
    method: 'get',
})

/**
* @see routes/web.php:35
* @route '/termos'
*/
termosForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: termos.url(options),
    method: 'get',
})

/**
* @see routes/web.php:35
* @route '/termos'
*/
termosForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: termos.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

termos.form = termosForm

/**
* @see routes/web.php:36
* @route '/cookies'
*/
export const cookies = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: cookies.url(options),
    method: 'get',
})

cookies.definition = {
    methods: ["get","head"],
    url: '/cookies',
} satisfies RouteDefinition<["get","head"]>

/**
* @see routes/web.php:36
* @route '/cookies'
*/
cookies.url = (options?: RouteQueryOptions) => {
    return cookies.definition.url + queryParams(options)
}

/**
* @see routes/web.php:36
* @route '/cookies'
*/
cookies.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: cookies.url(options),
    method: 'get',
})

/**
* @see routes/web.php:36
* @route '/cookies'
*/
cookies.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: cookies.url(options),
    method: 'head',
})

/**
* @see routes/web.php:36
* @route '/cookies'
*/
const cookiesForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: cookies.url(options),
    method: 'get',
})

/**
* @see routes/web.php:36
* @route '/cookies'
*/
cookiesForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: cookies.url(options),
    method: 'get',
})

/**
* @see routes/web.php:36
* @route '/cookies'
*/
cookiesForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: cookies.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

cookies.form = cookiesForm

/**
* @see \App\Http\Controllers\DashboardController::dashboard
* @see app/Http/Controllers/DashboardController.php:11
* @route '/dashboard'
*/
export const dashboard = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})

dashboard.definition = {
    methods: ["get","head"],
    url: '/dashboard',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DashboardController::dashboard
* @see app/Http/Controllers/DashboardController.php:11
* @route '/dashboard'
*/
dashboard.url = (options?: RouteQueryOptions) => {
    return dashboard.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DashboardController::dashboard
* @see app/Http/Controllers/DashboardController.php:11
* @route '/dashboard'
*/
dashboard.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DashboardController::dashboard
* @see app/Http/Controllers/DashboardController.php:11
* @route '/dashboard'
*/
dashboard.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: dashboard.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\DashboardController::dashboard
* @see app/Http/Controllers/DashboardController.php:11
* @route '/dashboard'
*/
const dashboardForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: dashboard.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DashboardController::dashboard
* @see app/Http/Controllers/DashboardController.php:11
* @route '/dashboard'
*/
dashboardForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: dashboard.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DashboardController::dashboard
* @see app/Http/Controllers/DashboardController.php:11
* @route '/dashboard'
*/
dashboardForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: dashboard.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

dashboard.form = dashboardForm

/**
* @see routes/web.php:43
* @route '/visao-macro'
*/
export const visaoMacro = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: visaoMacro.url(options),
    method: 'get',
})

visaoMacro.definition = {
    methods: ["get","head"],
    url: '/visao-macro',
} satisfies RouteDefinition<["get","head"]>

/**
* @see routes/web.php:43
* @route '/visao-macro'
*/
visaoMacro.url = (options?: RouteQueryOptions) => {
    return visaoMacro.definition.url + queryParams(options)
}

/**
* @see routes/web.php:43
* @route '/visao-macro'
*/
visaoMacro.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: visaoMacro.url(options),
    method: 'get',
})

/**
* @see routes/web.php:43
* @route '/visao-macro'
*/
visaoMacro.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: visaoMacro.url(options),
    method: 'head',
})

/**
* @see routes/web.php:43
* @route '/visao-macro'
*/
const visaoMacroForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: visaoMacro.url(options),
    method: 'get',
})

/**
* @see routes/web.php:43
* @route '/visao-macro'
*/
visaoMacroForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: visaoMacro.url(options),
    method: 'get',
})

/**
* @see routes/web.php:43
* @route '/visao-macro'
*/
visaoMacroForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: visaoMacro.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

visaoMacro.form = visaoMacroForm

/**
* @see \App\Http\Controllers\SprintController::sprintPlanning
* @see app/Http/Controllers/SprintController.php:16
* @route '/sprint-planning'
*/
export const sprintPlanning = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: sprintPlanning.url(options),
    method: 'get',
})

sprintPlanning.definition = {
    methods: ["get","head"],
    url: '/sprint-planning',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\SprintController::sprintPlanning
* @see app/Http/Controllers/SprintController.php:16
* @route '/sprint-planning'
*/
sprintPlanning.url = (options?: RouteQueryOptions) => {
    return sprintPlanning.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\SprintController::sprintPlanning
* @see app/Http/Controllers/SprintController.php:16
* @route '/sprint-planning'
*/
sprintPlanning.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: sprintPlanning.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\SprintController::sprintPlanning
* @see app/Http/Controllers/SprintController.php:16
* @route '/sprint-planning'
*/
sprintPlanning.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: sprintPlanning.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\SprintController::sprintPlanning
* @see app/Http/Controllers/SprintController.php:16
* @route '/sprint-planning'
*/
const sprintPlanningForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: sprintPlanning.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\SprintController::sprintPlanning
* @see app/Http/Controllers/SprintController.php:16
* @route '/sprint-planning'
*/
sprintPlanningForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: sprintPlanning.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\SprintController::sprintPlanning
* @see app/Http/Controllers/SprintController.php:16
* @route '/sprint-planning'
*/
sprintPlanningForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: sprintPlanning.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

sprintPlanning.form = sprintPlanningForm

/**
* @see \App\Http\Controllers\BoardController::sprintBoard
* @see app/Http/Controllers/BoardController.php:16
* @route '/sprint-board'
*/
export const sprintBoard = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: sprintBoard.url(options),
    method: 'get',
})

sprintBoard.definition = {
    methods: ["get","head"],
    url: '/sprint-board',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\BoardController::sprintBoard
* @see app/Http/Controllers/BoardController.php:16
* @route '/sprint-board'
*/
sprintBoard.url = (options?: RouteQueryOptions) => {
    return sprintBoard.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\BoardController::sprintBoard
* @see app/Http/Controllers/BoardController.php:16
* @route '/sprint-board'
*/
sprintBoard.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: sprintBoard.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\BoardController::sprintBoard
* @see app/Http/Controllers/BoardController.php:16
* @route '/sprint-board'
*/
sprintBoard.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: sprintBoard.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\BoardController::sprintBoard
* @see app/Http/Controllers/BoardController.php:16
* @route '/sprint-board'
*/
const sprintBoardForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: sprintBoard.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\BoardController::sprintBoard
* @see app/Http/Controllers/BoardController.php:16
* @route '/sprint-board'
*/
sprintBoardForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: sprintBoard.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\BoardController::sprintBoard
* @see app/Http/Controllers/BoardController.php:16
* @route '/sprint-board'
*/
sprintBoardForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: sprintBoard.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

sprintBoard.form = sprintBoardForm

/**
* @see \App\Http\Controllers\CalendarController::sprintCalendar
* @see app/Http/Controllers/CalendarController.php:12
* @route '/sprint-calendar'
*/
export const sprintCalendar = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: sprintCalendar.url(options),
    method: 'get',
})

sprintCalendar.definition = {
    methods: ["get","head"],
    url: '/sprint-calendar',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CalendarController::sprintCalendar
* @see app/Http/Controllers/CalendarController.php:12
* @route '/sprint-calendar'
*/
sprintCalendar.url = (options?: RouteQueryOptions) => {
    return sprintCalendar.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CalendarController::sprintCalendar
* @see app/Http/Controllers/CalendarController.php:12
* @route '/sprint-calendar'
*/
sprintCalendar.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: sprintCalendar.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\CalendarController::sprintCalendar
* @see app/Http/Controllers/CalendarController.php:12
* @route '/sprint-calendar'
*/
sprintCalendar.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: sprintCalendar.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\CalendarController::sprintCalendar
* @see app/Http/Controllers/CalendarController.php:12
* @route '/sprint-calendar'
*/
const sprintCalendarForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: sprintCalendar.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\CalendarController::sprintCalendar
* @see app/Http/Controllers/CalendarController.php:12
* @route '/sprint-calendar'
*/
sprintCalendarForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: sprintCalendar.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\CalendarController::sprintCalendar
* @see app/Http/Controllers/CalendarController.php:12
* @route '/sprint-calendar'
*/
sprintCalendarForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: sprintCalendar.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

sprintCalendar.form = sprintCalendarForm
