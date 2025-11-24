const jwt = require('jsonwebtoken');
const { UnauthorizedError } = require('../../../shared/utils/errors');
const { getRedisClient } = require('../config/redis');

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('No token provided');
    }

    const token = authHeader.substring(7);
    
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Check if token is blacklisted in Redis
      const redis = getRedisClient();
      if (redis) {
        const blacklisted = await redis.get(`blacklist:${token}`);
        if (blacklisted) {
          throw new UnauthorizedError('Token has been revoked');
        }
      }
      
      req.user = decoded;
      next();
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        throw new UnauthorizedError('Token expired');
      } else if (err.name === 'JsonWebTokenError') {
        throw new UnauthorizedError('Invalid token');
      }
      throw err;
    }
  } catch (err) {
    next(err);
  }
};

module.exports = { authenticate };

