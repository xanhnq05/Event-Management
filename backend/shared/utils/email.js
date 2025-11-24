const nodemailer = require('nodemailer');
const logger = require('./logger');

// Create reusable transporter object using SMTP transport
let transporter = null;

const initEmailTransporter = () => {
  if (transporter) {
    return transporter;
  }

  const emailConfig = {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER, // Email của hệ thống
      pass: process.env.SMTP_PASSWORD, // Mật khẩu ứng dụng (App Password)
    },
  };

  // Validate email config
  if (!emailConfig.auth.user || !emailConfig.auth.pass) {
    logger.warn('Email configuration missing. Email sending will be disabled.');
    return null;
  }

  transporter = nodemailer.createTransport(emailConfig);

  // Verify connection
  transporter.verify((error, success) => {
    if (error) {
      logger.error('Email transporter verification failed:', error);
    } else {
      logger.info('Email transporter is ready to send messages');
    }
  });

  return transporter;
};

/**
 * Send email
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.html - HTML content
 * @param {string} options.text - Plain text content (optional)
 * @returns {Promise}
 */
const sendEmail = async (options) => {
  try {
    const emailTransporter = initEmailTransporter();
    
    if (!emailTransporter) {
      logger.warn('Email transporter not initialized. Email not sent:', options.to);
      return { success: false, message: 'Email service not configured' };
    }

    const mailOptions = {
      from: `"EventHub" <${process.env.SMTP_USER}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text || options.html.replace(/<[^>]*>/g, ''), // Strip HTML for text version
    };

    const info = await emailTransporter.sendMail(mailOptions);
    logger.info(`Email sent successfully to ${options.to}:`, info.messageId);
    
    return { success: true, messageId: info.messageId };
  } catch (error) {
    logger.error('Error sending email:', error);
    throw error;
  }
};

/**
 * Send OTP email
 * @param {string} email - Recipient email
 * @param {string} otpCode - OTP code
 * @returns {Promise}
 */
const sendOTPEmail = async (email, otpCode) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
        .otp-box { background: white; border: 2px dashed #0ea5e9; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0; }
        .otp-code { font-size: 32px; font-weight: bold; color: #0ea5e9; letter-spacing: 5px; font-family: monospace; }
        .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 12px; }
        .warning { color: #ef4444; font-size: 14px; margin-top: 15px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>EventHub</h1>
          <p>Mã xác thực OTP</p>
        </div>
        <div class="content">
          <p>Xin chào,</p>
          <p>Bạn đã yêu cầu mã OTP để xác thực. Mã OTP của bạn là:</p>
          <div class="otp-box">
            <div class="otp-code">${otpCode}</div>
          </div>
          <p>Mã này có hiệu lực trong <strong>10 phút</strong>.</p>
          <p class="warning">⚠️ Lưu ý: Không chia sẻ mã này với bất kỳ ai. EventHub sẽ không bao giờ yêu cầu bạn cung cấp mã OTP.</p>
          <p>Nếu bạn không yêu cầu mã này, vui lòng bỏ qua email này.</p>
        </div>
        <div class="footer">
          <p>© 2024 EventHub. Tất cả quyền được bảo lưu.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: email,
    subject: 'Mã OTP xác thực - EventHub',
    html,
  });
};

/**
 * Send invoice email after successful payment
 * @param {string} email - Recipient email
 * @param {Object} invoiceData - Invoice data
 * @returns {Promise}
 */
const sendInvoiceEmail = async (email, invoiceData) => {
  const { 
    transactionId, 
    eventName, 
    ticketQuantity, 
    pricePerTicket, 
    totalAmount, 
    purchaseDate,
    eventDate,
    eventAddress,
    tickets
  } = invoiceData;

  const ticketsList = tickets && tickets.length > 0
    ? tickets.map((ticket, index) => `
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">${index + 1}</td>
          <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">${ticket.ticketId || 'N/A'}</td>
          <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; text-align: right;">${formatCurrency(pricePerTicket)}</td>
        </tr>
      `).join('')
    : `
        <tr>
          <td colspan="3" style="padding: 10px; border-bottom: 1px solid #e5e7eb; text-align: center;">${ticketQuantity} vé</td>
        </tr>
      `;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
        .success-badge { background: #10b981; color: white; padding: 10px 20px; border-radius: 5px; display: inline-block; margin: 20px 0; }
        .info-box { background: white; border-left: 4px solid #0ea5e9; padding: 15px; margin: 15px 0; }
        .info-row { display: flex; justify-content: space-between; margin: 10px 0; }
        .info-label { font-weight: 600; color: #6b7280; }
        .info-value { color: #111827; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; background: white; }
        th { background: #f3f4f6; padding: 10px; text-align: left; border-bottom: 2px solid #e5e7eb; }
        td { padding: 10px; border-bottom: 1px solid #e5e7eb; }
        .total-row { font-weight: bold; font-size: 18px; color: #0ea5e9; }
        .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>EventHub</h1>
          <p>Hóa đơn thanh toán</p>
        </div>
        <div class="content">
          <div style="text-align: center;">
            <div class="success-badge">✓ Thanh toán thành công</div>
          </div>
          
          <div class="info-box">
            <div class="info-row">
              <span class="info-label">Mã giao dịch:</span>
              <span class="info-value">#${transactionId}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Ngày mua:</span>
              <span class="info-value">${formatDate(purchaseDate)}</span>
            </div>
          </div>

          <h2 style="color: #0ea5e9; margin-top: 30px;">Thông tin sự kiện</h2>
          <div class="info-box">
            <div class="info-row">
              <span class="info-label">Tên sự kiện:</span>
              <span class="info-value">${eventName}</span>
            </div>
            ${eventDate ? `
            <div class="info-row">
              <span class="info-label">Ngày diễn ra:</span>
              <span class="info-value">${formatDate(eventDate)}</span>
            </div>
            ` : ''}
            ${eventAddress ? `
            <div class="info-row">
              <span class="info-label">Địa điểm:</span>
              <span class="info-value">${eventAddress}</span>
            </div>
            ` : ''}
          </div>

          <h2 style="color: #0ea5e9; margin-top: 30px;">Chi tiết vé</h2>
          <table>
            <thead>
              <tr>
                <th>STT</th>
                <th>Mã vé</th>
                <th style="text-align: right;">Giá vé</th>
              </tr>
            </thead>
            <tbody>
              ${ticketsList}
              <tr class="total-row">
                <td colspan="2" style="text-align: right; padding-top: 20px;">Tổng cộng:</td>
                <td style="text-align: right; padding-top: 20px;">${formatCurrency(totalAmount)}</td>
              </tr>
            </tbody>
          </table>

          <p style="margin-top: 30px; padding: 15px; background: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 5px;">
            <strong>Lưu ý:</strong> Vui lòng lưu email này làm hóa đơn. Bạn có thể xem lại vé đã mua trong mục "Vé của tôi" trên website.
          </p>
        </div>
        <div class="footer">
          <p>Cảm ơn bạn đã sử dụng dịch vụ của EventHub!</p>
          <p>© 2024 EventHub. Tất cả quyền được bảo lưu.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: email,
    subject: `Hóa đơn thanh toán - ${eventName} - EventHub`,
    html,
  });
};

// Helper functions
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
};

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

module.exports = {
  sendEmail,
  sendOTPEmail,
  sendInvoiceEmail,
  initEmailTransporter,
};

