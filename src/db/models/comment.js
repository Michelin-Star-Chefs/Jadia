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

  static async create({ post_id, user_id, content, create_at, update_at }) {
    try {
      const [createdComment] = await knex("comments")
        .insert({
          post_id,
          user_id,
          content,
          created_at: create_at,
          updated_at: update_at,
        })
        .returning("*");

      return new Comment(createdComment);
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  static async findByPk(comment_id) {
    try {
      const comment = await knex("comments")
        .select("*")
        .where({ comment_id })
        .first();
      return comment ? new Comment(comment) : null;
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  async destroy() {
    try {
      await knex("comments")
        .where({ comment_id: this.comment_id })
        .del();
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  }
}

module.exports = Comment;
