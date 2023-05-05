const knex = require("../knex");

class Comment {
  constructor({
    comment_id,
    post_id,
    user_id,
    content,
    created_at,
    updated_at,
  }) {
    if (comment_id) {
      this.comment_id = comment_id;
    }
    this.post_id = post_id;
    this.user_id = user_id;
    this.content = content;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }

  static async create(post_id, user_id, content, created_at, updated_at) {
    try {
      const [createdComment] = await knex("comments")
        .insert({
          post_id,
          user_id,
          content,
          created_at: created_at,
          updated_at: updated_at,
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

  static async listFromPost(post_id) {
    try {
      const query = `
        SELECT comments.comment_id, comments.post_id, comments.user_id, comments.content, comments.created_at
        FROM comments
        JOIN posts ON comments.post_id = posts.post_id
        WHERE posts.post_id = ?;`;
      const { rows } = await knex.raw(query, [post_id]);
      console.log(rows);
      return rows;
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  async destroy() {
    try {
      await knex("comments").where({ comment_id: this.comment_id }).del();
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  }
}

module.exports = Comment;
