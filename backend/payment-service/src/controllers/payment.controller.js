const { v4: uuidv4 } = require('uuid');
const QRCode = require('qrcode');
const db = require('../config/database');
const axios = require('axios');
const logger = require('../../../shared/utils/logger');
const { ValidationError, NotFoundError } = require('../../../shared/utils/errors');
const { sendInvoiceEmail } = require('../../../shared/utils/email');

const createPaymentSession = async (req, res, next) => {
  try {
    const { event_id, ticket_ids, user_id } = req.body;

    logger.info('📥 Received createPaymentSession request:', {
      event_id,
      ticket_ids_count: Array.isArray(ticket_ids) ? ticket_ids.length : 0,
      user_id,
      ticket_ids: Array.isArray(ticket_ids) ? ticket_ids : 'not an array'
    });

    if (!event_id || !ticket_ids || !user_id) {
      logger.error('❌ Missing required fields:', { event_id, has_ticket_ids: !!ticket_ids, user_id });
      throw new ValidationError('event_id, ticket_ids, and user_id are required');
    }

    // Get event details
    const eventServiceUrl = `${process.env.EVENT_SERVICE_URL}/events/${event_id}`;
    logger.info(`🔍 Fetching event from: ${eventServiceUrl}`);
    
    let event;
    try {
      const eventResponse = await axios.get(eventServiceUrl);
      logger.info('📥 Event response status:', eventResponse.status);
      logger.info('📥 Event response data:', eventResponse.data);
      
      event = eventResponse.data?.data || eventResponse.data;
      
      if (!event) {
        logger.error('❌ Event data is null or undefined');
        throw new NotFoundError(`Event with ID ${event_id} not found or invalid`);
      }
      
      logger.info('✅ Event found:', { Event_ID: event.Event_ID, Event_Name: event.Event_Name, Price_Ticket: event.Price_Ticket });
    } catch (eventError) {
      logger.error('❌ Error fetching event:', {
        message: eventError.message,
        response: eventError.response?.data,
        status: eventError.response?.status,
        url: eventServiceUrl
      });
      
      if (eventError.response?.status === 404) {
        throw new NotFoundError(`Event with ID ${event_id} not found. Please check the event ID and try again.`);
      }
      throw new ValidationError(`Failed to fetch event details: ${eventError.message}`);
    }

    // Calculate amount
    const amount = event.Price_Ticket * ticket_ids.length;
    logger.info(`💰 Calculated amount: ${amount} (${event.Price_Ticket} x ${ticket_ids.length} tickets)`);

    // Create payment session
    const sessionId = uuidv4();
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 30); // 30 minutes

    await db.query(
      `INSERT INTO payment_sessions (session_id, user_id, event_id, ticket_ids, amount, expires_at, status)
       VALUES (?, ?, ?, ?, ?, ?, 'pending')`,
      [sessionId, user_id, event_id, JSON.stringify(ticket_ids), amount, expiresAt]
    );

    res.json({
      success: true,
      data: {
        session_id: sessionId,
        user_id,
        event_id,
        ticket_ids,
        amount,
        expires_at: expiresAt,
      },
    });
  } catch (err) {
    next(err);
  }
};

const processPayment = async (req, res, next) => {
  try {
    logger.info('📥 Received processPayment request:', {
      body: req.body,
      session_id: req.body?.session_id,
      payment_method: req.body?.payment_method,
      has_otp: !!req.body?.otp
    });

    const { session_id, payment_method, otp } = req.body;

    if (!session_id || session_id === 'undefined' || session_id === 'null') {
      logger.error('❌ Invalid session_id:', session_id);
      throw new ValidationError('session_id is required and must be valid');
    }

    if (!payment_method) {
      logger.error('❌ Missing payment_method');
      throw new ValidationError('payment_method is required');
    }

    if (!otp) {
      logger.error('❌ Missing OTP');
      throw new ValidationError('OTP code is required');
    }

    logger.info(`🔍 Looking for payment session: ${session_id}`);

    // Get payment session
    const [sessions] = await db.query('SELECT * FROM payment_sessions WHERE session_id = ?', [session_id]);
    
    logger.info(`📊 Found ${sessions.length} session(s) with id: ${session_id}`);
    
    if (sessions.length === 0) {
      logger.error(`❌ Payment session not found: ${session_id}`);
      // Try to find any recent sessions for debugging
      const [allSessions] = await db.query('SELECT session_id, user_id, status, expires_at FROM payment_sessions ORDER BY created_at DESC LIMIT 5');
      logger.info('📋 Recent payment sessions:', allSessions);
      throw new NotFoundError('Payment session not found. The session may have expired or been deleted.');
    }

    const session = sessions[0];
    const sessionAmount = Number(session.amount);
    if (Number.isNaN(sessionAmount)) {
      logger.error('❌ Session amount is not a number', { session_id, raw_amount: session.amount });
      throw new ValidationError('Invalid session amount');
    }
    session.amount = sessionAmount;
    logger.info(`Processing payment for session: ${session_id}, status: ${session.status}, expires_at: ${session.expires_at}`);

    if (session.status !== 'pending') {
      if (session.status === 'completed') {
        throw new ValidationError('Payment session has already been completed. Please check your tickets.');
      } else {
        throw new ValidationError(`Payment session is ${session.status}, not pending`);
      }
    }

    if (new Date(session.expires_at) < new Date()) {
      throw new ValidationError('Payment session has expired. Please create a new order.');
    }

    // Get user balance
    const userResponse = await axios.get(`${process.env.USER_SERVICE_URL}/users/${session.user_id}`);
    const user = userResponse.data.data;
    const userBalance = Number(user.Amount);
    if (Number.isNaN(userBalance)) {
      logger.error('❌ User balance is not a number', { user_id: session.user_id, raw_amount: user.Amount });
      throw new ValidationError('Invalid user balance');
    }
    user.Amount = userBalance;

    // Verify OTP
    try {
      if (!process.env.OTP_SERVICE_URL) {
        logger.error('❌ OTP_SERVICE_URL is not configured in environment variables');
        throw new ValidationError('OTP service is not configured. Please check server configuration.');
      }
      
      const otpServiceUrl = `${process.env.OTP_SERVICE_URL}/otp/verify`;
      logger.info(`🔐 Verifying OTP for user ${user.Gmail} with code: ${otp}`);
      logger.info(`🔐 OTP Service URL: ${otpServiceUrl}`);
      
      const otpResponse = await axios.post(otpServiceUrl, {
        email: user.Gmail,
        code: otp,
      });
      
      logger.info('📥 OTP verification response:', {
        status: otpResponse.status,
        data: otpResponse.data
      });
      
      if (!otpResponse.data || !otpResponse.data.success) {
        logger.error('❌ OTP verification returned success: false', otpResponse.data);
        throw new ValidationError(otpResponse.data?.message || 'Invalid or expired OTP code');
      }
      logger.info(`✅ OTP verified successfully for user ${user.Gmail}`);
    } catch (otpError) {
      logger.error('❌ OTP verification failed:', {
        message: otpError.message,
        response: otpError.response?.data,
        status: otpError.response?.status,
        statusText: otpError.response?.statusText,
        url: otpError.config?.url
      });
      
      if (otpError.response?.status === 400 || otpError.response?.status === 404) {
        const errorMessage = otpError.response?.data?.message || 'Invalid or expired OTP code';
        logger.error(`❌ OTP verification error: ${errorMessage}`);
        throw new ValidationError(errorMessage);
      }
      
      if (otpError.code === 'ECONNREFUSED' || otpError.code === 'ETIMEDOUT') {
        logger.error('❌ Cannot connect to OTP service');
        throw new ValidationError('Không thể kết nối đến dịch vụ OTP. Vui lòng thử lại sau.');
      }
      
      throw new ValidationError(otpError.response?.data?.message || 'OTP verification failed. Please try again.');
    }

    // Process payment
    let transactionId = uuidv4();
    let status = 'completed';
    let emailSent = false; // Initialize emailSent outside the if block
    let purchasedTickets = []; // Initialize purchasedTickets outside the if block

    if (payment_method === 'wallet') {
      // Check balance
      logger.info('💰 Checking user balance before payment', {
        user_id: session.user_id,
        user_balance: user.Amount,
        session_amount: session.amount,
      });

      if (user.Amount < session.amount) {
        status = 'failed';
        await db.query(
          'INSERT INTO transactions (transaction_id, user_id, event_id, amount, status, payment_method, type) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [transactionId, session.user_id, session.event_id, session.amount, 'failed', payment_method, 'payment']
        );
        await db.query('UPDATE payment_sessions SET status = ? WHERE session_id = ?', ['failed', session_id]);
        throw new ValidationError('Insufficient balance');
      }

      // Deduct from wallet BEFORE creating transaction
      try {
        const balanceResponse = await axios.put(`${process.env.USER_SERVICE_URL}/users/${session.user_id}/balance`, {
          amount: session.amount,
          type: 'withdraw',
        });
        logger.info(`Balance deducted successfully for user ${session.user_id}: ${session.amount}`);
      } catch (balanceError) {
        logger.error('Error deducting balance:', balanceError.response?.data || balanceError.message);
        status = 'failed';
        await db.query(
          'INSERT INTO transactions (transaction_id, user_id, event_id, amount, status, payment_method, type) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [transactionId, session.user_id, session.event_id, session.amount, 'failed', payment_method, 'payment']
        );
        await db.query('UPDATE payment_sessions SET status = ? WHERE session_id = ?', ['failed', session_id]);
        throw new ValidationError('Failed to deduct balance. Please try again.');
      }
    }

    // Create transaction AFTER successful balance deduction
    await db.query(
      'INSERT INTO transactions (transaction_id, user_id, event_id, amount, status, payment_method, type) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [transactionId, session.user_id, session.event_id, session.amount, status, payment_method, 'payment']
    );

    // Update session status to completed
    await db.query('UPDATE payment_sessions SET status = ? WHERE session_id = ?', [status, session_id]);
    logger.info(`Payment session ${session_id} updated to status: ${status}`);

    // Create purchased tickets and update event availability
    if (status === 'completed') {
      const ticketIds = JSON.parse(session.ticket_ids);
      
      // Update event available quantity
      try {
        await axios.put(`${process.env.EVENT_SERVICE_URL}/events/${session.event_id}/availability`, {
          quantity: ticketIds.length,
          action: 'decrease',
        });
      } catch (err) {
        logger.error('Error updating event availability:', err);
      }

      // Create purchased tickets
      purchasedTickets = []; // Reset array
      for (const ticketId of ticketIds) {
        const purchasedId = `VM${Date.now()}${Math.random().toString(36).substr(2, 5)}`;
        // Generate QR code but don't store the full base64 string (too long for varchar(255))
        // Instead, we'll generate it on-demand from Purchased_ID when needed
        // Store only the Purchased_ID as QR_Code identifier
        const qrCodeIdentifier = purchasedId; // Use Purchased_ID as identifier

        await db.query(
          `INSERT INTO purchased_tickets (Purchased_ID, Ticket_ID, User_ID, QR_Code, Transaction_ID)
           VALUES (?, ?, ?, ?, ?)`,
          [purchasedId, ticketId, session.user_id, qrCodeIdentifier, transactionId]
        );
        
        purchasedTickets.push({
          ticketId: purchasedId,
        });
      }

      // Get event details for invoice
      try {
        const eventResponse = await axios.get(`${process.env.EVENT_SERVICE_URL}/events/${session.event_id}`);
        const event = eventResponse.data.data;

        // Send invoice email to user
        if (user.Gmail) {
          try {
            const emailResult = await sendInvoiceEmail(user.Gmail, {
              transactionId,
              eventName: event.Event_Name || 'Sự kiện',
              ticketQuantity: ticketIds.length,
              pricePerTicket: event.Price_Ticket || session.amount / ticketIds.length,
              totalAmount: session.amount,
              purchaseDate: new Date(),
              eventDate: event.Start_DateTime,
              eventAddress: event.Address,
              tickets: purchasedTickets,
            });
            
            if (emailResult && emailResult.success) {
              emailSent = true;
              logger.info(`Invoice email sent to ${user.Gmail} for transaction ${transactionId}`);
            } else {
              logger.warn(`Failed to send invoice email to ${user.Gmail} for transaction ${transactionId}: ${emailResult?.message || 'Email service not configured'}`);
            }
          } catch (emailError) {
            logger.error(`Error sending invoice email to ${user.Gmail} for transaction ${transactionId}:`, emailError.message || emailError);
            // Don't fail the payment if email fails - payment is already successful
          }
        }
      } catch (err) {
        logger.error('Error getting event details for invoice:', err);
      }
    }

    const response = {
      success: true,
      data: {
        status: status === 'completed' ? 'success' : status,
        transaction_id: transactionId,
        amount: session.amount,
        purchased_ticket_ids: status === 'completed' ? purchasedTickets.map(t => t.ticketId) : [],
      },
    };

    // Add warning if email was not sent (but payment succeeded)
    if (status === 'completed' && user.Gmail && !emailSent) {
      response.warning = 'Thanh toán thành công nhưng không thể gửi email hóa đơn. Vui lòng kiểm tra cấu hình email.';
    }

    logger.info(`Payment processed successfully: session_id=${session_id}, transaction_id=${transactionId}, status=${status}`);
    res.json(response);
  } catch (err) {
    next(err);
  }
};

const getPaymentStatus = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [rows] = await db.query('SELECT * FROM transactions WHERE transaction_id = ?', [id]);
    if (rows.length === 0) {
      throw new NotFoundError('Transaction');
    }

    res.json({ success: true, data: rows[0] });
  } catch (err) {
    next(err);
  }
};

const getUserTransactions = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [rows] = await db.query(
      'SELECT * FROM transactions WHERE user_id = ? ORDER BY created_at DESC',
      [id]
    );

    res.json({ success: true, data: rows });
  } catch (err) {
    next(err);
  }
};

const getPurchasedTickets = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [rows] = await db.query(
      'SELECT * FROM purchased_tickets WHERE User_ID = ? ORDER BY Date_Purchase DESC',
      [id]
    );

    res.json({ success: true, data: rows });
  } catch (err) {
    next(err);
  }
};

const getTicketById = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Get purchased ticket
    const [tickets] = await db.query(
      'SELECT * FROM purchased_tickets WHERE Purchased_ID = ?',
      [id]
    );

    if (tickets.length === 0) {
      throw new NotFoundError('Ticket not found');
    }

    const ticket = tickets[0];

    // Get event information from transaction
    let event = null;
    if (ticket.Transaction_ID) {
      try {
        const [transactions] = await db.query(
          'SELECT event_id FROM transactions WHERE transaction_id = ?',
          [ticket.Transaction_ID]
        );
        if (transactions.length > 0 && transactions[0].event_id) {
          const eventResponse = await axios.get(`${process.env.EVENT_SERVICE_URL}/events/${transactions[0].event_id}`);
          event = eventResponse.data?.data || eventResponse.data;
          logger.info(`✅ Fetched event ${transactions[0].event_id} from transaction for ticket ${id}`);
        } else {
          logger.warn(`No transaction found with ID ${ticket.Transaction_ID}`);
        }
      } catch (err) {
        logger.error('Could not fetch event from transaction:', err.message);
      }
    } else {
      logger.warn(`Ticket ${id} has no Transaction_ID`);
    }

    // Get user information
    let userInfo = null;
    if (ticket.User_ID) {
      try {
        const userResponse = await axios.get(`${process.env.USER_SERVICE_URL}/users/${ticket.User_ID}`);
        userInfo = userResponse.data?.data || userResponse.data;
      } catch (err) {
        logger.warn('Could not fetch user info:', err.message);
      }
    }

    res.json({
      success: true,
      data: {
        ...ticket,
        Event: event,
        User: userInfo,
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createPaymentSession,
  processPayment,
  getPaymentStatus,
  getUserTransactions,
  getPurchasedTickets,
  getTicketById,
};

