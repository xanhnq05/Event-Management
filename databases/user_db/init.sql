-- User Service Database
-- UTF-8 support for Vietnamese characters

CREATE DATABASE IF NOT EXISTS user_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE user_db;

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";
SET NAMES utf8mb4;

-- Users table
CREATE TABLE IF NOT EXISTS `users` (
  `User_ID` varchar(20) NOT NULL,
  `FullName` varchar(255) NOT NULL,
  `Birthday` date DEFAULT NULL,
  `Sex` varchar(10) DEFAULT NULL,
  `Address` varchar(255) DEFAULT NULL,
  `Phone` varchar(20) DEFAULT NULL,
  `Gmail` varchar(100) DEFAULT NULL,
  `Avatar_URL` varchar(500) DEFAULT NULL,
  `Amount` decimal(15,2) DEFAULT 0.00,
  `Account` varchar(100) DEFAULT NULL,
  `Password` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`User_ID`),
  UNIQUE KEY `idx_account` (`Account`),
  UNIQUE KEY `idx_gmail` (`Gmail`),
  KEY `idx_phone` (`Phone`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- User preferences table
CREATE TABLE IF NOT EXISTS `user_preferences` (
  `preference_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` varchar(20) NOT NULL,
  `preference_key` varchar(100) NOT NULL,
  `preference_value` varchar(1000) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`preference_id`),
  UNIQUE KEY `idx_user_key` (`user_id`, `preference_key`),
  KEY `idx_user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- User profiles table (extended info)
CREATE TABLE IF NOT EXISTS `user_profiles` (
  `profile_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` varchar(20) NOT NULL,
  `bio` varchar(2000) DEFAULT NULL,
  `interests` varchar(2000) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`profile_id`),
  UNIQUE KEY `idx_user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert sample users (passwords are hashed with bcrypt: 123456)
INSERT INTO `users` (`User_ID`, `FullName`, `Birthday`, `Sex`, `Address`, `Phone`, `Gmail`, `Avatar_URL`, `Amount`, `Account`, `Password`) VALUES
('ND01', 'Võ Thái Tuấn', '2015-11-09', 'Nam', 'Quận 06, Thành Phố Hồ Chí Minh', '0899506263', 'vothaituan@gmail.com', NULL, 0.00, 'vothaituan', '$2b$10$r0U8aMuvvHu/AUe/5vHsLeDzcA5rNqpJ/d8PujTxoCwLxtMSGrPOG'),
('ND02', 'Nguyễn Quốc Xanh', '2016-11-16', 'Nam', 'Nhà Bè, Thành Phố Hồ Chí Minh', '0846521263', 'nguyenquocxanh@gmail.com', NULL, 0.00, 'nguyenquocxanh', '$2b$10$r0U8aMuvvHu/AUe/5vHsLeDzcA5rNqpJ/d8PujTxoCwLxtMSGrPOG'),
('ND03', 'Nguyễn Thanh Tú', '2017-11-08', 'Nam', 'Nhà Bè, Thành Phố Hồ Chí Minh', '0863263564', 'nguyenthanhtu@gmail.com', NULL, 0.00, 'nguyenthanhtu', '$2b$10$r0U8aMuvvHu/AUe/5vHsLeDzcA5rNqpJ/d8PujTxoCwLxtMSGrPOG'),
('ND04', 'Phan Tuấn Vỹ', '2016-11-23', 'Nam', 'Quận 07, Thành Phố Hồ Chí Minh', '0862456352', 'phantuanvy@gmail.com', NULL, 0.00, 'phantuanvy', '$2b$10$r0U8aMuvvHu/AUe/5vHsLeDzcA5rNqpJ/d8PujTxoCwLxtMSGrPOG'),
('ND05', 'Nguyễn Thanh Tùng', '2016-11-16', 'Nam', 'Quận 01, Thành Phố Hồ Chí Minh', '0923556413', 'nguyenthanhtung@gmail.com', NULL, 0.00, 'nguyenthanhtung', '$2b$10$r0U8aMuvvHu/AUe/5vHsLeDzcA5rNqpJ/d8PujTxoCwLxtMSGrPOG'),
('ND06', 'Nguyễn Ngọc Minh Thư', '2016-11-23', 'Nữ', 'Quận Thủ Đức, Thành Phố Hồ Chí Minh', '0987643261', 'nguyenngocminhthu@gmail.com', NULL, 0.00, 'nguyenngocminhthu', '$2b$10$r0U8aMuvvHu/AUe/5vHsLeDzcA5rNqpJ/d8PujTxoCwLxtMSGrPOG')
ON DUPLICATE KEY UPDATE `FullName` = VALUES(`FullName`);

