import { createSessions } from "./signin.js";

const handleRegister = (req, res, db, bcrypt) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json("incorrect form data");
  }

  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);

  db.transaction((trx) => {
    trx
      .insert({
        email: email,
        hash: hash,
      })
      .into("login")
      .returning("email")
      .then((loginEmail) => {
        return trx("users")
          .returning("*")
          .insert({
            name: name,
            email: loginEmail[0].email,
            joined: new Date(),
          })
          .then(async (user) => {
            const data = await createSessions(user[0]);
            res.json({ user: user[0], data });
          });
      })
      .then(trx.commit)
      .catch(trx.rollback);
  }).catch(() => res.status(400).json("unable to register"));
};

export default handleRegister;
