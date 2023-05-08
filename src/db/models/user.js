const knex = require("../knex");
const { hashPassword, isValidPassword } = require("../../utils/auth-utils");

class User {
  #passwordHash = null;

  constructor({ id, username, password_hash }) {
    this.id = id;
    this.username = username;
    this.#passwordHash = password_hash;
  }

  static async list() {
    try {
      const query = "SELECT * FROM users";
      const { rows } = await knex.raw(query);
      return rows.map(user => new User(user));
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  static async find(id) {
    try {
      const query = "SELECT * FROM users WHERE id = ?";
      const {
        rows: [user],
      } = await knex.raw(query, [id]);
      return user ? new User(user) : null;
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  static async findByUsername(username) {
    try {
      const query = "SELECT * FROM users WHERE username = ?";
      const {
        rows: [user],
      } = await knex.raw(query, [username]);
      return user ? new User(user) : null;
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  static async create(username, password) {
    try {
      const passwordHash = await hashPassword(password);
      const query = `INSERT INTO users (username, password_hash)
        VALUES (?, ?) RETURNING *`;
      const {
        rows: [user],
      } = await knex.raw(query, [username, passwordHash]);
      return new User(user);
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  static async deleteAll() {
    try {
      return knex.raw("TRUNCATE users;");
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  static async getPFP(user_id) {
    try {
      const result = await knex.raw(
        `
        SELECT *
        FROM profile_pictures
        WHERE user_id = ?;
      `,
        [user_id]
      );
      return result.rows[0];
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  static async listPFPs() {
    try {
      const result = await knex.raw(
        `
        SELECT *
        FROM profile_pictures
      `
      );
      return result.rows;
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  static async insertPFP(user_id, url) {
    try {
      const insertion = await knex.raw(
        `
      INSERT INTO profile_pictures (user_id, image_url)
      VALUES (?,?)
      RETURNING *;
      `,
        [user_id, url]
      );
      return insertion.rows[0];
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  static async replacePFP(user_id, url) {
    try {
      const replacement = await knex.raw(
        `
          UPDATE profile_pictures
          SET image_url = ?
          WHERE user_id = ?
          RETURNING *;
      `,
        [url, user_id]
      );
      return replacement.rows[0];
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  update = async username => {
    // dynamic queries are easier if you add more properties
    try {
      const [updatedUser] = await knex("users")
        .where({ id: this.id })
        .update({ username })
        .returning("*");
      return updatedUser ? new User(updatedUser) : null;
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  isValidPassword = async password =>
    isValidPassword(password, this.#passwordHash);
}

module.exports = User;
