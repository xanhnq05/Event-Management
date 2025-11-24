const { v4: uuidv4 } = require('uuid');
const db = require('../config/database');
const { getRedisClient } = require('../config/redis');
const { ValidationError, NotFoundError } = require('../../../shared/utils/errors');
const logger = require('../../../shared/utils/logger');

const generateEventId = async () => {
  const [rows] = await db.query('SELECT Event_ID FROM events ORDER BY Event_ID DESC LIMIT 1');
  if (rows.length === 0) return 'SK01';
  const lastId = rows[0].Event_ID;
  const num = parseInt(lastId.substring(2)) + 1;
  return `SK${num.toString().padStart(2, '0')}`;
};

const getEvents = async (req, res, next) => {
  try {
    const { search, category, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT e.*, c.Category_Name,
      GROUP_CONCAT(DISTINCT a.Artist_ID, ':', a.Artist_Name SEPARATOR '|') as Artists
      FROM events e
      LEFT JOIN categories c ON e.Category_ID = c.Category_ID
      LEFT JOIN event_artists ea ON e.Event_ID = ea.Event_ID
      LEFT JOIN artists a ON ea.Artist_ID = a.Artist_ID
      WHERE e.Status = 'active'
    `;
    const params = [];

    if (search) {
      query += ' AND (e.Event_Name LIKE ? OR e.Description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    if (category) {
      query += ' AND e.Category_ID = ?';
      params.push(category);
    }

    query += ' GROUP BY e.Event_ID ORDER BY e.Start_DateTime DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const [rows] = await db.query(query, params);

    // Format artists
    const events = rows.map(event => {
      if (event.Artists) {
        event.Artists = event.Artists.split('|').map(a => {
          const [id, name] = a.split(':');
          return { Artist_ID: id, Artist_Name: name };
        });
      } else {
        event.Artists = [];
      }
      return event;
    });

    res.json({ success: true, data: events });
  } catch (err) {
    next(err);
  }
};

const getEventById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    logger.info(`🔍 getEventById called with id: ${id} (type: ${typeof id})`);

    const [rows] = await db.query(
      `SELECT e.*, c.Category_Name,
       GROUP_CONCAT(DISTINCT a.Artist_ID, ':', a.Artist_Name SEPARATOR '|') as Artists
       FROM events e
       LEFT JOIN categories c ON e.Category_ID = c.Category_ID
       LEFT JOIN event_artists ea ON e.Event_ID = ea.Event_ID
       LEFT JOIN artists a ON ea.Artist_ID = a.Artist_ID
       WHERE e.Event_ID = ?
       GROUP BY e.Event_ID`,
      [id]
    );

    logger.info(`📊 Query returned ${rows.length} row(s) for Event_ID: ${id}`);
    
    if (rows.length === 0) {
      // Try to find similar events for debugging
      const [allEvents] = await db.query('SELECT Event_ID, Event_Name FROM events ORDER BY Event_ID DESC LIMIT 5');
      logger.info('📋 Recent events in database:', allEvents);
      throw new NotFoundError('Event');
    }

    const event = rows[0];
    if (event.Artists) {
      event.Artists = event.Artists.split('|').map(a => {
        const [id, name] = a.split(':');
        return { Artist_ID: id, Artist_Name: name };
      });
    } else {
      event.Artists = [];
    }

    res.json({ success: true, data: event });
  } catch (err) {
    next(err);
  }
};

const createEvent = async (req, res, next) => {
  try {
    let { Event_Name, Description, Start_DateTime, End_DateTime, Price_Ticket, Quantity, Address, Category_ID, User_ID, artist_ids } = req.body;

    // Parse numeric values from FormData (all FormData values are strings)
    if (Price_Ticket !== undefined && Price_Ticket !== null) {
      Price_Ticket = parseFloat(Price_Ticket);
      if (isNaN(Price_Ticket)) {
        throw new ValidationError('Price_Ticket must be a valid number');
      }
    }
    if (Quantity !== undefined && Quantity !== null) {
      Quantity = parseInt(Quantity, 10);
      if (isNaN(Quantity)) {
        throw new ValidationError('Quantity must be a valid integer');
      }
    }

    if (!Event_Name || !Start_DateTime || !End_DateTime || !Price_Ticket || !Quantity || !Address || !Category_ID || !User_ID) {
      throw new ValidationError('Missing required fields');
    }

    const Event_ID = await generateEventId();

    // Handle image upload if provided
    let imageUrl = null;
    if (req.file) {
      imageUrl = `/uploads/event/${req.file.filename}`;
    }

    await db.query(
      `INSERT INTO events (Event_ID, Event_Name, Description, Start_DateTime, End_DateTime, Price_Ticket, Quantity, Available_Quantity, Address, Category_ID, User_ID, Image_URL)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [Event_ID, Event_Name, Description, Start_DateTime, End_DateTime, Price_Ticket, Quantity, Quantity, Address, Category_ID, User_ID, imageUrl]
    );

    // Add artists if provided
    if (artist_ids && Array.isArray(artist_ids)) {
      for (const artistId of artist_ids) {
        await db.query('INSERT INTO event_artists (Event_ID, Artist_ID) VALUES (?, ?)', [Event_ID, artistId]);
      }
    }

    const [rows] = await db.query('SELECT * FROM events WHERE Event_ID = ?', [Event_ID]);

    res.status(201).json({ success: true, data: rows[0] });
  } catch (err) {
    next(err);
  }
};

const updateEvent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const path = require('path');
    const fs = require('fs');

    logger.info('📥 Update event request:', {
      eventId: id,
      hasFile: !!req.file,
      bodyKeys: Object.keys(updates),
      bodyValues: updates,
      fileInfo: req.file ? {
        fieldname: req.file.fieldname,
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size
      } : null
    });

    // Parse numeric values from FormData (all FormData values are strings)
    if (updates.Price_Ticket !== undefined && updates.Price_Ticket !== null) {
      updates.Price_Ticket = parseFloat(updates.Price_Ticket);
      if (isNaN(updates.Price_Ticket)) {
        throw new ValidationError('Price_Ticket must be a valid number');
      }
    }
    if (updates.Quantity !== undefined && updates.Quantity !== null) {
      updates.Quantity = parseInt(updates.Quantity, 10);
      if (isNaN(updates.Quantity)) {
        throw new ValidationError('Quantity must be a valid integer');
      }
    }

    const [existing] = await db.query('SELECT * FROM events WHERE Event_ID = ?', [id]);
    if (existing.length === 0) {
      throw new NotFoundError('Event');
    }

    // Handle image upload if provided
    if (req.file) {
      logger.info('📤 Image file received:', {
        filename: req.file.filename,
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        path: req.file.path,
        destination: req.file.destination
      });
      
      // Verify file was saved - multer saves to req.file.path
      const filePath = req.file.path;
      if (!filePath) {
        logger.error('❌ File path is missing in req.file');
        logger.error('File object keys:', Object.keys(req.file));
        throw new ValidationError('File path is missing after upload');
      }
      
      if (!fs.existsSync(filePath)) {
        logger.error('❌ Uploaded file does not exist at path:', filePath);
        logger.error('File destination:', req.file.destination);
        logger.error('File filename:', req.file.filename);
        
        // Check uploads directory
        const uploadsDir = path.join(__dirname, '../../../uploads/event');
        logger.error('Expected uploads directory:', uploadsDir);
        logger.error('Directory exists:', fs.existsSync(uploadsDir));
        
        // Try to list files in uploads directory
        try {
          if (fs.existsSync(uploadsDir)) {
            const files = fs.readdirSync(uploadsDir);
            logger.error('Files in uploads directory:', files.slice(0, 10));
          }
        } catch (err) {
          logger.error('Cannot read uploads directory:', err.message);
        }
        
        throw new ValidationError('Failed to save uploaded image. File was not saved to disk.');
      }
      
      const fileStats = fs.statSync(filePath);
      logger.info('✅ File saved successfully at:', filePath);
      logger.info('✅ File size on disk:', fileStats.size, 'bytes');
      
      // Delete old image if exists
      if (existing[0].Image_URL) {
        const oldPath = path.join(__dirname, '../../../uploads/event', path.basename(existing[0].Image_URL));
        if (fs.existsSync(oldPath)) {
          try {
            fs.unlinkSync(oldPath);
            logger.info('🗑️ Deleted old image:', oldPath);
          } catch (err) {
            logger.warn('⚠️ Could not delete old image:', err.message);
          }
        } else {
          logger.warn('⚠️ Old image path does not exist:', oldPath);
        }
      }
      updates.Image_URL = `/uploads/event/${req.file.filename}`;
      logger.info('✅ Image URL set to:', updates.Image_URL);
    } else {
      logger.info('ℹ️ No image file provided in update request');
      // Keep existing image if no new image is provided
      // Explicitly remove Image_URL from updates if it exists (to prevent it from being set to null/undefined)
      if (updates.Image_URL !== undefined) {
        logger.warn('⚠️ Image_URL found in updates but no file provided. Removing to keep existing image.');
        delete updates.Image_URL;
      }
      if (existing[0].Image_URL) {
        logger.info('ℹ️ Keeping existing image:', existing[0].Image_URL);
      }
    }

    const allowedFields = ['Event_Name', 'Description', 'Start_DateTime', 'End_DateTime', 'Price_Ticket', 'Quantity', 'Address', 'Category_ID', 'Status', 'Image_URL'];
    const updateFields = [];
    const values = [];

    for (const field of allowedFields) {
      // Only include Image_URL if it was explicitly set (i.e., a new file was uploaded)
      if (field === 'Image_URL' && !req.file) {
        logger.info('⏭️ Skipping Image_URL update (no new file provided)');
        continue;
      }
      
      if (updates[field] !== undefined && updates[field] !== null) {
        updateFields.push(`${field} = ?`);
        values.push(updates[field]);
        logger.info(`📝 Adding field to update: ${field} = ${updates[field]}`);
      }
    }

    if (updateFields.length === 0) {
      throw new ValidationError('No fields to update');
    }

    logger.info('📊 Update query:', `UPDATE events SET ${updateFields.join(', ')} WHERE Event_ID = ?`);
    logger.info('📊 Update values:', values);

    values.push(id);
    await db.query(`UPDATE events SET ${updateFields.join(', ')} WHERE Event_ID = ?`, values);

    const [rows] = await db.query('SELECT * FROM events WHERE Event_ID = ?', [id]);
    logger.info('✅ Event updated successfully. New Image_URL:', rows[0]?.Image_URL);
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    next(err);
  }
};

const deleteEvent = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [rows] = await db.query('SELECT * FROM events WHERE Event_ID = ?', [id]);
    if (rows.length === 0) {
      throw new NotFoundError('Event');
    }

    await db.query('UPDATE events SET Status = ? WHERE Event_ID = ?', ['deleted', id]);

    res.json({ success: true, message: 'Event deleted successfully' });
  } catch (err) {
    next(err);
  }
};

const checkAvailability = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [rows] = await db.query('SELECT Available_Quantity, Quantity FROM events WHERE Event_ID = ?', [id]);
    if (rows.length === 0) {
      throw new NotFoundError('Event');
    }

    res.json({
      success: true,
      data: {
        available: rows[0].Available_Quantity,
        total: rows[0].Quantity,
      },
    });
  } catch (err) {
    next(err);
  }
};

const updateAvailability = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { quantity, action } = req.body;

    if (!quantity || !action || !['increase', 'decrease'].includes(action)) {
      throw new ValidationError('quantity and action (increase/decrease) are required');
    }

    const [rows] = await db.query('SELECT Available_Quantity FROM events WHERE Event_ID = ?', [id]);
    if (rows.length === 0) {
      throw new NotFoundError('Event');
    }

    const currentAvailable = rows[0].Available_Quantity;
    let newAvailable;

    if (action === 'increase') {
      newAvailable = currentAvailable + quantity;
    } else {
      newAvailable = Math.max(0, currentAvailable - quantity);
    }

    await db.query('UPDATE events SET Available_Quantity = ? WHERE Event_ID = ?', [newAvailable, id]);

    res.json({
      success: true,
      data: {
        available: newAvailable,
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  checkAvailability,
  updateAvailability,
};
