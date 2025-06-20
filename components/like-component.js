import { posts } from '../index.js'
import { token } from '../index.js'

export const likeComponent = (renderPostsPageComponent, appEl) => {
    const likesButtons = document.querySelectorAll('.like-button')

    likesButtons.forEach((likeButton, index) => {
        likeButton.addEventListener('click', (event) => {
            event.stopPropagation()
            const post = posts[index]
            if (token) {
                post.isLiked = !post.isLiked
                if (post.isLiked) {
                    post.likes.push({ id: post.user.id, name: post.user.name })
                } else {
                    post.likes = post.likes.filter(
                        (like) => like.id !== post.user.id,
                    )
                }

                renderPostsPageComponent({ appEl })
            } else {
                alert('Чтобы поставить лайк, авторизуйтесь')
            }
        })
    })
}