import { USER_POSTS_PAGE } from "../routes";
import { renderHeaderComponent } from "./header-component";
import { posts, goToPage } from "../index";
import { formatDistanceToNow } from "date-fns/formatDistanceToNow";
import ru from "date-fns/locale/ru";
// import { likeComponent } from "./like-component.js";

export function renderPostsPageComponent({ appEl, userId }) {

  const appHtml = posts
    .map((post) => {
      let likeCountText
            if (post.likes.length === 0) {
                likeCountText = '0'
            } else if (post.likes.length === 1) {
                likeCountText = `${post.likes[0].name}`
            } else if (post.likes.length === 2) {
                likeCountText = `${post.likes[0].name} и еще 1`
            } else {
                likeCountText = `${post.likes.length}`
            }
      return `
              <div class="page-container">
                <div class="header-container"></div>
                <ul class="posts">
                  <li class="post">
                    <div class="post-header" data-userid="${post.id}">
                        <img src=${post.user.imageUrl} class="post-header__user-image">
                        <p class="post-header__user-name">${post.user.name}</p>
                    </div>
                    <div class="post-image-container">
                      <img class="post-image" src=${post.imageUrl}>
                    </div>
                    <div class="post-likes">
                      <button data-post-id=${post.user.id} class="like-button">
                        <img src=${(post.isLiked
                ? '"./assets/images/like-active.svg">'
                : '"./assets/images/like-not-active.svg">'
)}
                      </button>
                      <p class="post-likes-text">
                       Нравится: <strong>${post.likeCountText}</strong>
                      </p>
                    </div>
                    <p class="post-text">
                      <span class="user-name data-userid=${userId}">${post.user.name}</span>
                      ${post.description}
                    </p>
                    <p class="post-date">
                     ${formatDistanceToNow(new Date(post.createdAt), {locale: ru})}
                    </p>
                  </li>
                </ul>
              </div>`;
    })
    .join("");

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
}


// import { USER_POSTS_PAGE } from '../routes.js'
// import { renderHeaderComponent } from './header-component.js'
// import { posts, goToPage } from '../index.js'

// export function renderPostsPageComponent({ appEl, userId  }) {
//     /**
//      * @TODO: чтобы отформатировать дату создания поста в виде "19 минут назад"
//      * можно использовать https://date-fns.org/v2.29.3/docs/formatDistanceToNow
//      */


//     const appHtml = posts
//     .filter(post => userId ? post.user.id === userId : true) // Filter posts by userId, if provided
//     .map(post => {
//       return `
//               <div class="page-container">
//                 <div class="header-container"></div>
//                 <ul class="posts">
//                   <li class="post">
//                     <div class="post-header" data-user-id=${post.userId}>
//                         <img src=${post.user.imageUrl} class="post-header__user-image">
//                         <p class="post-header__user-name">${post.user.name}</p>
//                     </div>
//                     <div class="post-image-container">
//                       <img class="post-image" src=${post.imageUrl}>
//                     </div>
//                     <div class="post-likes">
//                       <button data-post-id=${post.user.id} class="like-button">
//                         <img src="./assets/images/like-active.svg">
//                       </button>
//                       <p class="post-likes-text">
//                        Нравится: <strong>${post.likes.name}</strong>
//                       </p>
//                     </div>
//                     <p class="post-text">
//                       <span class="user-name">${post.user.name}</span>
//                       ${post.description}
//                     </p>
//                     <p class="post-date">
//                       19 минут назад
//                     </p>
//                   </li>
//                 </ul>
//               </div>`
//         })
//         .join('')

//     appEl.innerHTML = appHtml

//     renderHeaderComponent({
//         element: document.querySelector('.header-container'),
//     })

//     for (let userEl of document.querySelectorAll('.post-header')) {
//         userEl.addEventListener('click', () => {
//             goToPage(USER_POSTS_PAGE, {
//                 userId: userEl.dataset.userId,
//             })
//         })
//     }
// }
