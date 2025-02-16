import express from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt';
import knex from 'knex';
import morgan from 'morgan';
import multer from 'multer';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import { rateLimit } from 'express-rate-limit';
import 'dotenv/config';

import handleRegister from './controllers/register.js';
import { signinAuth } from './controllers/signin.js';
import { handleProfile } from './controllers/profile.js';
import { handleProfileUpdate } from './controllers/profile.js';
import handleImage from './controllers/image.js';
import handleUpload from './controllers/upload.js';
import handleAPICall from './controllers/apicall.js';
import requireAuth from './controllers/authorization.js';

const db = knex({
  client: 'pg',
  connection: { connectionString: process.env.DATABASE_URL },
});

const limiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  limit: 100,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
});

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    const fileExtension = path.extname(file.originalname);
    const uniqueFilename =
      Date.now() + '-' + Math.random().toString(36).substring(2, 9);
    cb(null, `${uniqueFilename}${fileExtension}`);
  },
});

const upload = multer({ storage });
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(express.json());
app.use(cors());
app.use(limiter);
app.use(morgan('tiny'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/', (req, resp) => resp.send('server is working'));
app.post('/signin', (req, resp) => signinAuth(req, resp, db, bcrypt));
app.post('/register', (req, resp) => handleRegister(req, resp, db, bcrypt));
app.post('/upload', upload.single('image'), (req, resp) =>
  handleUpload(req, resp)
);
app.get('/profile/:id', requireAuth, (req, resp) =>
  handleProfile(req, resp, db)
);
app.post('/profile/:id', requireAuth, (req, resp) =>
  handleProfileUpdate(req, resp, db)
);
app.put('/image', requireAuth, (req, resp) => handleImage(req, resp, db));
app.post('/apicall', requireAuth, (req, resp) => handleAPICall(req, resp));

app.listen(process.env.PORT || 3001, () => {
  console.log(`Server is listening on port ${process.env.PORT}`);
});
