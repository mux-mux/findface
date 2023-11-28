import express from 'express';
import bodyParser from 'body-parser';

const app = express();
app.use(bodyParser.json());

const database = {
  users: [
    {
      id: 1,
      name: 'John',
      email: 'john@gmail.com',
      password: 'word0fPath',
      entries: 0,
      joined: new Date(),
    },
    {
      id: 2,
      name: 'Gordon',
      email: 'gordon@gmail.com',
      password: 'at@We1n',
      entries: 0,
      joined: new Date(),
    },
    {
      id: 3,
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
  if (
    req.body.email === database.users[0].email &&
    req.body.password === database.users[0].password
  ) {
    res.json('success');
  } else {
    res.status(400).json('error logging in');
  }
});

app.post('/register', (req, res) => {
  const { name, email, password } = req.body;
  database.users.push({
    id: database.users.length + 1,
    name: name,
    email: email,
    password: password,
    entries: 0,
    joined: new Date(),
  });
  res.json(database.users);
});

app.get('/profile/:id', (req, res) => {
  const { id } = req.params;
  let found = false;

  database.users.forEach((user) => {
    if (user.id === Number(id)) {
      found = true;
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

app.listen(3000, () => {
  console.log('app is running on port 3000');
});
