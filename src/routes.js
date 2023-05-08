const express = require("express");
const userController = require("./controllers/user");
const postController = require("./controllers/post");
const likesController = require("./controllers/like");
const commentsController = require("./controllers/comment");
const addModels = require("./middleware/add-models");
const checkAuthentication = require("./middleware/check-authentication");

const Router = express.Router();
Router.use(addModels);

// --------------
// AUTHENTICATION + AUTHORIZATION
// --------------
Router.get("/cookieCounter", (req, res) => {
  const { session } = req;
  console.log(session);
  session.viewCount = (session.viewCount || 0) + 1;
  console.log(session.viewCount);
  res.status(200).send({ count: session.viewCount });
});

// --------------
// USERS CRUD
// --------------
// Create
Router.post("/users", userController.create);
Router.post("/users/login", userController.login);
Router.post("/users/:user_id", userController.changePFP);
// Read
Router.get("/users", userController.list);
Router.get("/users/:id", userController.show);
Router.get("/me", userController.showMe);
Router.get("/logged-in-secret", checkAuthentication, (req, res) => {
  res.send({ msg: "The secret is: there is no secret." });
});

// Update
Router.patch("/users/:id", checkAuthentication, userController.update);

// Delete
Router.delete("/users/logout", userController.logout);

// --------------
// POSTS CRUD
// --------------
// Create
Router.post("/post", postController.create);

// Read
Router.get("/post/:id", postController.find);
Router.get("/list", postController.listAll);
Router.get("/list/:id", postController.listFromUser);
Router.get("/pfp/:id", postController.getPFP);

// Update
Router.patch("/update/:id", postController.updatePost);

// Delete
Router.delete("/delete/:id", postController.deletePost);

// --------------
// LIKES CRUD
// --------------
// Toggle Like
Router.post("/toggleLike", likesController.toggleLike);

// --------------
// COMMENTS CRUD
// --------------
// Create
Router.post("/posts/:post_id/comments", commentsController.createComment);

// Read
Router.get("/posts/:post_id/comments", commentsController.listFromPost);

// Delete
Router.delete("/posts/:post_id/comments/:id", commentsController.deleteComment);

module.exports = Router;
