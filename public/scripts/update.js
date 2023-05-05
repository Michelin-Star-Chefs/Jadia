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
const dataPush = async obj => {
  const user = await fetchLoggedInUser();
  obj.user_id = user.id;
  const options = getFetchOptions(obj);
  // should be hitting a route with dynamic value
  const [_response, err] = await handleFetch("/api/update/:id", options);
  console.log(_response, err);
};

const main = async () => {
  const user = await fetchLoggedInUser();
  setNav(!!user);

  const updatePostForm = document.querySelector("#update-post-form");
  updatePostForm.addEventListener("submit", e => {
    e.preventDefault();
    const inputs = [...e.target.children]
      .filter(child => child.type && child.type != "submit")
      .map(child => child.value);
    const obj = makeInputObj(inputs);
    dataPush(obj);
  });
};

main();
