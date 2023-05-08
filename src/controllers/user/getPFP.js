const getPFP = async (req, res) => {
  const {
    db: { User },
    params: { id },
  } = req;
  const pfp = await User.getPFP(id);
  res.send(pfp);
};

module.exports = getPFP;
