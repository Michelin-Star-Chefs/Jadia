const Comment = require('../../db/models/comment');
const knex = require('../../db/knex');

const createComment = async (req, res) => {
  const { postId, userId, content } = req.body;

  if (!postId || !userId || !content) {
    return res.status(400).json({ error: "Missing required fields" });
  }

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
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  createComment
};
