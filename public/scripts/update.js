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
