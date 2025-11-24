require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { errorHandler } = require('../../shared/utils/errors');
const logger = require('../../shared/utils/logger');
const paymentRoutes = require('./routes/payment.routes');

const app = express();
const PORT = process.env.PORT || 3004;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'payment-service' });
});

app.use('/payments', paymentRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`Payment Service running on port ${PORT}`);
});

module.exports = app;

