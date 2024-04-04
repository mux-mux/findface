import jwt from "jsonwebtoken";
import { createClient } from "redis";

const redisClient = await createClient({ url: process.env.REDIS_URL })
  .on("error", (err) => console.log("Redis Client Error", err))
  .connect();

const signToken = (email) => {
  const jwtPayload = { email };
  return jwt.sign(jwtPayload, process.env.JWTSECRET, { expiresIn: "2 days" });
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
      return { success: "true", userId: id, token };
    })
    .catch(console.log);
};


const handleSignin = (req, res, db, bcrypt) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return Promise.reject("incorrect form data");
  }

  return db
    .select("email", "hash")
    .from("login")
    .where("email", "=", email)
    .then((loginData) => {
      const isValid = bcrypt.compareSync(password, loginData[0].hash);
      if (isValid) {
        return db
          .select("*")
          .from("users")
          .where("email", "=", email)
          .then((user) => user[0])
          .catch(() => Promise.reject("unable to get user"));
      } else {
        Promise.reject("wrong credentials");
      }
    })
    .catch(() => Promise.reject("wrong credentials"));
};


const signinAuth = (req, res, db, bcrypt) => {
  const { authorization } = req.headers;
  return authorization
    ? getToken(req, res)
    : handleSignin(req, res, db, bcrypt)
        .then((data) => {
          return data.id && data.email
            ? createSessions(data)
            : Promise.reject(data);
        })
        .then((session) => res.json(session))
        .catch((err) => res.status(400).json("unable to get user"));
};

export { redisClient, createSessions, signinAuth };
