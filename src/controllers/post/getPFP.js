const getPFP = async (req, res) => {
  const {
    db: { Post },
    params: { id },
  } = req;
  const pfp = await Post.getPFP(id);
  res.send(pfp);
};

module.exports = getPFP;
