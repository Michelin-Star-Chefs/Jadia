const listPosts = async (req, res) => {
  const { Post } = req.db;
  const posts = await Post.list();
  res.send(posts);
};

module.exports = listPosts;
