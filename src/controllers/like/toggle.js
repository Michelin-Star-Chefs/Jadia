const knex = require('../../db/knex');
const Like = require("../../db/models/like");

const toggleLike = async (req, res) => {
  console.log('Toggle like request received');
  console.log('Request body:', req.body);

  const { user_id, post_id } = req.body;

  try {
    const post = await knex('posts').where({ post_id }).first();

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const liked = await knex('likes')
      .where({ user_id, post_id })
      .first();

    if (liked) {
      await knex('likes')
        .where({ user_id, post_id })
        .del();
      post.likes_count--;
    } else {
      await knex('likes')
        .insert({ user_id, post_id });
      post.likes_count++;
    }

    await knex('posts')
      .where({ post_id })
      .update({ likes_count: post.likes_count });

    return res.status(200).json({ likes_count: post.likes_count });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};


module.exports = {
  toggleLike,
};
