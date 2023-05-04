const User = require("../models/user");
const Post = require("../models/post");
const Like = require("../models/like");
const Comment = require("../models/comment");

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async knex => {
  // Users
  await User.create("cool_cat", "password1");
  await User.create("l33t-guy", "password1");

  // Posts
  await Post.create(
    1,
    "New York City",
    "2023-05-01",
    "2023-05-10",
    "https://upload.wikimedia.org/wikipedia/commons/4/47/New_york_times_square-terabass.jpg",
    "Visiting the Big Apple!"
  );
  await Post.create(
    2,
    "Los Angeles",
    "2023-05-05",
    "2023-05-15",
    "https://lp-cms-production.imgix.net/2021-06/shutterstockRF_186048416.jpg?auto=format&w=1440&h=810&fit=crop&q=75",
    "Exploring Hollywood!"
  );

  // Likes
  await Like.toggleLike(1, 2);
  await Like.toggleLike(2, 1);

  // Comments
  await Comment.create(1, 2, "Have a great time in NYC!");
  await Comment.create(2, 1, "Enjoy your trip to LA!");
};
