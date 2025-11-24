const amqp = require('amqplib');
const logger = require('../../../shared/utils/logger');
const db = require('./database');
const axios = require('axios');

let channel = null;

const initRabbitMQ = async () => {
  try {
    // Xác định RabbitMQ URL dựa trên môi trường
    let rabbitmqUrl = process.env.RABBITMQ_URL;
    
    if (!rabbitmqUrl) {
      // Kiểm tra xem có đang chạy trong Docker không
      // Nếu không có RABBITMQ_URL, thử localhost trước (cho local development)
      const isDocker = process.env.DOCKER_ENV === 'true' || process.env.COMPOSE_PROJECT_NAME;
      
      if (isDocker) {
        // Trong Docker, dùng hostname rabbitmq
        rabbitmqUrl = 'amqp://admin:admin123@rabbitmq:5672';
      } else {
        // Chạy local, dùng localhost
        rabbitmqUrl = 'amqp://admin:admin123@localhost:5672';
      }
    }
    
    logger.info(`Connecting to RabbitMQ: ${rabbitmqUrl.replace(/:[^:@]+@/, ':****@')}`);
    
    const connection = await amqp.connect(rabbitmqUrl);
    channel = await connection.createChannel();

    // Declare queues
    await channel.assertQueue('notifications', { durable: true });

    // Consume messages
    channel.consume('notifications', async (msg) => {
      if (msg) {
        try {
          const notification = JSON.parse(msg.content.toString());
          await processNotification(notification);
          channel.ack(msg);
        } catch (err) {
          logger.error('Error processing notification:', err);
          channel.nack(msg, false, false);
        }
      }
    });

    logger.info('RabbitMQ connected and consuming messages');
  } catch (err) {
    logger.error('RabbitMQ connection error:', err);
    logger.warn('Notification service will continue without RabbitMQ. Notifications via queue will not work.');
    logger.warn('To fix: Start RabbitMQ or set RABBITMQ_URL environment variable.');
    // Không throw error - service vẫn có thể chạy được mà không có RabbitMQ
    // Các tính năng khác của notification service vẫn hoạt động
  }
};

const processNotification = async (notification) => {
  const { user_id, type, title, content, data } = notification;

  // Save to database
  const notificationId = require('uuid').v4();
  await db.query(
    `INSERT INTO notifications (notification_id, user_id, type, title, content, status)
     VALUES (?, ?, ?, ?, ?, 'unread')`,
    [notificationId, user_id, type, title, content]
  );

  // Send via OTP service if needed
  if (type === 'otp') {
    await axios.post(`${process.env.OTP_SERVICE_URL}/otp/send`, {
      email: data.email,
      type: 'email',
    });
  }

  logger.info(`Notification sent to user ${user_id}: ${title}`);
};

module.exports = { initRabbitMQ, channel };

