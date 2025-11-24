const { ValidationError } = require('../../../shared/utils/errors');

class AuthValidator {
  /**
   * Validate login request
   * @param {Object} data - Login data
   * @throws {ValidationError} If validation fails
   */
  validateLogin(data) {
    const { account, password } = data;

    if (!account || typeof account !== 'string' || account.trim().length === 0) {
      throw new ValidationError('Account is required');
    }

    if (!password || typeof password !== 'string' || password.length === 0) {
      throw new ValidationError('Password is required');
    }

    if (password.length < 6) {
      throw new ValidationError('Password must be at least 6 characters');
    }
  }

  /**
   * Validate register request
   * @param {Object} data - Registration data
   * @throws {ValidationError} If validation fails
   */
  validateRegister(data) {
    const { FullName, Account, Gmail, Password } = data;

    if (!FullName || typeof FullName !== 'string' || FullName.trim().length === 0) {
      throw new ValidationError('FullName is required');
    }

    if (!Account || typeof Account !== 'string' || Account.trim().length === 0) {
      throw new ValidationError('Account is required');
    }

    if (Account.length < 3) {
      throw new ValidationError('Account must be at least 3 characters');
    }

    if (!Gmail || typeof Gmail !== 'string') {
      throw new ValidationError('Gmail is required');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(Gmail)) {
      throw new ValidationError('Invalid email format');
    }

    if (!Password || typeof Password !== 'string' || Password.length === 0) {
      throw new ValidationError('Password is required');
    }

    if (Password.length < 6) {
      throw new ValidationError('Password must be at least 6 characters');
    }
  }

  /**
   * Validate refresh token request
   * @param {Object} data - Refresh token data
   * @throws {ValidationError} If validation fails
   */
  validateRefreshToken(data) {
    const { refreshToken } = data;

    if (!refreshToken || typeof refreshToken !== 'string') {
      throw new ValidationError('Refresh token is required');
    }
  }

  /**
   * Validate change password request
   * @param {Object} data - Change password data
   * @throws {ValidationError} If validation fails
   */
  validateChangePassword(data) {
    const { oldPassword, newPassword } = data;

    if (!oldPassword || typeof oldPassword !== 'string') {
      throw new ValidationError('Old password is required');
    }

    if (!newPassword || typeof newPassword !== 'string') {
      throw new ValidationError('New password is required');
    }

    if (newPassword.length < 6) {
      throw new ValidationError('New password must be at least 6 characters');
    }
  }
}

module.exports = new AuthValidator();

