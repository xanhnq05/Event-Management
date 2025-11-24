require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { errorHandler } = require('../../shared/utils/errors');
const logger = require('../../shared/utils/logger');
const eventRoutes = require('./routes/event.routes');
const categoryRoutes = require('./routes/category.routes');
const artistRoutes = require('./routes/artist.routes');

const app = express();
const PORT = process.env.PORT || 3003;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, '../../uploads')));

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'event-service' });
});

app.use('/events', eventRoutes);
app.use('/categories', categoryRoutes);
app.use('/artists', artistRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`Event Service running on port ${PORT}`);
});

module.exports = app;

