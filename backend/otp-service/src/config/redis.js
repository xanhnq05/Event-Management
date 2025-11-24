const { createRedisClient } = require('../../../shared/utils/redis');
const logger = require('../../../shared/utils/logger');

let redisClient = null;

const initRedis = async () => {
  try {
    redisClient = await createRedisClient({
      REDIS_HOST: process.env.REDIS_HOST,
      REDIS_PORT: process.env.REDIS_PORT,
    });
    logger.info('Redis connected successfully');
    return redisClient;
  } catch (err) {
    logger.error('Redis connection error:', err);
    return null;
  }
};

const getRedisClient = () => redisClient;

initRedis();

module.exports = { getRedisClient, initRedis };

