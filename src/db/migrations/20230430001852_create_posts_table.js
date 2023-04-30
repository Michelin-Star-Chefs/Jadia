/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = knex => {
  return knex.schema.createTable("posts", table => {
    table.increments("post_id").primary();
    table.string("location", 255).notNullable();
    table.date("start_date");
    table.date("end_date");
    table.binary("photo");
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
