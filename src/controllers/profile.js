const handleProfile = (req, res, db) => {
  const { id } = req.body;

  db.select("*")
    .from("users")
    .where({ id })
    .then((user) => {
      if (user.length) {
        res.json(user[0]);
      } else {
        res.status(400).json("Not found");
      }
    })
    .catch(() => res.status(400).json("DB Request error"));
};

const handleProfileUpdate = (req, res, db) => {
  const { id, age, email } = req.body;

  db("users")
    .where({ id })
    .update({ age, email })
    .then((result) => {
      if (result) {
        res.json("update success");
      } else {
        res.status(400).json("Unable to update");
      }
    })
    .catch(() => res.status(400).json("error updating user profile"));
};

export { handleProfile, handleProfileUpdate };
