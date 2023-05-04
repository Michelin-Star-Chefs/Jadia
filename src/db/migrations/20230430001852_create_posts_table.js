/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = knex => {
  return knex.schema.createTable("posts", table => {
    table.increments("post_id").primary();
    table.integer("user_id").unsigned().references("id").inTable("users");
    table.string("location", 255).notNullable();
    table.date("start_date");
    table.date("end_date");
    table.string("photo");
    table.text("description");
    table.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = knex => {
  return knex.schema.dropTableIfExists("posts");
};
