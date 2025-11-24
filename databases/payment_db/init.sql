-- Payment Service Database
-- UTF-8 support for Vietnamese characters

CREATE DATABASE IF NOT EXISTS payment_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE payment_db;

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";
SET NAMES utf8mb4;

-- Transactions table
CREATE TABLE IF NOT EXISTS `transactions` (
  `transaction_id` varchar(255) NOT NULL,
  `user_id` varchar(20) NOT NULL,
  `event_id` varchar(20) DEFAULT NULL,
  `amount` decimal(15,2) NOT NULL,
  `status` varchar(20) DEFAULT 'pending',
  `payment_method` varchar(50) DEFAULT NULL,
  `type` varchar(20) DEFAULT 'payment',
  `description` varchar(1000) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`transaction_id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_event_id` (`event_id`),
  KEY `idx_status` (`status`),
  KEY `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Payment sessions table
CREATE TABLE IF NOT EXISTS `payment_sessions` (
  `session_id` varchar(255) NOT NULL,
  `user_id` varchar(20) NOT NULL,
  `event_id` varchar(20) NOT NULL,
  `ticket_ids` varchar(500) DEFAULT NULL,
  `amount` decimal(15,2) NOT NULL,
  `expires_at` datetime NOT NULL,
  `status` varchar(20) DEFAULT 'pending',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`session_id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_event_id` (`event_id`),
  KEY `idx_expires_at` (`expires_at`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Refunds table
CREATE TABLE IF NOT EXISTS `refunds` (
  `refund_id` varchar(255) NOT NULL,
  `transaction_id` varchar(255) NOT NULL,
  `amount` decimal(15,2) NOT NULL,
  `reason` varchar(1000) DEFAULT NULL,
  `status` varchar(20) DEFAULT 'pending',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`refund_id`),
  KEY `idx_transaction_id` (`transaction_id`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Purchased tickets table (synchronized from event service)
CREATE TABLE IF NOT EXISTS `purchased_tickets` (
  `Purchased_ID` varchar(20) NOT NULL,
  `Ticket_ID` varchar(20) DEFAULT NULL,
  `User_ID` varchar(20) DEFAULT NULL,
  `Date_Purchase` datetime DEFAULT CURRENT_TIMESTAMP,
  `QR_Code` varchar(255) DEFAULT NULL,
  `CheckIn_Status` tinyint(1) DEFAULT 0,
  `Transaction_ID` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`Purchased_ID`),
  UNIQUE KEY `idx_qr_code` (`QR_Code`),
  KEY `idx_ticket_id` (`Ticket_ID`),
  KEY `idx_user_id` (`User_ID`),
  KEY `idx_transaction_id` (`Transaction_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

