const { v4: uuidv4 } = require('uuid');
const db = require('../config/database');
const { getRedisClient } = require('../config/redis');
const { ValidationError } = require('../../../shared/utils/errors');
const { sendOTPEmail } = require('../../../shared/utils/email');
const logger = require('../../../shared/utils/logger');

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const sendOTP = async (req, res, next) => {
  try {
    const { email, phone, type } = req.body;

    if (!type || !['email', 'sms'].includes(type)) {
      throw new ValidationError('Type must be email or sms');
    }

    if (type === 'email' && !email) {
      throw new ValidationError('Email is required');
    }

    if (type === 'sms' && !phone) {
      throw new ValidationError('Phone is required');
    }

    // Generate OTP
    const code = generateOTP();
    const otpId = uuidv4();
    // Use UTC time to avoid timezone issues
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now in UTC

    logger.info('📝 Creating OTP:', {
      email,
      phone,
      otpId,
      expiresAt: expiresAt.toISOString(),
      now: new Date().toISOString(),
      expiresIn: '10 minutes'
    });

    // Store in database
    await db.query(
      `INSERT INTO otp_codes (otp_id, email, phone, code, type, expires_at, used)
       VALUES (?, ?, ?, ?, ?, ?, 0)`,
      [otpId, email || null, phone || null, code, type, expiresAt]
    );

    // Store in Redis for fast lookup
    const redis = getRedisClient();
    if (redis) {
      const key = email ? `otp:email:${email}` : `otp:phone:${phone}`;
      await redis.setEx(key, 600, code); // 10 minutes
    }

    // Send OTP via email or SMS
    let emailSent = false;
    let emailError = null;
    
    try {
      if (type === 'email' && email) {
        const emailResult = await sendOTPEmail(email, code);
        if (emailResult && emailResult.success) {
          emailSent = true;
          logger.info(`OTP email sent to ${email}`);
        } else {
          emailError = emailResult?.message || 'Email service not configured';
          logger.error(`Failed to send OTP email to ${email}:`, emailError);
        }
      } else if (type === 'sms' && phone) {
        // TODO: Implement SMS sending
        logger.info(`OTP SMS should be sent to ${phone}: ${code}`);
        console.log(`OTP for ${phone}: ${code}`);
        emailSent = true; // For SMS, we consider it "sent" for now
      }
    } catch (err) {
      emailError = err.message || 'Unknown error sending email';
      logger.error('Error sending OTP email:', err);
    }

    // If email failed to send, return error response
    if (type === 'email' && !emailSent) {
      return res.status(500).json({
        success: false,
        message: 'Không thể gửi email OTP. Vui lòng kiểm tra cấu hình email hoặc thử lại sau.',
        error: emailError,
        data: {
          otp_id: otpId,
          expires_at: expiresAt,
        },
      });
    }

    res.json({
      success: true,
      message: 'OTP sent successfully',
      data: {
        otp_id: otpId,
        expires_at: expiresAt,
      },
    });
  } catch (err) {
    next(err);
  }
};

const verifyOTP = async (req, res, next) => {
  try {
    const { email, phone, code } = req.body;

    logger.info('🔐 OTP verification request:', {
      email,
      phone,
      code: code ? '***' : undefined,
      has_code: !!code
    });

    if (!code) {
      logger.error('❌ OTP code is missing');
      throw new ValidationError('OTP code is required');
    }

    if (!email && !phone) {
      logger.error('❌ Both email and phone are missing');
      throw new ValidationError('Email or phone is required');
    }

    // Check Redis first
    const redis = getRedisClient();
    let isValid = false;
    let verificationSource = 'none';

    if (redis) {
      const key = email ? `otp:email:${email}` : `otp:phone:${phone}`;
      logger.info(`🔍 Checking Redis for key: ${key}`);
      const storedCode = await redis.get(key);
      
      if (storedCode) {
        logger.info(`📥 Found OTP in Redis: ${storedCode === code ? 'MATCH' : 'NO MATCH'}`);
        if (storedCode === code) {
          isValid = true;
          verificationSource = 'redis';
          await redis.del(key);
          logger.info('✅ OTP verified from Redis');
        }
      } else {
        logger.info('📭 No OTP found in Redis');
      }
    } else {
      logger.warn('⚠️ Redis not available, skipping Redis check');
    }

    // Check database
    if (!isValid) {
      logger.info('🔍 Checking database for OTP');
      const now = new Date();
      logger.info('⏰ Current time (UTC):', now.toISOString());
      
      const [rows] = await db.query(
        `SELECT * FROM otp_codes 
         WHERE (email = ? OR phone = ?) AND code = ? AND used = 0 AND expires_at > UTC_TIMESTAMP()
         ORDER BY created_at DESC LIMIT 1`,
        [email || null, phone || null, code]
      );

      logger.info(`📊 Found ${rows.length} OTP record(s) in database`);
      
      if (rows.length > 0) {
        logger.info('✅ OTP found in database:', {
          otp_id: rows[0].otp_id,
          email: rows[0].email,
          expires_at: rows[0].expires_at,
          used: rows[0].used
        });
        isValid = true;
        verificationSource = 'database';
        await db.query('UPDATE otp_codes SET used = 1 WHERE otp_id = ?', [rows[0].otp_id]);
        logger.info('✅ OTP marked as used in database');
      } else {
        // Check if OTP exists but expired or used
        const [allRows] = await db.query(
          `SELECT * FROM otp_codes 
           WHERE (email = ? OR phone = ?) AND code = ?
           ORDER BY created_at DESC LIMIT 1`,
          [email || null, phone || null, code]
        );
        
        if (allRows.length > 0) {
          const otpRecord = allRows[0];
          const expiresAt = new Date(otpRecord.expires_at);
          const now = new Date();
          const isExpired = expiresAt < now;
          
          logger.warn('⚠️ OTP found but invalid:', {
            used: otpRecord.used,
            expires_at: otpRecord.expires_at,
            expires_at_iso: expiresAt.toISOString(),
            now_iso: now.toISOString(),
            is_expired: isExpired,
            timezone_offset: now.getTimezoneOffset()
          });
        } else {
          logger.warn('⚠️ No OTP found in database for this email/phone and code');
        }
      }
    }

    if (!isValid) {
      logger.error('❌ OTP verification failed - Invalid or expired OTP');
      throw new ValidationError('Invalid or expired OTP code. Please request a new OTP.');
    }

    logger.info(`✅ OTP verified successfully from ${verificationSource}`);
    res.json({
      success: true,
      message: 'OTP verified successfully',
    });
  } catch (err) {
    logger.error('❌ OTP verification error:', err);
    next(err);
  }
};

module.exports = {
  sendOTP,
  verifyOTP,
};

