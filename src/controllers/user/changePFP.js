const knex = require("../../db/knex");

const changePFP = async (req, res) => {
  const {
    params: { user_id },
    body: { pictureURL },
    db: { User },
  } = req;
  console.log("controller triggered, user_id + url", user_id, pictureURL);

  try {
    //find user_id in pfp table
    const userPFP = await knex.raw(
      `
      SELECT *
      FROM profile_pictures
      WHERE user_id = ?;
    `,
      [user_id]
    );
    const found = userPFP.rows[0];
    let result;
    if (found) {
      //replace the old url with picture url
      result = await User.replacePFP(user_id, pictureURL);
    } else {
      //insert the user_id + picture url
      result = await User.insertPFP(user_id, pictureURL);
    }
    res.send(result);
  } catch (err) {
    console.log(err);
    return null;
  }
};

module.exports = changePFP;
