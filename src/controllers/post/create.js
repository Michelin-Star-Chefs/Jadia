const createPost = async (req, res) => {
  const {
    db: { Post },
    body: { user_id, location, start_date, end_date, photo, description },
  } = req;
  // console.log("create.js triggered, values: ");
  // console.log(user_id, location, start_date, end_date, photo, description);
  const post = await Post.create(
    user_id,
    location,
    start_date,
    end_date,
    photo,
    description
  );
  res.send(post);
};

module.exports = createPost;
