import express from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt';
import knex from 'knex';
import morgan from 'morgan';
import 'dotenv/config';

import handleRegister from './src/controllers/register.js';
import { signinAuth } from './src/controllers/signin.js';
import { handleProfile } from './src/controllers/profile.js';
import { handleProfileUpdate } from './src/controllers/profile.js';
import handleImage from './src/controllers/image.js';
import handleAPICall from './src/controllers/apicall.js';
import requireAuth from './src/controllers/authorization.js';

const db = knex({
  client: 'pg',
  connection: { connectionString: process.env.DATABASE_URL },
});

const app = express();
app.use(express.json());
app.use(cors());
app.use(morgan('tiny'));

app.get('/', (req, resp) => resp.send('server is working'));
app.post('/signin', (req, resp) => signinAuth(req, resp, db, bcrypt));
app.post('/register', (req, resp) => handleRegister(req, resp, db, bcrypt));
app.get('/profile/:id', requireAuth, (req, resp) => handleProfile(req, resp, db));
app.post('/profile/:id', requireAuth, (req, resp) => handleProfileUpdate(req, resp, db));
app.put('/image', requireAuth, (req, resp) => handleImage(req, resp, db));
app.post('/apicall', requireAuth, (req, resp) => handleAPICall(req, resp));

app.listen(process.env.PORT || 3001, () => {
  console.log(`Server is listening on port ${process.env.PORT}`);
});
