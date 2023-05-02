const express = require("express");
const userController = require("./controllers/user");
const postController = require("./controllers/post");
const likesController = require("./controllers/like");
const commentsController = require("./controllers/comment");
const addModels = require("./middleware/add-models");
const checkAuthentication = require("./middleware/check-authentication");

const Router = express.Router();
Router.use(addModels);

// AUTHENTICATION + AUTHORIZATION CRUD
Router.get("/cookieCounter", (req, res) => {
  const { session } = req;
  console.log(session);
  session.viewCount = (session.viewCount || 0) + 1;
  console.log(session.viewCount);
  res.status(200).send({ count: session.viewCount });
});

// Create
Router.post("/users", userController.create);
Router.post("/users/login", userController.login);

// Read
Router.get("/users", userController.list);
Router.get("/users/:id", userController.show);
Router.get("/me", userController.showMe);
// checkAuthentication middleware is applied to only to this route (and /logged-in-secret)
Router.get("/logged-in-secret", checkAuthentication, (req, res) => {
  res.send({ msg: "The secret is: there is no secret." });
});

// Update
Router.patch("/users/:id", checkAuthentication, userController.update);

// Delete
Router.delete("/users/logout", userController.logout);

// POSTS CRUD
//Create - remember, thiis is @ /api/...
Router.post("/created", postController.create);
//Read
Router.get("/list", postController.listAll);
Router.get("/list/:id", postController.listFromUser);
//Update
//Delete
Router.delete("/delete/:id", postController.deletePost);

// LIKED CRUD
// Liking/unliking a post
Router.post("/toggleLike", likesController.toggleLike);

//COMMENTS CRUD
//create
Router.post("/posts/:postId/comments", commentsController.createComment);
//delete
Router.delete(
  "/posts/:postId/comments/:commentId",
  commentsController.deleteComment
);

module.exports = Router;
