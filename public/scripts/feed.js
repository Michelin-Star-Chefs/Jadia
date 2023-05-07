import {
  fetchLoggedInUser,
  getFetchOptions,
  handleFetch,
  setNav,
} from "./global.js";

const user = await fetchLoggedInUser();
console.log(user);

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
    //add post id to session
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
    const [response, err] = await handleFetch(`/api/delete/${post_id}`, {
      method: "DELETE",
    });
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
  // comments
  const commentIcon = document.createElement("a");
  commentIcon.className = "card-footer-item";
  const commentImage = document.createElement("img");
  commentImage.src = "../../public/images/comment.png";
  commentImage.classList.add("js-modal-trigger");
  commentImage.setAttribute("data-target", postObj.post_id);
  // appends
  commentIcon.appendChild(commentImage);
  postFooter.appendChild(likeIcon);
  postFooter.appendChild(commentIcon);
  cardContent.appendChild(media);
  cardContent.appendChild(postImage);
  cardContent.appendChild(postDescription);
  cardContent.appendChild(postFooter);
  container.appendChild(cardContent);
  document.querySelector("main").appendChild(container);
  //comments section code
  addCommentModalHTML(postObj.post_id);
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

function addCommentModalHTML(post_id) {
  // Create the modal container
  const modalContainer = document.createElement("div");
  modalContainer.setAttribute("id", post_id);
  modalContainer.setAttribute("class", "modal");

  // Create the modal background
  const modalBackground = document.createElement("div");
  modalBackground.setAttribute("class", "modal-background");
  modalContainer.appendChild(modalBackground);

  // Create the modal content
  const modalContent = document.createElement("div");
  modalContent.setAttribute("class", "modal-content");
  modalContainer.appendChild(modalContent);

  // Create the box element
  const box = document.createElement("div");
  box.setAttribute("class", "box");

  // Add content
  addModalContent(box, post_id);
  modalContent.appendChild(box);

  // Create the close button
  const closeButton = document.createElement("button");
  closeButton.setAttribute("class", "modal-close is-large");
  closeButton.setAttribute("aria-label", "close");
  modalContainer.appendChild(closeButton);

  // Add the modal to the document body
  document.body.appendChild(modalContainer);
}

async function getComments(post_id) {
  const [postComments, _commentErr] = await handleFetch(
    `/api/posts/${post_id}/comments`,
    { method: "GET" }
  );
  return postComments;
}

async function addModalContent(div, post_id) {
  //container that lists comments
  const commentsSection = document.createElement("section");
  let postComments = await getComments(post_id);
  if (postComments) {
    postComments.forEach(commentObj => {
      const comment = document.createElement("div");
      comment.style.display = "flex";
      const username = document.createElement("p");
      username.innerText = commentObj.username;
      const content = document.createElement("p");
      content.innerText = commentObj.content;
      const br = document.createElement("p");
      br.innerText = ":   :";
      comment.appendChild(username);
      comment.appendChild(br);
      comment.appendChild(content);
      //append delete link to comment

      if (commentObj.user_id == user.id) {
        const deleteLink = document.createElement("a");
        deleteLink.innerText = "Delete Comment";
        deleteLink.addEventListener("click", async () => {
          //delete comment from database
          await handleFetch(
            `/api/posts/${post_id}/comments/${commentObj.comment_id}`,
            { method: "DELETE" }
          );
          //remove comment from dom (visulaly)
          comment.remove();
        });
        comment.appendChild(deleteLink);
      }
      commentsSection.appendChild(comment);
    });
  }
  //form creation
  const field = document.createElement("form");
  field.className = "field is-grouped";
  const commentControl = document.createElement("p");
  commentControl.className = "control is-expanded";
  const commentInput = document.createElement("input");
  commentInput.name = "comment";
  commentInput.className = "input";
  commentInput.type = "text";
  commentInput.placeholder = "Add Comment";
  const submitControl = document.createElement("p");
  submitControl.className = "control";
  const submitButton = document.createElement("button");
  submitButton.type = "Submit";
  submitButton.className = "button is-info";
  submitButton.innerText = "Send";

  //appending form together
  commentControl.appendChild(commentInput);
  submitControl.appendChild(submitButton);
  field.appendChild(commentControl);
  field.appendChild(submitControl);

  //submit button event lister -> post request for comment
  field.addEventListener("submit", async e => {
    e.preventDefault();
    const value = e.target[0].value;
    const body = {
      postId: post_id,
      content: value,
      userId: user.id,
    };
    const options = getFetchOptions(body);
    const url = `/api/posts/${post_id}/comments`;
    const { response, err } = await handleFetch(url, options);
    e.target[0].value = "";

    //add make new comment & add to dom
    const comment = document.createElement("div");
    comment.style.display = "flex";
    const username = document.createElement("p");
    username.innerText = user.username;
    const content = document.createElement("p");
    content.innerText = value;
    const br = document.createElement("p");
    br.innerText = ":   :";
    comment.appendChild(username);
    comment.appendChild(br);
    comment.appendChild(content);

    // Add delete link to comment as the comment is created by the current user
    const deleteLink = document.createElement("a");
    deleteLink.innerText = "Delete Comment";
    deleteLink.addEventListener("click", async () => {
      //delete comment from database
      if (response && response.comment_id) {
        await handleFetch(
          `/api/posts/${post_id}/comments/${response.comment_id}`, // Use response.comment_id
          { method: "DELETE" }
        );
      }
      //remove comment from dom (visually)
      comment.remove();
    });
    comment.appendChild(deleteLink);

    commentsSection.appendChild(comment);
  });

  //appending everything
  div.appendChild(commentsSection);
  div.appendChild(field);
}

function makeModalsWork() {
  // Functions to open and close a modal
  function openModal($el) {
    $el.classList.add("is-active");
  }

  function closeModal($el) {
    $el.classList.remove("is-active");
  }

  function closeAllModals() {
    (document.querySelectorAll(".modal") || []).forEach($modal => {
      closeModal($modal);
    });
  }

  // Add a click event on buttons to open a specific modal
  (document.querySelectorAll(".js-modal-trigger") || []).forEach($trigger => {
    const modal = $trigger.dataset.target;
    const $target = document.getElementById(modal);

    $trigger.addEventListener("click", () => {
      openModal($target);
    });
  });

  // Add a click event on various child elements to close the parent modal
  (
    document.querySelectorAll(
      ".modal-background, .modal-close, .modal-card-head .delete, .modal-card-foot .button"
    ) || []
  ).forEach($close => {
    const $target = $close.closest(".modal");

    $close.addEventListener("click", () => {
      closeModal($target);
    });
  });

  // Add a keyboard event to close all modals
  document.addEventListener("keydown", event => {
    const e = event || window.event;

    if (e.keyCode === 27) {
      // Escape key
      closeAllModals();
    }
  });
}

const main = async () => {
  if (!user) return redirectToLogin();
  setNav(!!user);

  const [posts, _postErr] = await handleFetch("/api/list", {
    method: "GET",
  });
  posts.forEach(post => addPostToPage(post, user.id));
  makeModalsWork();

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
};

main();
