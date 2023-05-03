// const { isAuthorized } = require("../../utils/auth-utils");
const knex = require("../../db/knex");

const updatePost = async (req, res) => {
  const {
    session,
    db: { Post },
    params: { id },
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

  const newObj = { //THIS NEW OBJ WILL BE THE NEW FORM 
    location: "funtime",
    end_date: "1999-01-02",
    description: "some bullshit",
  };
  const result = await Post.updatePost(Number(id), find, newObj);
  res.sendStatus(result ? 204 : 404);
};

module.exports = updatePost;
