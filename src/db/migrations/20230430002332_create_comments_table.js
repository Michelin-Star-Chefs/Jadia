/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = knex => {
  return knex.schema.createTable("comments", table => {
    table.increments("comment_id").primary();
    table.integer("post_id").unsigned().references("post_id").inTable("posts");
    table.integer("user_id").unsigned().references("id").inTable("users");
    table.string("content", 250);
    table.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = knex => {
  return knex.schema.dropTableIfExists("comments");
};
