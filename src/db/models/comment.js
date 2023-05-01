const knex = require("../knex");

class Comment {
  constructor({ comment_id, post_id, user_id, content, created_at, updated_at }) {
    if (comment_id) {
        this.comment_id = comment_id;
    }
    this.post_id = post_id;
    this.user_id = user_id;
    this.content = content;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }

  static async create({ content, user_id, post_id }) {
    try {
        const { rows } = await knex.raw(
            "INSERT INTO comments (content, user_id, post_id) VALUES (?, ?, ?) RETURNING *",
            [content, user_id, post_id]
        );

        console.log(rows);

        const [createdComment] = rows;
        return new Comment(createdComment);
    } catch (err) {
        console.error(err);
        return null;
    }
  }

  static async findByPk(comment_id) {
    try {
      const query = "SELECT * FROM comments WHERE comment_id = ?";
      const { rows: [comment] } = await knex.raw(query, [comment_id]);
      return comment ? new Comment(comment) : null;
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  async destroy() {
    try {
      const deleteQuery = "DELETE FROM comments WHERE comment_id = ?";
      await knex.raw(deleteQuery, [this.comment_id]);
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  }
}

module.exports = Comment;
