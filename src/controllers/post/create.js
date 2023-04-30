// const { isAuthorized } = require("../../utils/auth-utils");

const createPost = async (req, res) => {
  const {
    session,
    db: { Post },
    params: { id },
    body: { user_id, location, start_date, end_date, photo, description },
  } = req;

  // if (!isAuthorized(id, session)) return res.sendStatus(403);

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
