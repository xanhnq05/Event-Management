const express = require('express');
const router = express.Router();
const {
  login,
  register,
  logout,
  refreshToken,
  verifyToken,
  getMe,
  changePassword,
} = require('../controllers/auth.controller');
const { authenticate } = require('../middleware/auth.middleware');

/**
 * @route POST /auth/login
 * @desc Login user
 * @access Public
 */
router.post('/login', login);

/**
 * @route POST /auth/register
 * @desc Register new user
 * @access Public
 */
router.post('/register', register);

/**
 * @route POST /auth/refresh
 * @desc Refresh access token
 * @access Public
 */
router.post('/refresh', refreshToken);

/**
 * @route POST /auth/verify
 * @desc Verify access token
 * @access Public
 */
router.post('/verify', verifyToken);

/**
 * @route POST /auth/logout
 * @desc Logout user
 * @access Private
 */
router.post('/logout', authenticate, logout);

/**
 * @route GET /auth/me
 * @desc Get current user
 * @access Private
 */
router.get('/me', authenticate, getMe);

/**
 * @route PUT /auth/change-password
 * @desc Change user password
 * @access Private
 */
router.put('/change-password', authenticate, changePassword);

module.exports = router;

