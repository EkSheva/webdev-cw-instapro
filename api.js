// Замени на свой, чтобы получить независимый от других набор данных.
// "боевая" версия инстапро лежит в ключе prod

const personalKey = 'sh'
const baseHost = 'https://webdev-hw-api.vercel.app'
const postsHost = `${baseHost}/api/v1/${personalKey}/instapro`

export function getPosts({ token }) {
    return fetch(postsHost, {
        method: 'GET',
        headers: {
            Authorization: token,
        },
    })
        .then((response) => {
            if (response.status === 401) {
                throw new Error('Нет авторизации')
            }

            return response.json()
        })
        .then((data) => {
            return data.posts
        })
}

export function registerUser({ login, password, name, imageUrl }) {
    return fetch(baseHost + '/api/user', {
        method: 'POST',
        body: JSON.stringify({
            login,
            password,
            name,
            imageUrl,
        }),
    }).then((response) => {
        if (response.status === 400) {
            throw new Error('Такой пользователь уже существует')
        }
        return response.json()
    })
}

export function loginUser({ login, password }) {
    return fetch(baseHost + '/api/user/login', {
        method: 'POST',
        body: JSON.stringify({
            login,
            password,
        }),
    }).then((response) => {
        if (response.status === 400) {
            throw new Error('Неверный логин или пароль')
        }
        return response.json()
    })
}

// Загружает картинку в облако, возвращает url загруженной картинки
export function uploadImage({ file }) {
    const data = new FormData()
    data.append('file', file)

    return fetch(baseHost + '/api/upload/image', {
        method: 'POST',
        body: data,
    }).then((response) => {
        return response.json()
    })
}

export const fetchPost = (description, imageUrl, token) => {
    return fetch(postsHost, {
        method: 'POST',
        headers: {
            Authorization: token,
        },
        body: JSON.stringify({
            description,
            imageUrl,
        }),
    })
        .then((response) => {
            if (response.status === 201) {
                return response.json()
            } else {
                if (response.status === 500) {
                    throw new Error('Сервер сломался, попробуй позже')
                }
                if (response.status === 400) {
                    throw new Error('Неверный запрос')
                }
                throw new Error(
                    'Кажется, у вас сломался интернет, попробуйте позже',
                )
            }
        })
        .then((data) => {
            console.log(data)
            return data
        })
}

export const fetchUser = ({ userId, token }) => {
    return fetch(postsHost + `/user-posts/${userId}`, {
        method: 'GET',
        headers: {
            Authorization: token,
        },
    })
        .then((response) => {
            if (response.status === 401) {
                throw new Error('Нет авторизации')
            }

            return response.json()
        })
        .then((data) => {
            return data.posts
        })
}

export function addLikePost({ token, postId }) {
    return fetch(postsHost + `/${postId}/like`, {
        method: 'POST',
        headers: {
            Authorization: token,
        },
    }).then((response) => {
        if (response.status === 201) {
            return response.json()
        } else {
            if (response.status === 401) {
                throw new Error(
                    'Чтобы поставить лайк, необходимо авторизоваться',
                )
            }
        }
    })
}

export function disLikePost({ token, postId }) {
    return fetch(postsHost + `/${postId}/dislike`, {
        method: 'POST',
        headers: {
            Authorization: token,
        },
    }).then((response) => {
        if (response.status === 201) {
            return response.json()
        } else {
            if (response.status === 401) {
                throw new Error(
                    'Чтобы поставить лайк, необходимо авторизоваться',
                )
            }
        }
    })
}