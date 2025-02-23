import express from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt';
import knex from 'knex';
import morgan from 'morgan';
import multer from 'multer';
import AWS from 'aws-sdk';
import multerS3 from 'multer-s3';
import path from 'path';
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

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.S3_BUCKET_NAME,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: (req, file, cb) => {
      const fileExtension = path.extname(file.originalname);
      const uniqueFilename =
        Date.now() + '-' + Math.random().toString(36).substring(2, 9);
      cb(null, `${uniqueFilename}${fileExtension}`);
    },
  }),
});

const app = express();
app.use(express.json());
app.use(cors());
app.use(limiter);
app.use(morgan('tiny'));

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
