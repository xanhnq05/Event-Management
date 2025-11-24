const multer = require('multer');
const path = require('path');
const fs = require('fs');
const logger = require('../../../shared/utils/logger');

// Ensure uploads directory exists (at root level, same as backend)
const uploadsDir = path.join(__dirname, '../../../uploads/event');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  logger.info(`Created uploads directory: ${uploadsDir}`);
} else {
  logger.info(`Uploads directory exists: ${uploadsDir}`);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    logger.info(`📁 Saving file to: ${uploadsDir}`);
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const filename = `event-${uniqueSuffix}${ext}`;
    logger.info(`📝 Generated filename: ${filename}`);
    cb(null, filename);
  },
});

const fileFilter = (req, file, cb) => {
  logger.info('🔍 File filter check:', {
    fieldname: file.fieldname,
    originalname: file.originalname,
    mimetype: file.mimetype
  });
  
  // Accept only images
  if (file.mimetype.startsWith('image/')) {
    logger.info('✅ File accepted:', file.originalname);
    cb(null, true);
  } else {
    logger.error('❌ File rejected - not an image:', file.mimetype);
    cb(new Error('Only image files are allowed'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
});

// Error handling middleware
const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      logger.error('❌ File too large:', err.message);
      return res.status(400).json({ success: false, message: 'File size exceeds 10MB limit' });
    }
    logger.error('❌ Multer error:', err);
    return res.status(400).json({ success: false, message: err.message });
  }
  if (err) {
    logger.error('❌ Upload error:', err);
    return res.status(400).json({ success: false, message: err.message || 'File upload failed' });
  }
  next();
};

module.exports = { upload, handleUploadError };

