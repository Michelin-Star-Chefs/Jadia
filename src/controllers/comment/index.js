const { createComment } = require("./create");
const { deleteComment } = require("./delete");
const { listFromPost } = require("./listFromPost");

module.exports = {
  createComment,
  deleteComment,
  listFromPost,
};
