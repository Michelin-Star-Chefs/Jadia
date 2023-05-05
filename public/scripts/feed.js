import {
  fetchLoggedInUser,
  getFetchOptions,
  handleFetch,
  setNav,
} from "./global.js";

const redirectToLogin = () => window.location.assign("/login.html");

function addPostToPage(postObj) {
  const container = document.createElement("section");
  const location = document.createElement("h3");
  location.innerText = postObj.location;
  const image = document.createElement("img");
  image.src =
    postObj.photo ||
    "https://climate.onep.go.th/wp-content/uploads/2020/01/default-image.jpg";
  const start_date = document.createElement("p");
  start_date.innerText = postObj.start_date;
  const end_date = document.createElement("p");
  end_date.innerText = postObj.end_date;
  const like = document.createElement("img");
  like.className = "likeButton";
  like.src = "../../images/unliked.png";
  like.setAttribute("data-post-id", postObj.post_id);
  const likeCount = document.createElement("p");
  likeCount.innerText = postObj.likes_count;
  likeCount.setAttribute("data-post-id", postObj.post_id);
  const description = document.createElement("p");
  description.innerText = postObj.description;
  const commentsSection = document.createElement("section");
  commentsSection.className = "commentSection";
  commentsSection.setAttribute("data-post-id", postObj.post_id);
  container.append(
    location,
    image,
    start_date,
    end_date,
    like,
    likeCount,
    description,
    commentsSection
  );
  document.body.appendChild(container);
}

const addLikeFunctionality = async post_id => {
  const data = await fetchLoggedInUser();
  const body = {
    user_id: data.id,
    post_id: post_id,
  };
  const options = await getFetchOptions(body);
  const [_response, err] = await handleFetch("/toggleLike", options);
  return _response.likes_count;
};

//make a function given an array of objs, add all the objs to to the page
const addCommentsToPost = async (post_id, postComments, commentsSection) => {
  // console.log(commentsSection);
  ////commentsSection.append(comment)
};

const main = async () => {
  const user = await fetchLoggedInUser();
  if (!user) return redirectToLogin();
  setNav(!!user);

  const [posts, _err] = await handleFetch("/list", {
    method: "GET",
  });

  // const [comments , _err] = await handleFetch("/posts/:post_id/comments", { method: "GET" })
  const allComments = [
    {
      post_id: 1,
      user_id: 2,
      content: "from user 2 on post 1",
    },
    {
      post_id: 2,
      user_id: 1,
      content: "from user 1 on post 2",
    },
    {
      post_id: 2,
      user_id: 2,
      content: "from user 2 on post 2",
    },
  ];

  posts.forEach(post => addPostToPage(post.post_id));

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
  commentsSection.forEach(section => {
    const post_id = section.getAttribute("data-post-id");
    const postComments = allComments.filter(obj => obj.post_id == post_id);
    console.log(section, post_id, postComments);
    if (postComments.length > 0) {
      addCommentsToPost(post_id, postComments, section);
    }
  });
};

main();
