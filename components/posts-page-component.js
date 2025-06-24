import { USER_POSTS_PAGE } from "../routes";
import { renderHeaderComponent } from "./header-component";
import { posts, goToPage } from "../index";
import { formatDistanceToNow } from "date-fns/formatDistanceToNow";
import ru from "date-fns/locale/ru";
import { likeComponent } from "./like-component";

export function renderPostsPageComponent({ appEl, userId }) {

  const postsHtml = posts
    .map((post) => {

      const isLiked = post.likes.some(like => like.id === userId);
      const likeCountText = calculateLikeCountText(post.likes, post.user.name);
      return `
                  <li class="post">
                    <div class="post-header" data-userid="${post.user.id}">
                        <img src=${post.user.imageUrl} class="post-header__user-image">
                        <p class="post-header__user-name">${post.user.name}</p>
                    </div>
                    <div class="post-image-container">
                      <img class="post-image" src=${post.imageUrl}>
                    </div>
                    <div class="post-likes">
                      <button data-postid="${post.id}" class="like-button ${isLiked ? '-active' : '-not-active'}">
                        <img src="" />
                      </button>
                      <p class="post-likes-text">
                       Нравится: <strong>${likeCountText}</strong>
                       
                      </p>
                    </div>
                    <p class="post-text">
                      <span class="user-name" data-userid="${userId}">${post.user.name}</span>
                      ${post.description}
                    </p>
                    <p class="post-date">
                     ${formatDistanceToNow(new Date(post.createdAt), { locale: ru })}
                    </p>
                  </li>
              `;
    })
    .join("");

  const appHtml = `<div class="page-container">
                    <div class="header-container"></div>
                    <ul class="posts">${postsHtml}
                    </ul>
                  </div>`

  appEl.innerHTML = appHtml;

  renderHeaderComponent({
    element: document.querySelector(".header-container"),
  });

  for (let userEl of document.querySelectorAll(".post-header")) {
    userEl.addEventListener("click", () => {
      goToPage(USER_POSTS_PAGE, {
        userId: userEl.dataset.userid,
      });
    });
  }

  likeComponent({
    renderPostsPageComponent: renderPostsPageComponent,
    appEl: appEl,
    posts: posts,
    userId: userId,
  })
}

function calculateLikeCountText(likes) {
  if (likes.length === 0) {
    return '0';
  } else if (likes.length === 1) {
    return `${likes[0].name}`;
  } else if (likes.length === 2) {
    return `${likes[0].name} и еще 1`;
  } else {
    return `${likes.length}`;
  }
}
// .filter((post) => (userId ? post.id === userId : true))