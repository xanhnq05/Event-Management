const bcrypt = require('bcrypt');
const path = require('path');
const db = require('../config/database');
const { getRedisClient } = require('../config/redis');
const { ValidationError, NotFoundError } = require('../../../shared/utils/errors');
const logger = require('../../../shared/utils/logger');

// Generate User_ID
const generateUserId = async () => {
  const [rows] = await db.query('SELECT User_ID FROM users ORDER BY User_ID DESC LIMIT 1');
  if (rows.length === 0) {
    return 'ND01';
  }
  const lastId = rows[0].User_ID;
  const num = parseInt(lastId.substring(2)) + 1;
  return `ND${num.toString().padStart(2, '0')}`;
};

// Get user by ID
const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check cache first
    const redis = getRedisClient();
    if (redis) {
      const cached = await redis.get(`user:${id}`);
      if (cached) {
        return res.json({
          success: true,
          data: JSON.parse(cached),
        });
      }
    }

    const [rows] = await db.query('SELECT * FROM users WHERE User_ID = ?', [id]);

    if (rows.length === 0) {
      throw new NotFoundError('User');
    }

    const user = rows[0];
    delete user.Password;

    // Cache user data
    if (redis) {
      await redis.setEx(`user:${id}`, 3600, JSON.stringify(user)); // Cache for 1 hour
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (err) {
    next(err);
  }
};

// Get user by account
const getUserByAccount = async (req, res, next) => {
  try {
    const { account } = req.params;

    const [rows] = await db.query('SELECT * FROM users WHERE Account = ?', [account]);

    if (rows.length === 0) {
      throw new NotFoundError('User');
    }

    res.json({
      success: true,
      data: rows[0],
    });
  } catch (err) {
    next(err);
  }
};

// Create user
const createUser = async (req, res, next) => {
  try {
    const { FullName, Account, Gmail, Phone, Address, Birthday, Sex, Password } = req.body;

    if (!FullName || !Account || !Gmail || !Password) {
      throw new ValidationError('FullName, Account, Gmail, and Password are required');
    }

    // Check if account or email already exists
    const [existing] = await db.query(
      'SELECT * FROM users WHERE Account = ? OR Gmail = ?',
      [Account, Gmail]
    );

    if (existing.length > 0) {
      throw new ValidationError('Account or email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(Password, 10);

    // Generate User_ID
    const User_ID = await generateUserId();

    // Insert user
    await db.query(
      `INSERT INTO users (User_ID, FullName, Birthday, Sex, Address, Phone, Gmail, Account, Password)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [User_ID, FullName, Birthday || null, Sex || null, Address || null, Phone || null, Gmail, Account, hashedPassword]
    );

    // Get created user
    const [rows] = await db.query('SELECT * FROM users WHERE User_ID = ?', [User_ID]);
    const user = rows[0];
    delete user.Password;

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: user,
    });
  } catch (err) {
    next(err);
  }
};

// Update user
const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { FullName, Phone, Address, Birthday, Sex } = req.body;

    // Check if user exists
    const [existing] = await db.query('SELECT * FROM users WHERE User_ID = ?', [id]);
    if (existing.length === 0) {
      throw new NotFoundError('User');
    }

    // Build update query
    const updates = [];
    const values = [];

    if (FullName !== undefined) {
      updates.push('FullName = ?');
      values.push(FullName);
    }
    if (Phone !== undefined) {
      updates.push('Phone = ?');
      values.push(Phone);
    }
    if (Address !== undefined) {
      updates.push('Address = ?');
      values.push(Address);
    }
    if (Birthday !== undefined) {
      updates.push('Birthday = ?');
      values.push(Birthday);
    }
    if (Sex !== undefined) {
      updates.push('Sex = ?');
      values.push(Sex);
    }

    if (updates.length === 0) {
      throw new ValidationError('No fields to update');
    }

    values.push(id);

    await db.query(
      `UPDATE users SET ${updates.join(', ')} WHERE User_ID = ?`,
      values
    );

    // Invalidate cache
    const redis = getRedisClient();
    if (redis) {
      await redis.del(`user:${id}`);
    }

    // Get updated user
    const [rows] = await db.query('SELECT * FROM users WHERE User_ID = ?', [id]);
    const user = rows[0];
    delete user.Password;

    res.json({
      success: true,
      message: 'User updated successfully',
      data: user,
    });
  } catch (err) {
    next(err);
  }
};

// Upload avatar
const uploadAvatar = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!req.file) {
      throw new ValidationError('No file uploaded');
    }

    // Check if user exists
    const [existing] = await db.query('SELECT * FROM users WHERE User_ID = ?', [id]);
    if (existing.length === 0) {
      throw new NotFoundError('User');
    }

    // Delete old avatar if exists
    if (existing[0].Avatar_URL) {
      const oldPath = path.join(__dirname, '../../../uploads/avatars', path.basename(existing[0].Avatar_URL));
      const fs = require('fs');
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }

    // Update avatar URL
    const avatarUrl = `/uploads/avatars/${req.file.filename}`;
    await db.query('UPDATE users SET Avatar_URL = ? WHERE User_ID = ?', [avatarUrl, id]);

    // Invalidate cache
    const redis = getRedisClient();
    if (redis) {
      await redis.del(`user:${id}`);
    }

    res.json({
      success: true,
      message: 'Avatar uploaded successfully',
      data: {
        avatar_url: avatarUrl,
      },
    });
  } catch (err) {
    next(err);
  }
};

// Get balance
const getBalance = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [rows] = await db.query('SELECT Amount FROM users WHERE User_ID = ?', [id]);

    if (rows.length === 0) {
      throw new NotFoundError('User');
    }

    res.json({
      success: true,
      data: {
        amount: parseFloat(rows[0].Amount),
      },
    });
  } catch (err) {
    next(err);
  }
};

// Update balance (topup/withdraw)
const updateBalance = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { amount, type } = req.body; // type: 'topup' or 'withdraw'

    if (!amount || amount <= 0) {
      throw new ValidationError('Amount must be greater than 0');
    }

    if (!type || !['topup', 'withdraw'].includes(type)) {
      throw new ValidationError('Type must be topup or withdraw');
    }

    // Get current balance
    const [rows] = await db.query('SELECT Amount FROM users WHERE User_ID = ?', [id]);
    if (rows.length === 0) {
      throw new NotFoundError('User');
    }

    const currentAmount = parseFloat(rows[0].Amount);
    let newAmount;

    if (type === 'topup') {
      newAmount = currentAmount + amount;
    } else {
      if (currentAmount < amount) {
        throw new ValidationError('Insufficient balance');
      }
      newAmount = currentAmount - amount;
    }

    // Update balance
    await db.query('UPDATE users SET Amount = ? WHERE User_ID = ?', [newAmount, id]);

    // Invalidate cache
    const redis = getRedisClient();
    if (redis) {
      await redis.del(`user:${id}`);
    }

    res.json({
      success: true,
      message: `Balance ${type === 'topup' ? 'topped up' : 'withdrawn'} successfully`,
      data: {
        amount: newAmount,
      },
    });
  } catch (err) {
    next(err);
  }
};

// Change password
const changePassword = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      throw new ValidationError('Old password and new password are required');
    }

    if (newPassword.length < 6) {
      throw new ValidationError('New password must be at least 6 characters');
    }

    // Get user
    const [rows] = await db.query('SELECT * FROM users WHERE User_ID = ?', [id]);
    if (rows.length === 0) {
      throw new NotFoundError('User');
    }

    // Verify old password
    const isPasswordValid = await bcrypt.compare(oldPassword, rows[0].Password);
    if (!isPasswordValid) {
      throw new ValidationError('Old password is incorrect');
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await db.query('UPDATE users SET Password = ? WHERE User_ID = ?', [hashedPassword, id]);

    res.json({
      success: true,
      message: 'Password changed successfully',
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getUserById,
  getUserByAccount,
  createUser,
  updateUser,
  uploadAvatar,
  getBalance,
  updateBalance,
  changePassword,
};

