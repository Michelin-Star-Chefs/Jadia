const Comment = require('../../db/models/comment');
const knex = require('../../db/knex');

const createComment = async (req, res) => {
  const postId = parseInt(req.params.post_id);
  const { userId, content } = req.body;

  try {
    const comment = await Comment.create(
      postId,
      userId,
      content,
      new Date(),
      new Date()
    );

    return res.status(201).json({ comment });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createComment
};
