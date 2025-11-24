const express = require('express');
const router = express.Router();
const db = require('../config/database');

router.get('/user/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query(
      'SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC',
      [id]
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    next(err);
  }
});

router.put('/:id/read', async (req, res, next) => {
  try {
    const { id } = req.params;
    await db.query('UPDATE notifications SET status = ?, read_at = NOW() WHERE notification_id = ?', ['read', id]);
    res.json({ success: true, message: 'Notification marked as read' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

