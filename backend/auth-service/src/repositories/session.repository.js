const db = require('../config/database');
const logger = require('../../../shared/utils/logger');

class SessionRepository {
  /**
   * Create a new session
   * @param {Object} sessionData - Session data
   * @returns {Promise<void>}
   */
  async create(sessionData) {
    const { sessionId, userId, token, refreshToken, expiresAt } = sessionData;

    try {
      await db.query(
        `INSERT INTO sessions (session_id, user_id, token, refresh_token, expires_at) 
         VALUES (?, ?, ?, ?, ?)`,
        [sessionId, userId, token, refreshToken, expiresAt]
      );
    } catch (err) {
      logger.error('Error creating session:', err);
      throw err;
    }
  }

  /**
   * Get session by session ID
   * @param {string} sessionId - Session ID
   * @returns {Promise<Object|null>} Session data
   */
  async findById(sessionId) {
    try {
      const [rows] = await db.query(
        'SELECT * FROM sessions WHERE session_id = ?',
        [sessionId]
      );
      return rows.length > 0 ? rows[0] : null;
    } catch (err) {
      logger.error('Error finding session:', err);
      throw err;
    }
  }

  /**
   * Get session by user ID
   * @param {string} userId - User ID
   * @returns {Promise<Array>} Sessions
   */
  async findByUserId(userId) {
    try {
      const [rows] = await db.query(
        'SELECT * FROM sessions WHERE user_id = ? ORDER BY created_at DESC',
        [userId]
      );
      return rows;
    } catch (err) {
      logger.error('Error finding sessions by user ID:', err);
      throw err;
    }
  }

  /**
   * Delete session by user ID
   * @param {string} userId - User ID
   * @returns {Promise<void>}
   */
  async deleteByUserId(userId) {
    try {
      await db.query('DELETE FROM sessions WHERE user_id = ?', [userId]);
    } catch (err) {
      logger.error('Error deleting session:', err);
      throw err;
    }
  }

  /**
   * Delete expired sessions
   * @returns {Promise<number>} Number of deleted sessions
   */
  async deleteExpired() {
    try {
      const [result] = await db.query(
        'DELETE FROM sessions WHERE expires_at < NOW()'
      );
      return result.affectedRows;
    } catch (err) {
      logger.error('Error deleting expired sessions:', err);
      throw err;
    }
  }
}

module.exports = new SessionRepository();

