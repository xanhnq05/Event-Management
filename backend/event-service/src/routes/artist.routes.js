const express = require('express');
const router = express.Router();
const db = require('../config/database');

router.get('/', async (req, res, next) => {
  try {
    const [rows] = await db.query('SELECT * FROM artists ORDER BY Artist_Name');
    res.json({ success: true, data: rows });
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query('SELECT * FROM artists WHERE Artist_ID = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Artist not found' });
    }
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

