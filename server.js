import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import bcrypt from 'bcrypt';
import knex from 'knex';

const db = knex({
  client: 'pg',
  connection: {
    host: '127.0.0.1',
    port: 5432,
    user: 'postgres',
    password: 'admin',
    database: 'find-face',
  },
});

db.select('*')
  .from('users')
  .then((data) => {
    console.log(data);
  });

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

  db('users')
    .returning('*')
    .insert({
      name: name,
      email: email,
      joined: new Date(),
    })
    .then((user) => res.json(user[0]))
    .catch(() => res.status(400).json('unable to register'));
});

app.get('/profile/:id', (req, res) => {
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
});

app.put('/image', (req, res) => {
  const { id } = req.body;

  db('users')
    .where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then((entriesArray) => res.json(entriesArray[0].entries))
    .catch(() => res.status(400).json('unable to get tries count'));
});

app.listen(3001, () => {
  console.log('app is running on port 3001');
});
