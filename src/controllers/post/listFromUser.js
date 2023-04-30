const listFromUser = async (req, res) => {
  const {
    db: { Post },
    params: { id },
  } = req;
  const posts = await Post.listFromUser(id);
  res.send(posts);
};

module.exports = listFromUser;
