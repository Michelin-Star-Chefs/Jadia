import { fetchLoggedInUser, getFetchOptions, handleFetch, setNav } from "./global.js";

const makeInputObj = arr => {
  return {
    location: arr[0],
    "start-date": arr[1],
    "end-date": arr[2],
    description: arr[3],
    "image-url": arr[4],
  };
};

const main = async () => {
  const user = await fetchLoggedInUser();
  setNav(!!user);

  const newPostForm = document.querySelector("#new-post-form");
  newPostForm.addEventListener("submit", e => {
    e.preventDefault();
    const inputs = [...e.target.children]
      .filter(child => child.type && child.type != "submit")
      .map(child => child.value);
    const obj = makeInputObj(inputs);
    console.log(obj);
    // const options = getFetchOptions(obj);
    // const [_response, err] = await handleFetch("/api/post",options)
  });

  //fetch then post
  const [_response, err] = await handleFetch(url, options);
  if (err) {
    form.reset();
    return alert("Something went wrong");
  }
  window.location.assign("/user.html");
};

main();
