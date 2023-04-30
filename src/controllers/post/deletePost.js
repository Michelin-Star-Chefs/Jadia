const deletePost = async (req, res) => {
  const {
    db: { Post },
    params: { id },
  } = req;
  const result = await Post.deletePost(Number(id));
  res.sendStatus(result ? 204 : 404);
};

module.exports = deletePost;
