import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import bcrypt from 'bcrypt';
import knex from 'knex';

import handleRegister from './src/controllers/register.js';
import handleSignin from './src/controllers/signin.js';
import handleProfile from './src/controllers/profile.js';
import handleImage from './src/controllers/image.js';

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

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.post('/signin', (req, resp) => handleSignin(req, resp, db, bcrypt));
app.post('/register', (req, resp) => handleRegister(req, resp, db, bcrypt));
app.get('/profile/:id', (req, resp) => handleProfile(req, resp, db));
app.put('/image', (req, resp) => handleImage(req, resp, db));

app.listen(3001, () => {
  console.log('app is running on port 3001');
});
