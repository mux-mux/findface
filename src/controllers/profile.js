const handleProfile = (req, res, db) => {
  const { id } = req.body;

  db.select('*')
    .from('users')
    .where({
      id: id,
    })
    .then((user) => {
      if (user.length) {
        res.json(user[0]);
      } else {
        res.status(400).json('Not found');
      }
    })
    .catch(() => res.status(400).json('DB Request error'));
};

const handleProfileUpdate = (req, res, db) => {
  const { id } = req.body;
  const { name, age, email } = req.body.formInput;

  db('users')
    .where({ id })
    .update({ name, age, email })
    .then((res) => {
      if (res) {
        res.json('success');
      } else {
        res.status(400).json('Unable to update');
      }
    })
    .catch((err) => res.status(400).json('error updating user profile'));
};

export { handleProfile, handleProfileUpdate };
