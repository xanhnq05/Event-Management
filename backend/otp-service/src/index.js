require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { errorHandler } = require('../../shared/utils/errors');
const logger = require('../../shared/utils/logger');
const otpRoutes = require('./routes/otp.routes');

const app = express();
const PORT = process.env.PORT || 3006;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'otp-service' });
});

app.use('/otp', otpRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`OTP Service running on port ${PORT}`);
});

module.exports = app;

