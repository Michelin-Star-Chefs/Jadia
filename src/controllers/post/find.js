const find = async (req, res) => {
  const {
    params: { id },
    db: { Post },
  } = req;
  try {
    const post = await Post.find(id);
    if (!post) return res.sendStatus(404);
    res.send(post);
  } catch (err) {
    console.log(err);
    return null;
  }
};

module.exports = find;
