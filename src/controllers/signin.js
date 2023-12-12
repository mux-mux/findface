const handleSignin = (req, res, db, bcrypt) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json('incorrect form data');
  }

  db.select('email', 'hash')
    .from('login')
    .where('email', '=', email)
    .then((loginData) => {
      const isValid = bcrypt.compareSync(password, loginData[0].hash);
      if (isValid) {
        return db
          .select('*')
          .from('users')
          .where('email', '=', email)
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
