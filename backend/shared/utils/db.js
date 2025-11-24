const mysql = require('mysql2/promise');

const createConnection = (config) => {
  return mysql.createPool({
    host: config.DB_HOST || 'localhost',
    port: config.DB_PORT || 3306,
    user: config.DB_USER || 'root',
    password: config.DB_PASSWORD || '',
    database: config.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    charset: 'utf8mb4',
    timezone: '+00:00',
  });
};

module.exports = { createConnection };

