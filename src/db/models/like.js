const knex = require("../knex");

class Like {
  constructor({ like_id, user_id, post_id }) {
    this.like_id = like_id;
    this.user_id = user_id;
    this.post_id = post_id;
  }

  static async toggleLike(user_id, post_id) {
    try {
      const existingLikeQuery = "SELECT * FROM likes WHERE user_id = ? AND post_id = ?";
      const { rows: [existingLike] } = await knex.raw(existingLikeQuery, [user_id, post_id]);

      if (existingLike) {
        const deleteQuery = "DELETE FROM likes WHERE user_id = ? AND post_id = ?";
        await knex.raw(deleteQuery, [user_id, post_id]);
        return { status: "unliked" };
      } else {
        const insertQuery = "INSERT INTO likes (user_id, post_id) VALUES (?, ?)";
        await knex.raw(insertQuery, [user_id, post_id]);
        return { status: "liked" };
      }
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  static async getLikesForPost(post_id) {
    try {
      const query = "SELECT * FROM likes WHERE post_id = ?";
      const { rows: likes } = await knex.raw(query, [post_id]);
      return likes.map((like) => new Like(like));
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  static async getLikedPostsByUser(user_id) {
    try {
      const query = "SELECT * FROM likes WHERE user_id = ?";
      const { rows: likes } = await knex.raw(query, [user_id]);
      return likes.map((like) => new Like(like));
    } catch (err) {
      console.error(err);
      return null;
    }
  }
}

module.exports = Like;
