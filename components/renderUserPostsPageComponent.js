import { renderHeaderComponent } from './header-component.js'
import { USER_POSTS_PAGE } from '../routes.js'
import { posts, goToPage } from '../index.js'
import { formatDistanceToNow } from "../node_modules/date-fns/formatDistanceToNow.js";

export function renderUserPostsPageComponent({ appEl, userId }) {
    appEl.innerHTML = ''

    const appHtml = posts
        .map((post) => {
            return `
            <div class="page-container">
                <div class="header-container"></div>
                <div class="posts-user-header" data-user-id=${post.id}>
                    <img src=${post.user.imageUrl} class="posts-user-header__user-image">
                    <p class="posts-user-header__user-name">${post.user.name}</p>
                </div>
                <ul class="posts">
                
                    <li class="post">
                        <div class="post-image-container">
                            <img class="post-image" src=${post.user.imageUrl}>
                        </div>
                        <div class="post-likes">
                            <button data-post-id=${post.user.id} class="like-button">
                                <img src=${(post.isLiked
                ? '"./assets/images/like-active.svg">'
                : '"./assets/images/like-not-active.svg">'
)}
                            </button>
                            <p class="post-likes-text">
                                Нравится: <strong>Kate</strong> и <strong>еще 1</strong>
                            </p>
                        </div>
                        <p class="post-text">
                        <span class="user-name data-user-id=${userId}">${post.user.name}</span>
                            ${post.description}
                        </p>s
                        <p class="post-date">
                            ${formatDistanceToNow(new Date(post.createdAt))}
                        </p>
                    </li>
          
                </ul>
                <br>
            </div>`
        })
        .join('')
    appEl.innerHTML = appHtml

    renderHeaderComponent({
        element: document.querySelector('.header-container'),
    })

    for (let userEl of document.querySelectorAll('.post-header')) {
        userEl.addEventListener('click', () => {
            goToPage(USER_POSTS_PAGE, {
                userId: userEl.dataset.userId,
            })
        })
    }
}
