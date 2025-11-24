const redis = require('redis');

const createRedisClient = async (config) => {
  const client = redis.createClient({
    host: config.REDIS_HOST || 'localhost',
    port: config.REDIS_PORT || 6379,
  });

  client.on('error', (err) => {
    console.error('Redis Client Error:', err);
  });

  await client.connect();
  return client;
};

module.exports = { createRedisClient };

