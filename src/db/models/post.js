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
      const query = "SELECT * FROM posts";
      const { rows } = await knex.raw(query);
      return rows.map(post => new Post(post));
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
      const { rows } = await knex.raw(query, [ user_id ]);
      return rows.map(post => new Post(post));
    } catch (err) {
      console.error(err);
      return null;
    }
  }
  //update
  //delete
}

module.exports = Post;
