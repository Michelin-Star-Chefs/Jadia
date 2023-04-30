/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = knex => {
  return knex.schema.createTable("likes", table => {
    table.increments("like_id").primary();
    table.integer("post_id").unsigned().references("post_id").inTable("posts");
    table.integer("user_id").unsigned().references("id").inTable("users");
    table.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = knex => {
  return knex.schema.dropTableIfExists("likes");
};
