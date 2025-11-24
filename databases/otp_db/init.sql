-- OTP Service Database
-- UTF-8 support for Vietnamese characters

CREATE DATABASE IF NOT EXISTS otp_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE otp_db;

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";
SET NAMES utf8mb4;

-- OTP codes table
CREATE TABLE IF NOT EXISTS `otp_codes` (
  `otp_id` varchar(255) NOT NULL,
  `user_id` varchar(20) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `code` varchar(10) NOT NULL,
  `type` varchar(20) NOT NULL,
  `expires_at` datetime NOT NULL,
  `used` tinyint(1) DEFAULT 0,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`otp_id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_email` (`email`),
  KEY `idx_phone` (`phone`),
  KEY `idx_code` (`code`),
  KEY `idx_expires_at` (`expires_at`),
  KEY `idx_used` (`used`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

