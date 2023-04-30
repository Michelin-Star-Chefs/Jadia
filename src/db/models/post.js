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
  static async create() {
    try {
      const postInsert = await knex.raw()
      const newPost = postInsert.rows[0]
      return newPost
    } catch (err) {
      console.log(err)
      return null
    }
  }
  //list
  //update
  //delete
}
