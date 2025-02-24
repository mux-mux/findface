import jwt from 'jsonwebtoken';
import { createClient } from 'redis';
import { validateEmail } from '../utils/validation.js';

const ERRORS = {
  INVALID_CREDENTIALS:
    'The credentials you entered are incorrect. Please double-check and try again.',
  INVALID_FORMAT:
    'The format of credentials you entered is incorrect. Please review and ensure it matches the required format.',
  USER_FETCH_ERROR:
    'We are unable to retrieve the user information at the moment. Please try again later.',
  AUTH_ISSUE:
    'There seems to be an authorization issue. Please try again later.',
};

const redisClient = await createClient({ url: process.env.REDIS_URL })
  .on('error', (err) => console.log('Redis Client Error', err))
  .connect();

const signToken = (email) => {
  const jwtPayload = { email };
  return jwt.sign(jwtPayload, process.env.JWTSECRET, { expiresIn: '2 days' });
};
const setToken = (key, value) => {
  return Promise.resolve(redisClient.set(key, value));
};

const getToken = async (req, res) => {
  const { authorization } = req.headers;
  const reply = await redisClient.get(authorization);
  res.json({ id: reply });
  return reply;
};

const createSessions = async (user) => {
  const { email, id } = user;
  const token = signToken(email);
  return await setToken(token, id)
    .then(() => {
      return { success: 'true', userId: id, token };
    })
    .catch(console.log('Create session error'));
};

const handleSignin = (req, res, db, bcrypt) => {
  const { email, password } = req.body;

  if (!validateEmail(email) || !password) {
    return Promise.reject(ERRORS.INVALID_FORMAT);
  }

  return db
    .select('email', 'hash')
    .from('login')
    .where('email', '=', email)
    .then((loginData) => {
      const isValid = bcrypt.compareSync(password, loginData[0].hash);
      if (isValid) {
        return db
          .select('*')
          .from('users')
          .where('email', '=', email)
          .then((user) => user[0])
          .catch(() => Promise.reject(ERRORS.USER_FETCH_ERROR));
      } else {
        throw new Error();
      }
    })
    .catch(() => Promise.reject(ERRORS.INVALID_CREDENTIALS));
};

const signinAuth = (req, res, db, bcrypt) => {
  const { authorization } = req.headers;
  return authorization
    ? getToken(req, res)
    : handleSignin(req, res, db, bcrypt)
        .then((data) => {
          return data.id && data.email
            ? createSessions(data)
            : Promise.reject(ERRORS.AUTH_ISSUE);
        })
        .then((session) => res.json(session))
        .catch((error) => res.status(400).json(error));
};

export { redisClient, createSessions, signinAuth };
