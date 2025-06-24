import { getToken, goToPage, updatePosts, user } from '../index'
import { renderPostsPageComponent } from './posts-page-component'
import { addLikePost, disLikePost } from '../api'
import { AUTH_PAGE } from "../routes"

export const likeComponent = ({ appEl, posts, userId }) => {
    const likesButtons = document.querySelectorAll('.like-button')

    likesButtons.forEach((likesButton) => {
        likesButton.addEventListener('click', (event) => {
            event.stopPropagation()
            const postId = likesButton.dataset.postid;
            const isLiked = likesButton.classList.contains('-active');
            const token = getToken();
            if (!token) {
                alert('Для лайка, авторизуйтесь, пожалуйста');
                return goToPage(AUTH_PAGE);
            }
            likesButton.classList.add('-loading-like');

            const likeAction = isLiked ? disLikePost : addLikePost;

            likeAction({ token, postId })
                .then(() => {

                    const postIndex = posts.findIndex(post => post.id === postId);

                    if (postIndex !== -1) {

                        if (isLiked) {
                            posts[postIndex].likes = posts[postIndex].likes.filter(like => like.id !== userId);

                        } else {
                            posts[postIndex].likes.push({ name: user.name });

                        }

                        updatePosts(posts)
                        renderPostsPageComponent({ appEl, userId, posts });
                    }
                })
                .catch(error => {
                    console.error('Error likeing/dislikeing post:', error);
                    alert('Произошла ошибка при лайке/дизлайке');
                })
                .finally(() => {
                    likesButton.classList.remove('-loading-like');
                });
        })
    })
}