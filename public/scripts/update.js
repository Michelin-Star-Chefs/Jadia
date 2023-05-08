import {
  fetchLoggedInUser,
  getFetchOptions,
  handleFetch,
  setNav,
} from "./global.js";

const makeInputObj = arr => {
  return {
    location: arr[0],
    start_date: arr[1],
    end_date: arr[2],
    description: arr[3],
    photo: arr[4],
  };
};

const addPrevPostToPage = async post_id => {
  //fetch the post with post id
  const [postObj, err] = await handleFetch(`/api/post/${post_id}`, {
    method: "GET",
  });
  //add it to the page
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
  profileImage.src = postObj.profile_photo || "/images/default_icon.png";
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
  //image
  const postImage = document.createElement("img");
  postImage.src =
    postObj.photo ||
    "https://climate.onep.go.th/wp-content/uploads/2020/01/default-image.jpg";
  postImage.className = "post-image";
  const postDescription = document.createElement("div");
  postDescription.className = "content";
  postDescription.innerText = postObj.description;
  //appending it together
  cardContent.appendChild(media);
  cardContent.appendChild(postImage);
  cardContent.appendChild(postDescription);
  container.appendChild(cardContent);
  document.querySelector("#prev-post-section").appendChild(container);
};

//post_id -> handle fetch
const dataPush = async obj => {
  const user = await fetchLoggedInUser();
  console.log(user.id);
  obj.user_id = user.id;
  const options = getFetchOptions(obj, "PATCH");
  const post_id = sessionStorage.getItem("post_id");
  const [_response, err] = await handleFetch(`/api/update/${post_id}`, options);
  window.location.assign("/feed.html");
};

const main = async () => {
  const user = await fetchLoggedInUser();
  setNav(!!user);
  const post_id = sessionStorage.getItem("post_id");
  console.log("post id: ", post_id);
  addPrevPostToPage(post_id);
  const updatePostForm = document.querySelector("#update-post-form");
  updatePostForm.addEventListener("submit", e => {
    e.preventDefault();
    const inputs = [...e.target.children]
      .filter(child => child.type && child.type != "submit")
      .map(child => child.value);
    const obj = makeInputObj(inputs);
    dataPush(obj);
    // window.location.assign("/feed.html");
  });
};

main();
