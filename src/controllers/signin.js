import jwt from "jsonwebtoken";

const signToken = (email) => {
  const jwtPayload = { email };
  return jwt.sign(jwtPayload, process.env.JWTSECRET, { expiresIn: "2 days" });
};
const createSessions = (user) => {
  const { email, id } = user;
  const token = signToken(email);
  return { success: "true", userId: id, token };
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

const getAuthTokenId = () => {
  console.log("auth ok");
};

const signinAuthentication = (req, res, db, bcrypt) => {
  const { authorization } = req.headers;
  return authorization
    ? getAuthTokenId()
    : handleSignin(req, res, db, bcrypt)
        .then((data) => {
          return data.id && data.email
            ? createSessions(data)
            : Promise.reject(data);
        })
        .then((session) => res.json(session))
        .catch((err) => res.status(400).json("unable to get user"));
};

export default signinAuthentication;
