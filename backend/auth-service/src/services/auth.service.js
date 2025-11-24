const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const axios = require('axios');
const sessionRepository = require('../repositories/session.repository');
const { UnauthorizedError, ValidationError } = require('../../../shared/utils/errors');
const logger = require('../../../shared/utils/logger');
const { getRedisClient } = require('../config/redis');

class AuthService {
  /**
   * Generate JWT tokens
   * @param {Object} payload - Token payload
   * @returns {Object} Access token and refresh token
   */
  generateTokens(payload) {
    const accessToken = jwt.sign(
      { userId: payload.userId, account: payload.account },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    const refreshToken = jwt.sign(
      { userId: payload.userId, account: payload.account },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' }
    );

    return { accessToken, refreshToken };
  }

  /**
   * Login user
   * @param {string} account - User account
   * @param {string} password - User password
   * @returns {Promise<Object>} User data and tokens
   */
  async login(account, password) {
    if (!account || !password) {
      throw new ValidationError('Account and password are required');
    }

    // Get user from user service
    let user;
    try {
      const userServiceUrl = process.env.USER_SERVICE_URL || 'http://localhost:3002';
      logger.info(`Calling user-service: ${userServiceUrl}/users/account/${account}`);
      
      const response = await axios.get(`${userServiceUrl}/users/account/${account}`, {
        timeout: 10000, // 10 seconds timeout
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      logger.info('User-service response received');
      user = response.data.data;
    } catch (err) {
      logger.error('Error calling user-service:', {
        message: err.message,
        code: err.code,
        response: err.response?.status,
      });
      
      if (err.code === 'ECONNREFUSED' || err.code === 'ETIMEDOUT') {
        throw new Error('User service không phản hồi. Vui lòng kiểm tra user-service có đang chạy không.');
      }
      
      if (err.response?.status === 404) {
        throw new UnauthorizedError('Invalid credentials');
      }
      throw err;
    }

    // Verify password
    if (!user.Password) {
      throw new UnauthorizedError('Invalid credentials');
    }

    const bcrypt = require('bcrypt');
    let isPasswordValid = false;
    
    // Kiểm tra xem password trong DB có phải là bcrypt hash không (bcrypt hash có length >= 60)
    if (user.Password.length >= 60) {
      // Password đã được hash bằng bcrypt
      logger.info('Password is bcrypt hash, using bcrypt.compare');
      isPasswordValid = await bcrypt.compare(password, user.Password);
    } else {
      // Password là plain text (từ SQL file) - so sánh trực tiếp
      logger.info('Password is plain text, comparing directly');
      isPasswordValid = password === user.Password;
    }
    
    if (!isPasswordValid) {
      logger.warn('Invalid password for account:', account);
      throw new UnauthorizedError('Invalid credentials');
    }
    
    logger.info('Password verified successfully for account:', account);

    // Generate tokens
    const { accessToken, refreshToken } = this.generateTokens({
      userId: user.User_ID,
      account: user.Account,
    });

    // Create session
    const sessionId = uuidv4();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    await sessionRepository.create({
      sessionId,
      userId: user.User_ID,
      token: accessToken,
      refreshToken,
      expiresAt,
    });

    // Store refresh token in Redis
    const redis = getRedisClient();
    if (redis) {
      const refreshExpiresAt = new Date();
      refreshExpiresAt.setDate(refreshExpiresAt.getDate() + 7);
      await redis.setEx(
        `refresh_token:${user.User_ID}`,
        Math.floor((refreshExpiresAt - new Date()) / 1000),
        refreshToken
      );
    }

    // Remove password from response
    delete user.Password;

    return {
      user,
      accessToken,
      refreshToken,
    };
  }

  /**
   * Register new user
   * @param {Object} userData - User registration data
   * @returns {Promise<Object>} Created user
   */
  async register(userData) {
    const { FullName, Account, Gmail, Phone, Address, Birthday, Sex, Password } = userData;

    if (!FullName || !Account || !Gmail || !Password) {
      throw new ValidationError('FullName, Account, Gmail, and Password are required');
    }

    try {
      const response = await axios.post(`${process.env.USER_SERVICE_URL}/users`, {
        FullName,
        Account,
        Gmail,
        Phone,
        Address,
        Birthday,
        Sex,
        Password,
      });

      return response.data.data;
    } catch (err) {
      if (err.response?.status === 400) {
        throw new ValidationError(err.response.data.message);
      }
      throw err;
    }
  }

  /**
   * Logout user
   * @param {string} token - Access token
   * @param {string} userId - User ID
   * @returns {Promise<void>}
   */
  async logout(token, userId) {
    if (token && userId) {
      // Blacklist token in Redis
      const redis = getRedisClient();
      if (redis) {
        try {
          const decoded = jwt.decode(token);
          const expiresIn = decoded.exp - Math.floor(Date.now() / 1000);
          if (expiresIn > 0) {
            await redis.setEx(`blacklist:${token}`, expiresIn, '1');
          }
          await redis.del(`refresh_token:${userId}`);
        } catch (err) {
          logger.error('Error blacklisting token:', err);
        }
      }

      // Delete session from database
      await sessionRepository.deleteByUserId(userId);
    }
  }

  /**
   * Refresh access token
   * @param {string} refreshToken - Refresh token
   * @returns {Promise<string>} New access token
   */
  async refreshToken(refreshToken) {
    if (!refreshToken) {
      throw new ValidationError('Refresh token is required');
    }

    try {
      const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
      const userId = decoded.userId;

      // Verify refresh token in Redis
      const redis = getRedisClient();
      if (redis) {
        const storedToken = await redis.get(`refresh_token:${userId}`);
        if (storedToken !== refreshToken) {
          throw new UnauthorizedError('Invalid refresh token');
        }
      }

      // Generate new access token
      const { accessToken } = this.generateTokens({
        userId: decoded.userId,
        account: decoded.account,
      });

      return accessToken;
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        throw new UnauthorizedError('Refresh token expired');
      }
      throw new UnauthorizedError('Invalid refresh token');
    }
  }

  /**
   * Verify access token
   * @param {string} token - Access token
   * @returns {Promise<Object>} Decoded token payload
   */
  async verifyToken(token) {
    if (!token) {
      throw new ValidationError('Token is required');
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Check if token is blacklisted
      const redis = getRedisClient();
      if (redis) {
        const blacklisted = await redis.get(`blacklist:${token}`);
        if (blacklisted) {
          throw new UnauthorizedError('Token has been revoked');
        }
      }

      return decoded;
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        throw new UnauthorizedError('Token expired');
      }
      throw new UnauthorizedError('Invalid token');
    }
  }

  /**
   * Get current user info
   * @param {string} userId - User ID
   * @returns {Promise<Object>} User data
   */
  async getMe(userId) {
    if (!userId) {
      throw new UnauthorizedError('User not authenticated');
    }

    try {
      const response = await axios.get(`${process.env.USER_SERVICE_URL}/users/${userId}`);
      return response.data.data;
    } catch (err) {
      if (err.response?.status === 404) {
        throw new (require('../../../shared/utils/errors').NotFoundError)('User');
      }
      throw err;
    }
  }

  /**
   * Change user password
   * @param {string} userId - User ID
   * @param {string} oldPassword - Old password
   * @param {string} newPassword - New password
   * @returns {Promise<void>}
   */
  async changePassword(userId, oldPassword, newPassword) {
    if (!oldPassword || !newPassword) {
      throw new ValidationError('Old password and new password are required');
    }

    if (newPassword.length < 6) {
      throw new ValidationError('New password must be at least 6 characters');
    }

    try {
      await axios.put(`${process.env.USER_SERVICE_URL}/users/${userId}/password`, {
        oldPassword,
        newPassword,
      });
    } catch (err) {
      if (err.response?.status === 400) {
        throw new ValidationError(err.response.data.message);
      }
      throw err;
    }
  }
}

module.exports = new AuthService();

