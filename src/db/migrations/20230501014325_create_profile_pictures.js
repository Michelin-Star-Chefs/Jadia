/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

exports.up = async knex => {
  return knex.schema.createTable("profile_pictures", table => {
    table.integer("user_id");
    table.binary("data");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = knex => {
  return knex.schema.dropTableIfExists("profile_pictures");
};
