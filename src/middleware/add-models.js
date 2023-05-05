const User = require("../db/models/user");
const Post = require("../db/models/post");
const Comment = require("../db/models/comment");

const addModels = (req, res, next) => {
  req.db = {
    User,
    Post,
    Comment,
  };
  next();
};

module.exports = addModels;
