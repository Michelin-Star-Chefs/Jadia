const Comment = require('../../db/models/comment');
const knex = require('../../db/knex');

const createComment = async (req, res) => {
  const { postId, userId, content } = req.body;

  try {
    const comment = await Comment.create({
      post_id: postId,
      user_id: userId,
      content,
      create_at: new Date(),
      update_at: new Date()
    });

    return res.status(201).json({ comment });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createComment
};
