const listFromPost = async (req, res) => {
  const {
    db: { Comment },
    params: { post_id },
  } = req;
  const comments = await Comment.listFromPost(post_id);
  res.send(comments);
};

module.exports = {
  listFromPost
}
