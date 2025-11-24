const { createConnection } = require('../../../shared/utils/db');
const logger = require('../../../shared/utils/logger');

const db = createConnection({
  DB_HOST: process.env.DB_HOST,
  DB_PORT: process.env.DB_PORT,
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_NAME: process.env.DB_NAME,
});

db.getConnection()
  .then((connection) => {
    logger.info('Database connected successfully');
    connection.release();
  })
  .catch((err) => {
    logger.error('Database connection error:', err);
  });

module.exports = db;

