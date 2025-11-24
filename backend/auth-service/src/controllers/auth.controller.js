const authService = require('../services/auth.service');
const authValidator = require('../validators/auth.validator');
const { asyncHandler } = require('../utils/asyncHandler');

/**
 * @route POST /auth/login
 * @desc Login user
 * @access Public
 */
const login = asyncHandler(async (req, res) => {
  authValidator.validateLogin(req.body);
  const result = await authService.login(req.body.account, req.body.password);

  res.json({
    success: true,
    data: result,
  });
});

/**
 * @route POST /auth/register
 * @desc Register new user
 * @access Public
 */
const register = asyncHandler(async (req, res) => {
  authValidator.validateRegister(req.body);
  const user = await authService.register(req.body);

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: user,
  });
});

/**
 * @route POST /auth/logout
 * @desc Logout user
 * @access Private
 */
const logout = asyncHandler(async (req, res) => {
  const token = req.headers.authorization?.substring(7);
  const userId = req.user?.userId;

  await authService.logout(token, userId);

  res.json({
    success: true,
    message: 'Logged out successfully',
  });
});

/**
 * @route POST /auth/refresh
 * @desc Refresh access token
 * @access Public
 */
const refreshToken = asyncHandler(async (req, res) => {
  authValidator.validateRefreshToken(req.body);
  const accessToken = await authService.refreshToken(req.body.refreshToken);

  res.json({
    success: true,
    data: {
      token: accessToken,
    },
  });
});

/**
 * @route POST /auth/verify
 * @desc Verify access token
 * @access Public
 */
const verifyToken = asyncHandler(async (req, res) => {
  const token = req.headers.authorization?.substring(7);
  const decoded = await authService.verifyToken(token);

  res.json({
    success: true,
    data: {
      valid: true,
      user: decoded,
    },
  });
});

/**
 * @route GET /auth/me
 * @desc Get current user
 * @access Private
 */
const getMe = asyncHandler(async (req, res) => {
  const userId = req.user?.userId;
  const user = await authService.getMe(userId);

  res.json({
    success: true,
    data: user,
  });
});

/**
 * @route PUT /auth/change-password
 * @desc Change user password
 * @access Private
 */
const changePassword = asyncHandler(async (req, res) => {
  const userId = req.user?.userId;
  authValidator.validateChangePassword(req.body);

  await authService.changePassword(
    userId,
    req.body.oldPassword,
    req.body.newPassword
  );

  res.json({
    success: true,
    message: 'Password changed successfully',
  });
});

module.exports = {
  login,
  register,
  logout,
  refreshToken,
  verifyToken,
  getMe,
  changePassword,
};
