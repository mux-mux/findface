import { redisClient } from './signin.js';

const requireAuth = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || authorization === 'null') {
    return res.status(401).json('Unauthorized');
  }

  await redisClient.get(authorization);
  return next();
};
export default requireAuth;
