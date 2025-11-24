require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');
const logger = require('../../shared/utils/logger');
const { errorHandler } = require('../../shared/utils/errors');

const app = express();
const PORT = process.env.PORT || 8000;

// CORS configuration - cho phép tất cả origins khi dev
app.use(cors({
  origin: true, // Cho phép tất cả origins
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Parse JSON and URL-encoded bodies, but skip for multipart/form-data (file uploads)
app.use((req, res, next) => {
  const contentType = req.headers['content-type'] || '';
  // Skip body parsing for multipart/form-data (file uploads)
  if (contentType.includes('multipart/form-data')) {
    return next();
  }
  express.json()(req, res, next);
});

app.use((req, res, next) => {
  const contentType = req.headers['content-type'] || '';
  // Skip body parsing for multipart/form-data (file uploads)
  if (contentType.includes('multipart/form-data')) {
    return next();
  }
  express.urlencoded({ extended: true })(req, res, next);
});

// Serve static files from uploads directory (at root level)
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, '../../../uploads')));

// Helper function to get service URL
// Tự động detect môi trường: local (localhost) vs Docker (service name)
const getServiceUrl = (envVar, serviceName, defaultPort) => {
  if (process.env[envVar]) {
    logger.info(`[API Gateway] Using ${envVar}: ${process.env[envVar]}`);
    return process.env[envVar];
  }
  
  // Kiểm tra xem có đang chạy trong Docker không
  const isDocker = process.env.DOCKER_ENV === 'true' || process.env.COMPOSE_PROJECT_NAME;
  
  let url;
  if (isDocker) {
    // Trong Docker, dùng hostname service
    url = `http://${serviceName}:${defaultPort}`;
    logger.info(`[API Gateway] Docker mode: ${serviceName} -> ${url}`);
  } else {
    // Chạy local, dùng localhost
    url = `http://localhost:${defaultPort}`;
    logger.info(`[API Gateway] Local mode: ${serviceName} -> ${url}`);
  }
  
  return url;
};

// Helper forward body for proxied requests (chỉ cho JSON requests)
const forwardRequestBody = (proxyReq, req) => {
  const contentType = req.headers['content-type'] || '';
  
  // Skip body forwarding for multipart/form-data - let http-proxy-middleware handle it
  if (contentType.includes('multipart/form-data')) {
    logger.info('[API Gateway] Multipart request detected, forwarding raw stream');
    return;
  }
  
  // Only forward body for JSON requests
  if (!req.body || !Object.keys(req.body).length || req.method === 'GET') {
    return;
  }

  const bodyData = JSON.stringify(req.body);
  proxyReq.setHeader('Content-Type', 'application/json');
  proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
  proxyReq.write(bodyData);
};

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'api-gateway' });
});

// Proxy routes
app.use('/api/auth', createProxyMiddleware({
  target: getServiceUrl('AUTH_SERVICE_URL', 'auth-service', 3001),
  changeOrigin: true,
  pathRewrite: { '^/api/auth': '/auth' },
  timeout: 30000, // 30 seconds timeout
  proxyTimeout: 30000,
  onProxyReq: (proxyReq, req, res) => {
    logger.info(`[API Gateway] Proxying ${req.method} ${req.url} to auth-service`);
    logger.info(`[API Gateway] Request body: ${JSON.stringify(req.body)}`);
    logger.info(`[API Gateway] Target URL: ${getServiceUrl('AUTH_SERVICE_URL', 'auth-service', 3001)}`);
    forwardRequestBody(proxyReq, req);
  },
  onProxyRes: (proxyRes, req, res) => {
    logger.info(`[API Gateway] Response from auth-service: ${proxyRes.statusCode}`);
  },
  onError: (err, req, res) => {
    logger.error(`[API Gateway] Proxy error: ${err.message}`);
    logger.error(`[API Gateway] Error stack: ${err.stack}`);
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        message: 'Không thể kết nối đến auth-service. Vui lòng kiểm tra service có đang chạy không.',
        error: err.message
      });
    }
  },
}));

app.use('/api/users', createProxyMiddleware({
  target: getServiceUrl('USER_SERVICE_URL', 'user-service', 3002),
  changeOrigin: true,
  pathRewrite: { '^/api/users': '/users' },
  onProxyReq: forwardRequestBody,
}));

app.use('/api/events', createProxyMiddleware({
  target: getServiceUrl('EVENT_SERVICE_URL', 'event-service', 3003),
  changeOrigin: true,
  pathRewrite: { '^/api/events': '/events' },
  onProxyReq: forwardRequestBody,
}));

app.use('/api/categories', createProxyMiddleware({
  target: getServiceUrl('EVENT_SERVICE_URL', 'event-service', 3003),
  changeOrigin: true,
  pathRewrite: { '^/api/categories': '/categories' },
  onProxyReq: forwardRequestBody,
}));

app.use('/api/artists', createProxyMiddleware({
  target: getServiceUrl('EVENT_SERVICE_URL', 'event-service', 3003),
  changeOrigin: true,
  pathRewrite: { '^/api/artists': '/artists' },
  onProxyReq: forwardRequestBody,
}));

app.use('/api/payments', createProxyMiddleware({
  target: getServiceUrl('PAYMENT_SERVICE_URL', 'payment-service', 3004),
  changeOrigin: true,
  pathRewrite: { '^/api/payments': '/payments' },
  onProxyReq: forwardRequestBody,
}));

app.use('/api/notifications', createProxyMiddleware({
  target: getServiceUrl('NOTIFICATION_SERVICE_URL', 'notification-service', 3005),
  changeOrigin: true,
  pathRewrite: { '^/api/notifications': '/notifications' },
  onProxyReq: forwardRequestBody,
}));

app.use('/api/otp', createProxyMiddleware({
  target: getServiceUrl('OTP_SERVICE_URL', 'otp-service', 3006),
  changeOrigin: true,
  pathRewrite: { '^/api/otp': '/otp' },
  onProxyReq: forwardRequestBody,
}));

app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`API Gateway running on port ${PORT}`);
});

module.exports = app;

