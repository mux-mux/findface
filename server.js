import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import bcrypt from 'bcrypt';

const app = express();
app.use(bodyParser.json());
app.use(cors());

const database = {
  users: [
    {
      id: 0,
      name: 'John',
      email: 'john@gmail.com',
      password: 'word0fPath',
      entries: 0,
      joined: new Date(),
    },
    {
      id: 1,
      name: 'Gordon',
      email: 'gordon@gmail.com',
      password: 'at@We1n',
      entries: 0,
      joined: new Date(),
    },
    {
      id: 2,
      name: 'Ruby',
      email: 'ruby@gmail.com',
      password: 'RRUU88YY',
      entries: 0,
      joined: new Date(),
    },
  ],
};

app.get('/', (req, res) => {
  res.send(database.users);
});

app.post('/signin', (req, res) => {
  bcrypt.compare(
    '12@98ooo',
    '$2b$10$yLyWHgr6/Euf5ahkI/KC0.FVTOlpgJBUxdJLGsQu70zxkj7cGCJnW',
    function (err, result) {
      console.log('correct', result);
    }
  );
  bcrypt.compare(
    'ruby',
    '$2b$10$yLyWHgr6/Euf5ahkI/KC0.FVTOlpgJBUxdJLGsQu70zxkj7cGCJnW',
    function (err, result) {
      console.log('wrong', result);
    }
  );

  if (
    req.body.email === database.users[0].email &&
    req.body.password === database.users[0].password
  ) {
    res.json(database.users[0]);
  } else {
    res.status(400).json('error logging in');
  }
});

app.post('/register', (req, res) => {
  const { name, email, password } = req.body;

  bcrypt.genSalt(10, function (err, salt) {
    bcrypt.hash(password, salt, function (err, hash) {
      console.log(hash);
    });
  });

  database.users.push({
    id: database.users.length + 1,
    name: name,
    email: email,
    entries: 0,
    joined: new Date(),
  });
  res.json(database.users[database.users.length - 1]);
});

app.get('/profile/:id', (req, res) => {
  const { id } = req.body;

  let found = false;

  database.users.forEach((user) => {
    if (user.id === Number(id)) {
      found = true;
      console.log(res.json(user));
      return res.json(user);
    }
  });
  if (!found) {
    return res.status(400).json('not found');
  }
});

app.put('/image', (req, res) => {
  const { id } = req.body;
  let found = false;

  database.users.forEach((user) => {
    if (user.id === Number(id)) {
      found = true;
      user.entries++;
      return res.json(user.entries);
    }
  });
  if (!found) {
    return res.status(400).json('not found');
  }
});

app.listen(3001, () => {
  console.log('app is running on port 3001');
});
