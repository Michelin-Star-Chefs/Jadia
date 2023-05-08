const listPFPs = async (req, res) => {
  const {
    db: { User },
  } = req;
  const pfps = await User.listPFPs();
  res.send(pfps);
};

module.exports = listPFPs;
