const express = require('express');
const router = express.Router();
const {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  checkAvailability,
  updateAvailability,
} = require('../controllers/event.controller');
const { upload, handleUploadError } = require('../middleware/upload.middleware');

router.get('/', getEvents);
router.get('/:id', getEventById);
router.post('/', upload.single('image'), handleUploadError, createEvent);
router.put('/:id', upload.single('image'), handleUploadError, updateEvent);
router.delete('/:id', deleteEvent);
router.get('/:id/availability', checkAvailability);
router.put('/:id/availability', updateAvailability);

module.exports = router;

