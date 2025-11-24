require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { errorHandler } = require('../../shared/utils/errors');
const logger = require('../../shared/utils/logger');
const notificationRoutes = require('./routes/notification.routes');
const { initRabbitMQ } = require('./config/rabbitmq');

const app = express();
const PORT = process.env.PORT || 3005;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'notification-service' });
});

app.use('/notifications', notificationRoutes);

app.use(errorHandler);

// Initialize RabbitMQ
initRabbitMQ();

app.listen(PORT, () => {
  logger.info(`Notification Service running on port ${PORT}`);
});

module.exports = app;

