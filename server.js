import express from 'express';
import bodyParser from 'body-parser';

const app = express();
app.use(bodyParser.json());

const database = {
  users: [
    {
      id: '0001',
      name: 'John',
      email: 'john@gmail.com',
      password: 'word0fPath',
      entries: 0,
      joined: new Date(),
    },
    {
      id: '0002',
      name: 'Gordon',
      email: 'gordon@gmail.com',
      password: 'at@We1n',
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
    id: '0004',
    name: name,
    email: email,
    password: password,
    entries: 0,
    joined: new Date(),
  });
  res.json(database.users);
});

app.listen(3000, () => {
  console.log('app is running on port 3000');
});
