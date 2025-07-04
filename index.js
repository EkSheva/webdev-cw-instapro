import { fetchPost, fetchUser, getPosts } from './api'
import { renderAddPostPageComponent } from './components/add-post-page-component'
import { renderAuthPageComponent } from './components/auth-page-component'
import {
    ADD_POSTS_PAGE,
    AUTH_PAGE,
    LOADING_PAGE,
    POSTS_PAGE,
    USER_POSTS_PAGE,
} from './routes.js'
import { renderPostsPageComponent } from './components/posts-page-component.js'
import { renderLoadingPageComponent } from './components/loading-page-component.js'
import {
    getUserFromLocalStorage,
    removeUserFromLocalStorage,
    saveUserToLocalStorage,
} from './helpers.js'

export let user = getUserFromLocalStorage()
export let page = null
export let posts = []

export const updatePosts = (newPosts) => {
    posts = newPosts
}

export const getToken = () => {
    const token = user ? `Bearer ${user.token}` : undefined
    return token
}

export const logout = () => {
    user = null
    removeUserFromLocalStorage()
    goToPage(POSTS_PAGE)
}

/**
 * Включает страницу приложения
 */
export const goToPage = (newPage, data) => {
    if (
        [
            POSTS_PAGE,
            AUTH_PAGE,
            ADD_POSTS_PAGE,
            USER_POSTS_PAGE,
            LOADING_PAGE,
        ].includes(newPage)
    ) {
        if (newPage === ADD_POSTS_PAGE) {
            /* Если пользователь не авторизован, то отправляем его на страницу авторизации перед добавлением поста */
            page = user ? ADD_POSTS_PAGE : AUTH_PAGE
            return renderApp()
        }

        if (newPage === POSTS_PAGE) {
            page = LOADING_PAGE
            renderApp()

            return getPosts({ token: getToken() })
                .then((newPosts) => {
                    page = POSTS_PAGE
                    posts = newPosts
                    renderApp()
                })
                .catch((error) => {
                    console.error(error)
                    goToPage(POSTS_PAGE)
                })
        }

        if (newPage === USER_POSTS_PAGE) {
            page = LOADING_PAGE
            renderApp()
            // @@TODO: реализовать получение постов юзера из API
        
            return fetchUser({ token: getToken(), userId: data.userId })
                .then((userPosts) => {
                    page = USER_POSTS_PAGE
                    posts = userPosts
                    renderApp(posts)
                })
                .catch((error) => {
                    console.error(error)
                    goToPage(POSTS_PAGE)
                })
        }
        page = newPage
        renderApp()

        return
    }

        throw new Error('страницы не существует')
    }

    const renderApp = () => {
        const appEl = document.getElementById('app')
        if (page === LOADING_PAGE) {
            return renderLoadingPageComponent({
                appEl,
                user,
                goToPage,
            })
        }

        if (page === AUTH_PAGE) {
            return renderAuthPageComponent({
                appEl,
                setUser: (newUser) => {
                    user = newUser
                    saveUserToLocalStorage(user)
                    goToPage(POSTS_PAGE)
                },
                user,
                goToPage,
            })
        }

        if (page === ADD_POSTS_PAGE) {
            return renderAddPostPageComponent({
                appEl,
                onAddPostClick({ description, imageUrl }) {
                    const token = getToken()
                    fetchPost(description, imageUrl, token)
                        .then(() => {
                            goToPage(POSTS_PAGE)
                        })
                        .catch((error) => {
                            console.error('Ошибка при добавлении поста:', error)
                            alert(error.message)
                        })
                },
            })
        }

        if (page === POSTS_PAGE) {
            return renderPostsPageComponent({
                appEl,
            })
        }

        if (page === USER_POSTS_PAGE) {
            // @TODO: реализовать страницу с фотографиями отдельного пользвателя
            return renderPostsPageComponent({
                appEl: appEl,
                posts: posts,
                userId: data.userId,
            });
        }
    }

    goToPage(POSTS_PAGE)