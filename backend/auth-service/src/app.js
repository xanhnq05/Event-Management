require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { errorHandler } = require('../../shared/utils/errors');
const logger = require('../../shared/utils/logger');
const authRoutes = require('./routes/auth.routes');

const createApp = () => {
  const app = express();

  // Middleware
  app.use(cors());
  
  // Body parser với error handling cho request aborted
  app.use(express.json({ 
    limit: '10mb',
    verify: (req, res, buf) => {
      // Xử lý request aborted
      req.on('aborted', () => {
        logger.warn('Request aborted by client', {
          method: req.method,
          path: req.path,
        });
      });
    }
  }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Request logging với error handling
  app.use((req, res, next) => {
    // Xử lý request aborted
    req.on('aborted', () => {
      logger.warn('Request aborted before completion', {
        method: req.method,
        path: req.path,
        ip: req.ip,
      });
    });
    
    req.on('close', () => {
      if (!res.headersSent) {
        logger.warn('Request closed before response sent', {
          method: req.method,
          path: req.path,
        });
      }
    });
    
    logger.info(`${req.method} ${req.path}`, {
      ip: req.ip,
      userAgent: req.get('user-agent'),
    });
    next();
  });

  // Health check
  app.get('/health', (req, res) => {
    res.json({
      status: 'ok',
      service: 'auth-service',
      timestamp: new Date().toISOString(),
    });
  });

  // API Routes
  app.use('/auth', authRoutes);

  // 404 handler
  app.use((req, res) => {
    res.status(404).json({
      success: false,
      message: 'Route not found',
      code: 'NOT_FOUND',
    });
  });

  // Error handler (must be last)
  app.use(errorHandler);

  return app;
};

module.exports = createApp;

