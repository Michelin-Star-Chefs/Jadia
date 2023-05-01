const Comment = require("../../db/models/comment");
const knex = require("../../db/knex");

const deleteComment = async (req, res) => {
  const commentId = parseInt(req.params.commentId, 10);

  try {
    const comment = await Comment.findByPk(commentId);

    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    await comment.destroy();

    return res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  deleteComment,
};
