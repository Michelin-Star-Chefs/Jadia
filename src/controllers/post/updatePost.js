// const { isAuthorized } = require("../../utils/auth-utils");
const knex = require("../../db/knex");

const updatePost = async (req, res) => {
  const {
    session,
    db: { Post },
    params: { id },
    body,
  } = req;

  // if (!isAuthorized(id, session)) return res.sendStatus(403);

  const post = await knex.raw(
    `
    SELECT *
    FROM posts
    WHERE post_id = ?;
  `,
    [id]
  );

  const find = post.rows[0];
  if (!find) return res.sendStatus(404);
  const updatedValues = Object.entries(body).reduce((acc, [key, value]) => {
    if (value !== "") {
      acc[key] = value;
    }
    return acc;
  }, {});
  console.log("find", find, "updated", updatedValues);
  const result = await Post.updatePost(Number(id), find, updatedValues);
  res.sendStatus(result ? 204 : 404);
};

module.exports = updatePost;
