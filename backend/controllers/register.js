import { createSessions } from './signin.js';
import { validateEmail } from '../utils/validation.js';

const handleRegister = (req, res, db, bcrypt) => {
  const { name, email, password } = req.body;

  if (!name || !validateEmail(email) || !password) {
    return res
      .status(400)
      .json(
        'The credentials you entered are incorrect. Please double-check and try again.'
      );
  }

  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);

  db.transaction((trx) => {
    trx
      .insert({ email, hash })
      .into('login')
      .returning('email')
      .then((loginEmail) => {
        return trx('users')
          .returning('*')
          .insert({
            name,
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
  }).catch(() => res.status(400).json('Unable to register'));
};

export default handleRegister;
