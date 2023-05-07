const knex = require("../knex");

class Post {
  constructor(
    post_id,
    user_id,
    location,
    start_date,
    end_date,
    photo,
    description
  ) {
    this.post_id = post_id;
    this.user_id = user_id;
    this.location = location;
    this.start_date = start_date;
    this.end_date = end_date;
    this.photo = photo;
    this.description = description;
  }
  //create
  static async create(
    user_id,
    location,
    start_date,
    end_date,
    photo,
    description
  ) {
    try {
      const postInsert = await knex.raw(
        `
        INSERT INTO posts(user_id,location,start_date,end_date,photo, description)
        VALUES (?,?,?,?,?,?)
        RETURNING *;
      `,
        [user_id, location, start_date, end_date, photo, description]
      );
      const newPost = postInsert.rows[0];
      return newPost;
    } catch (err) {
      console.log(err);
      return null;
    }
  }
  //list
  static async listAll() {
    try {
      const query =
        "SELECT posts.*, username FROM posts JOIN users ON posts.user_id = users.id";
      const { rows } = await knex.raw(query);
      return rows;
      // return rows.map(post => new Post(post));
    } catch (err) {
      console.error(err);
      return null;
    }
  }
  static async listFromUser(user_id) {
    try {
      const query = `
        SELECT post_id, user_id, location, start_date, end_date, photo, description, posts.created_at, posts.updated_at
        FROM posts
        JOIN users ON users.id = posts.user_id
        WHERE users.id = ?`;
      const { rows } = await knex.raw(query, [user_id]);
      return rows.map(post => new Post(post));
    } catch (err) {
      console.error(err);
      return null;
    }
  }
  //update
  static async updatePost(post_id, currObj, newObj) {
    // the array of inputs is going to be the new obj || the old obj
    try {
      const input = {};
      for (let key in currObj) {
        if (key in newObj) {
          input[key] = newObj[key];
        } else {
          input[key] = currObj[key];
        }
      }
      // make a query that updates all the values at the post id
      const result = await knex.raw(
        `
      UPDATE posts
      SET
        location = ?,
        start_date = ?,
        end_date = ?,
        photo = ?,
        description = ?
      WHERE post_id = ?
      RETURNING *;
    `,
        [
          input.location,
          input.start_date,
          input.end_date,
          input.photo,
          input.description,
          post_id,
        ]
      );
      console.log(result.rows[0]);
      return result ? result.rows[0] : null;
    } catch (err) {
      console.log(err);
      return null;
    }
  }
  //delete
  static async deletePost(post_id) {
    try {
      await knex.raw(
        `
      DELETE
      FROM likes
      WHERE post_id = ?;
      `,
        [post_id]
      );
      await knex.raw(
        `
      DELETE
      FROM comments
      WHERE post_id = ?;
      `,
        [post_id]
      );
      const result = await knex.raw(
        `DELETE FROM posts WHERE post_id = ? RETURNING *;`,
        [post_id]
      );
      return result.rowCount;
    } catch (err) {
      console.log(err);
      return null;
    }
  }
}

module.exports = Post;
