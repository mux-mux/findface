const handleSignin = (req, res, db, bcrypt) => {
  db.select('email', 'hash')
    .from('login')
    .where('email', '=', req.body.email)
    .then((loginData) => {
      const isValid = bcrypt.compareSync(req.body.password, loginData[0].hash);
      if (isValid) {
        return db
          .select('*')
          .from('users')
          .where('email', '=', req.body.email)
          .then((user) => {
            res.json(user[0]);
          })
          .catch(() => res.status(400).json('unable to get user'));
      } else {
        res.status(400).json('wrong credentials');
      }
    })
    .catch(() => res.status(400).json('wrong credentials'));
};

export default handleSignin;
