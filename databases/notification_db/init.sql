-- Notification Service Database
-- UTF-8 support for Vietnamese characters

CREATE DATABASE IF NOT EXISTS notification_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE notification_db;

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";
SET NAMES utf8mb4;

-- Notifications table
CREATE TABLE IF NOT EXISTS `notifications` (
  `notification_id` varchar(255) NOT NULL,
  `user_id` varchar(20) NOT NULL,
  `type` varchar(50) NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` varchar(2000) NOT NULL,
  `status` varchar(20) DEFAULT 'unread',
  `read_at` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`notification_id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_status` (`status`),
  KEY `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Notification templates table
CREATE TABLE IF NOT EXISTS `notification_templates` (
  `template_id` varchar(255) NOT NULL,
  `type` varchar(50) NOT NULL,
  `subject` varchar(255) NOT NULL,
  `body` varchar(2000) NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`template_id`),
  UNIQUE KEY `idx_type` (`type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- User notification preferences table
CREATE TABLE IF NOT EXISTS `user_notification_preferences` (
  `preference_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` varchar(20) NOT NULL,
  `email_enabled` tinyint(1) DEFAULT 1,
  `sms_enabled` tinyint(1) DEFAULT 1,
  `push_enabled` tinyint(1) DEFAULT 1,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`preference_id`),
  UNIQUE KEY `idx_user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default notification templates
INSERT INTO `notification_templates` (`template_id`, `type`, `subject`, `body`) VALUES
('T01', 'welcome', 'Chào mừng đến với Event Management', 'Xin chào {{fullName}}, cảm ơn bạn đã đăng ký tài khoản!'),
('T02', 'payment_success', 'Thanh toán thành công', 'Bạn đã thanh toán thành công {{amount}} VNĐ cho sự kiện {{eventName}}'),
('T03', 'payment_failed', 'Thanh toán thất bại', 'Thanh toán của bạn cho sự kiện {{eventName}} đã thất bại. Vui lòng thử lại.'),
('T04', 'event_created', 'Sự kiện mới đã được tạo', 'Sự kiện {{eventName}} đã được tạo thành công'),
('T05', 'ticket_purchased', 'Mua vé thành công', 'Bạn đã mua vé thành công cho sự kiện {{eventName}}. Mã QR: {{qrCode}}')
ON DUPLICATE KEY UPDATE `subject` = VALUES(`subject`);

