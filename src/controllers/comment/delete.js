const Comment = require("../../db/models/comment");
const knex = require("../../db/knex");

const deleteComment = async (req, res) => {
  const commentId = parseInt(req.params.commentId, 10);

  try {
    const comment = await knex("comments")
      .select("*")
      .where({ comment_id: commentId })
      .first();

    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    await knex("comments")
      .where({ comment_id: commentId })
      .del();

    return res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  deleteComment,
};
