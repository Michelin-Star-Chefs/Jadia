import {
  fetchLoggedInUser,
  getFetchOptions,
  handleFetch,
  setNav,
} from "./global.js";

const redirectToLogin = () => window.location.assign("/login.html");

function createDropdown(mediaNode, post_id, postContainer) {
  const dropdown = document.createElement("div");
  dropdown.classList.add("dropdown", "is-active");

  const dropdownTrigger = document.createElement("div");
  dropdownTrigger.classList.add("dropdown-trigger");

  const dropdownButton = document.createElement("button");
  dropdownButton.classList.add("button");
  dropdownButton.setAttribute("aria-haspopup", "true");
  dropdownButton.setAttribute("aria-controls", "dropdown-menu");

  const dropdownButtonLabel = document.createElement("span");
  dropdownButtonLabel.innerText = "...";
  dropdownButton.appendChild(dropdownButtonLabel);

  const dropdownIcon = document.createElement("span");
  dropdownIcon.classList.add("icon", "is-small");
  const dropdownIconImage = document.createElement("i");
  dropdownIconImage.classList.add("fas", "fa-angle-down");

  dropdownIcon.appendChild(dropdownIconImage);
  dropdownButton.appendChild(dropdownIcon);

  dropdownTrigger.appendChild(dropdownButton);
  dropdown.appendChild(dropdownTrigger);

  const dropdownMenu = document.createElement("div");
  dropdownMenu.classList.add("dropdown-menu");
  dropdownMenu.setAttribute("id", "dropdown-menu");
  dropdownMenu.setAttribute("role", "menu");

  const dropdownContent = document.createElement("div");
  dropdownContent.classList.add("dropdown-content");

  const dropdownItem1 = document.createElement("a");
  dropdownItem1.classList.add("dropdown-item");
  dropdownItem1.setAttribute("href", "#");
  dropdownItem1.innerText = "Update";
  dropdownItem1.addEventListener("click", () => {
    //this WILL ONE DAY make the update work
    //add post id to session
    console.log(post_id);
    sessionStorage.setItem("post_id", post_id);
    //then redirect to update.html
    window.location.assign("/update.html");
  });

  const dropdownItem2 = document.createElement("a");
  dropdownItem2.classList.add("dropdown-item");
  dropdownItem2.setAttribute("href", "#");
  dropdownItem2.innerText = "Delete";
  dropdownItem2.addEventListener("click", async e => {
    //this makes the delete work
    //do the backened fetch call
    console.log(post_id);
    const { responce, err } = await handleFetch(`/api/delete/${post_id}`, {
      method: "DELETE",
    });
    console.log(responce);
    //remove the card from the page
    postContainer.remove();
  });

  dropdownContent.appendChild(dropdownItem1); //matters
  dropdownContent.appendChild(dropdownItem2); //matters

  dropdownMenu.appendChild(dropdownContent);
  dropdown.appendChild(dropdownMenu);
  mediaNode.appendChild(dropdown);
}

function addPostToPage(postObj, user_id) {
  const container = document.createElement("div");
  container.className = "card post";
  const cardContent = document.createElement("div");
  cardContent.className = "card-content";
  const media = document.createElement("div");
  media.className = "media";
  const mediaLeft = document.createElement("div");
  mediaLeft.className = "media-left";
  const figure = document.createElement("figure");
  figure.className = "image is-64x64";
  const profileImage = document.createElement("img");
  profileImage.src =
    postObj.profile_photo || "../../public/images/default_image.jpg";
  figure.appendChild(profileImage);
  mediaLeft.appendChild(figure);
  const mediaContent = document.createElement("div");
  mediaContent.className = "media-content";
  const username = document.createElement("p");
  username.className = "subtitle is-6";
  username.innerText = postObj.username;
  const location = document.createElement("p");
  location.className = "subtitle is-6";
  location.innerText = postObj.location;
  mediaContent.appendChild(username);
  mediaContent.appendChild(location);
  media.appendChild(mediaLeft);
  media.appendChild(mediaContent);
  if (postObj.user_id == user_id) {
    //adds editing options for posts made by the logged in user
    createDropdown(media, postObj.post_id, container); //only relies of the media & container divs atm
  }
  const postImage = document.createElement("img");
  postImage.src =
    postObj.photo ||
    "https://climate.onep.go.th/wp-content/uploads/2020/01/default-image.jpg";
  postImage.className = "post-image";
  const postDescription = document.createElement("div");
  postDescription.className = "content";
  postDescription.innerText = postObj.description;
  const postFooter = document.createElement("footer");
  postFooter.className = "card-footer";
  const likeIcon = document.createElement("a");
  likeIcon.className = "card-footer-item";
  const likeImage = document.createElement("img");
  likeImage.className = "likeButton";
  likeImage.src = "../../public/images/unliked.png";
  likeImage.setAttribute("data-post-id", postObj.post_id);
  const likeCount = document.createElement("span");
  likeCount.innerText = postObj.likes_count;
  likeCount.setAttribute("data-post-id", postObj.post_id);
  likeIcon.appendChild(likeImage);
  likeIcon.appendChild(likeCount);
  const commentIcon = document.createElement("a");
  commentIcon.className = "card-footer-item";
  const commentImage = document.createElement("img");
  commentImage.src = "../../public/images/comment.png";
  commentIcon.appendChild(commentImage);
  postFooter.appendChild(likeIcon);
  postFooter.appendChild(commentIcon);
  cardContent.appendChild(media);
  cardContent.appendChild(postImage);
  cardContent.appendChild(postDescription);
  cardContent.appendChild(postFooter);
  container.appendChild(cardContent);
  document.querySelector("main").appendChild(container);
}

const addLikeFunctionality = async post_id => {
  const data = await fetchLoggedInUser();
  const body = {
    user_id: data.id,
    post_id: post_id,
  };
  const options = await getFetchOptions(body);
  const [_response, err] = await handleFetch("/api/toggleLike", options);
  return _response.likes_count;
};

//make a function given an array of objs, add all the objs to to the page
const addCommentsToPost = async (post_id, postComments, commentsSection) => {
  postComments.forEach(comment => {
    const commentElement = document.createElement("p");
    commentElement.innerText = comment.content;
    commentsSection.appendChild(commentElement);
  });
};

const main = async () => {
  const user = await fetchLoggedInUser();
  console.log(user);
  if (!user) return redirectToLogin();
  setNav(!!user);

  const [posts, _postErr] = await handleFetch("/api/list", {
    method: "GET",
  });
  posts.forEach(post => addPostToPage(post, user.id));

  // LIKES BUTTON
  const likes = Array.from(document.getElementsByClassName("likeButton"));
  likes.forEach(button => {
    button.addEventListener("click", async e => {
      const post_id = e.target.getAttribute("data-post-id");
      const likesAmount = await addLikeFunctionality(Number(post_id));
      const likeCount = e.target.nextElementSibling;
      likeCount.innerText = likesAmount;
    });
  });

  // COMMENTS SECTION
  const commentsSection = Array.from(
    document.getElementsByClassName("commentSection")
  );
  commentsSection.forEach(async section => {
    const post_id = section.getAttribute("data-post-id");
    const [postComments, _commentErr] = await handleFetch(
      `/api/posts/${post_id}/comments`,
      { method: "GET" }
    );
    if (postComments.length > 0) {
      addCommentsToPost(post_id, postComments, section);
    }
  });
};

main();
