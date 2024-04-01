const handleProfile = (req, res, db) => {
  const { id } = req.params;

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
  const { id, age, email, prevEmail, prevAge } = req.body;

  if (age !== prevAge && email === prevEmail) {
    db("users")
      .where({ id })
      .update({ age })
      .then((result) => {
        if (result) {
          res.json("update success");
        } else {
          res.status(400).json("Unable to update");
        }
      })
      .catch(() => res.status(400).json("error updating user profile"));
  } else {
    db.transaction((trx) => {
      trx("login")
        .where({ email: prevEmail })
        .update({ email })
        .returning("email")
        .then((loginEmail) => {
          return trx("users")
            .returning("*")
            .where({ id })
            .update({ email: loginEmail[0].email, age })
            .then((result) => {
              if (result) {
                res.json("update success");
              } else {
                res.status(400).json("unable to update");
              }
            });
        })
        .then(trx.commit)
        .catch(trx.rollback);
    }).catch(() => res.status(400).json("unable to update"));
  }
};

export { handleProfile, handleProfileUpdate };
