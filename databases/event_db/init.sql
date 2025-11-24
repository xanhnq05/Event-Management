-- Event Service Database
-- UTF-8 support for Vietnamese characters

CREATE DATABASE IF NOT EXISTS event_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE event_db;

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";
SET NAMES utf8mb4;

-- Categories table
CREATE TABLE IF NOT EXISTS `categories` (
  `Category_ID` varchar(20) NOT NULL,
  `Category_Name` varchar(100) NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`Category_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Artists table
CREATE TABLE IF NOT EXISTS `artists` (
  `Artist_ID` varchar(20) NOT NULL,
  `Artist_Name` varchar(255) NOT NULL,
  `Email` varchar(100) DEFAULT NULL,
  `Phone` varchar(20) DEFAULT NULL,
  `Image_URL` varchar(500) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`Artist_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Events table
CREATE TABLE IF NOT EXISTS `events` (
  `Event_ID` varchar(20) NOT NULL,
  `Event_Name` varchar(255) NOT NULL,
  `Description` varchar(2000) DEFAULT NULL,
  `Start_DateTime` datetime DEFAULT NULL,
  `End_DateTime` datetime DEFAULT NULL,
  `Price_Ticket` decimal(10,2) DEFAULT NULL,
  `Quantity` int(11) DEFAULT NULL,
  `Available_Quantity` int(11) DEFAULT NULL,
  `Address` varchar(255) DEFAULT NULL,
  `Image_URL` varchar(500) DEFAULT NULL,
  `User_ID` varchar(20) DEFAULT NULL,
  `Category_ID` varchar(20) DEFAULT NULL,
  `Status` varchar(20) DEFAULT 'active',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`Event_ID`),
  KEY `idx_user_id` (`User_ID`),
  KEY `idx_category_id` (`Category_ID`),
  KEY `idx_start_datetime` (`Start_DateTime`),
  KEY `idx_status` (`Status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Event-Artist relationship table
CREATE TABLE IF NOT EXISTS `event_artists` (
  `Event_ID` varchar(20) NOT NULL,
  `Artist_ID` varchar(20) NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`Event_ID`, `Artist_ID`),
  KEY `idx_artist_id` (`Artist_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tickets table
CREATE TABLE IF NOT EXISTS `tickets` (
  `Ticket_ID` varchar(20) NOT NULL,
  `Ticket_Name` varchar(100) DEFAULT NULL,
  `Event_ID` varchar(20) DEFAULT NULL,
  `Status` varchar(20) DEFAULT 'available',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`Ticket_ID`),
  KEY `idx_event_id` (`Event_ID`),
  KEY `idx_status` (`Status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- User favorites table
CREATE TABLE IF NOT EXISTS `user_favorites` (
  `favorite_id` int(11) NOT NULL AUTO_INCREMENT,
  `User_ID` varchar(20) NOT NULL,
  `Event_ID` varchar(20) NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`favorite_id`),
  UNIQUE KEY `idx_user_event` (`User_ID`, `Event_ID`),
  KEY `idx_user_id` (`User_ID`),
  KEY `idx_event_id` (`Event_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert categories
INSERT INTO `categories` (`Category_ID`, `Category_Name`) VALUES
('DM01', 'Ẩm thực'),
('DM02', 'Giải trí'),
('DM03', 'Giới trẻ'),
('DM04', 'Âm nhạc'),
('DM05', 'Ngoài trời'),
('DM06', 'Thể thao'),
('DM07', 'EDM'),
('DM08', 'Rock'),
('DM09', 'Thức ăn nhanh'),
('DM10', 'Hóa trang'),
('DM11', 'Vận động trên sông'),
('DM12', 'Nghệ thuật ánh sáng'),
('DM13', 'Tuyển dụng'),
('DM14', 'Tìm kiếm việc làm'),
('DM15', 'Thực tập'),
('DM16', 'Công việc'),
('DM17', 'Vui chơi'),
('DM18', 'Ca hát'),
('DM19', 'Đua thuyền'),
('DM20', 'Nhạc nước')
ON DUPLICATE KEY UPDATE `Category_Name` = VALUES(`Category_Name`);

-- Insert artists
INSERT INTO `artists` (`Artist_ID`, `Artist_Name`, `Email`, `Phone`, `Image_URL`) VALUES
('NS01', 'Sơn Tùng MTP', 'nguyenthanhtung@gmail.com', '0895623166', NULL),
('NS02', 'Quang Hùng Master D', 'hung@gmail.com', '0865923652', NULL),
('NS03', 'Mono', 'mono@gmail.com', '0956235641', NULL),
('NS04', 'Hiếu Thứ 2', 'tranminhieu@gmail.com', '0956235413', NULL),
('NS05', 'Andree Right Hand', 'andree@gmail.com', '0956321465', NULL),
('NS06', 'Soobin Hoàng Sơn', 'soobin@gmail.com', '0948562130', NULL),
('NS07', 'Phương Ly', 'phuongly@gmail.com', '0945625896', NULL),
('NS08', 'Lyly', 'nguyenhoangly@gmail.com', '0941235123', NULL),
('NS09', 'Bích Phương', 'bichphuong@gmail.com', '0984561356', NULL),
('NS10', 'Jack - J97', 'trinhtranphuongtuan@gmail.com', '0948253165', NULL)
ON DUPLICATE KEY UPDATE `Artist_Name` = VALUES(`Artist_Name`);

-- Insert events
INSERT INTO `events` (`Event_ID`, `Event_Name`, `Description`, `Start_DateTime`, `End_DateTime`, `Price_Ticket`, `Quantity`, `Available_Quantity`, `Address`, `Image_URL`, `User_ID`, `Category_ID`, `Status`) VALUES
('SK01', 'Lễ hội âm nhạc', 'Lễ hội âm nhạc quy tụ rất nhiều các tiết mục âm nhạc đặc sắc cùng với đó là màn hòa tấu của tất cả các loại nhạc cụ khác nhau.', '2025-11-21 23:45:00', '2025-11-22 02:00:00', 1000000.00, 200, 200, 'Phố Đi Bộ Nguyễn Huệ, Quận 01, Thành Phố Hồ Chí Minh', NULL, 'ND01', 'DM02', 'active'),
('SK02', 'Ẩm thực đường phố', 'Nơi quy tụ các món ăn đa dạng khác nhau đến từ các vùng miền khác nhau trên cả nước.', '2025-11-28 23:45:00', '2025-11-29 23:45:00', 1000000.00, 250, 250, 'Công viên bến Bạch Đằng, Quận 01, Thành Phố Hồ Chí Minh', NULL, 'ND02', 'DM01', 'active'),
('SK03', 'Ca nhạc và pháo hoa chào đón năm mới 2026', 'Đêm nhạc bùng nổ cùng với màn biểu diễn pháo hoa chào đón năm mới 2026.', '2025-12-31 23:48:09', '2026-01-01 01:00:00', 5000000.00, 500, 500, 'Phố Đi Bộ Nguyễn Huệ, Quận 01, Thành Phố Hồ Chí Minh', NULL, 'ND03', 'DM05', 'active'),
('SK04', 'Biểu diễn drone nghệ thuật', 'Màn biểu diễn hàng ngàn thiết bị bay drone vô cùng độc đáo và sáng tạo.', '2025-12-03 23:48:09', '2025-12-04 00:30:00', 1000000.00, 500, 500, 'Phố Đi Bộ Nguyễn Huệ, Quận 01, Thành Phố Hồ Chí Minh', NULL, 'ND04', 'DM12', 'active'),
('SK05', 'Ngày hội việc làm', 'Tạo điều kiện cho các bạn sinh viên có cơ hội được tham gia thực tập, trao đổi các kinh nghiệm và có được những kiến thức bổ ích.', '2025-11-29 23:52:37', '2025-11-30 17:00:00', 1000000.00, 600, 600, 'Trường Đại Học Tôn Đức Thắng, Đường Nguyễn Hữu Thọ, Phường Tân Hưng, Quận 07, Thành Phố Hồ Chí Minh', NULL, 'ND05', 'DM16', 'active'),
('SK06', 'Biểu diễn nhạc nước nghệ thuật', 'Một sự kiện đáng được chờ đợi cùng màn kết hợp nhạc nước được hòa tấu theo phong cách hiện đại và nhịp nhàng.', '2025-12-04 23:52:37', '2025-12-05 00:30:00', 1000000.00, 450, 450, 'Phố Đi Bộ Nguyễn Huệ, Quận 01, Thành Phố Hồ Chí Minh', NULL, 'ND06', 'DM12', 'active'),
('SK07', 'Halloween đường phố', 'Ngày hội hóa trang của tất cả mọi người trên thế giới, mang đến nhiều phiên bản cosplay mang đậm tính kinh dị.', '2025-12-02 23:56:42', '2025-12-03 02:00:00', 5000000.00, 300, 300, 'Công viên nước Đầm Sen, Quận 10, Thành Phố Hồ Chí Minh', NULL, 'ND01', 'DM10', 'active'),
('SK08', 'Ngày hội đua thuyền', 'Sức mạnh tập thể là thứ có thể đánh bại mọi thứ, cùng chờ đợi màn so tài trên sông vô cùng kịch tính.', '2025-12-04 23:56:42', '2025-12-05 18:00:00', 5000000.00, 450, 450, 'Công viên bến Bạch Đằng, Quận 01, Thành Phố Hồ Chí Minh', NULL, 'ND02', 'DM11', 'active'),
('SK09', 'Chương trình chào đón năm mới 2026', 'Những màn bắn phóa hoa vô cùng rực rỡ, đẹp mắt mang đến màn kết hợp vô vùng rực rỡ.', '2025-12-31 00:00:03', '2026-01-01 01:00:00', 5000000.00, 300, 300, 'Phố Đi Bộ Nguyễn Huệ, Quận 01, Thành Phố Hồ Chí Minh', NULL, 'ND03', 'DM17', 'active'),
('SK10', 'Ngày hội giáng sinh', 'Giáng sinh mang đến sự ấm áp, trong lành cũng những tiếng lắng động của tuyết.', '2025-12-25 23:56:42', '2025-12-26 02:00:00', 5000000.00, 450, 450, 'Dinh Độc Lập, Đường Nam Kỳ Khởi Nghĩa, Phường Bến Thành, Thành Phố Hồ Chí Minh', NULL, 'ND04', 'DM05', 'active')
ON DUPLICATE KEY UPDATE `Event_Name` = VALUES(`Event_Name`);

-- Insert event-artist relationships
INSERT INTO `event_artists` (`Event_ID`, `Artist_ID`) VALUES
('SK01', 'NS01'), ('SK01', 'NS02'), ('SK01', 'NS03'), ('SK01', 'NS04'), ('SK01', 'NS05'),
('SK02', 'NS06'), ('SK02', 'NS07'), ('SK02', 'NS08'), ('SK02', 'NS09'), ('SK02', 'NS10'),
('SK03', 'NS02'), ('SK03', 'NS03'), ('SK03', 'NS04'), ('SK03', 'NS06'), ('SK03', 'NS07'),
('SK04', 'NS01'), ('SK04', 'NS05'), ('SK04', 'NS06'), ('SK04', 'NS08'), ('SK04', 'NS09'),
('SK05', 'NS02'), ('SK05', 'NS03'), ('SK05', 'NS04'), ('SK05', 'NS05'), ('SK05', 'NS06'),
('SK06', 'NS01'), ('SK06', 'NS03'), ('SK06', 'NS04'), ('SK06', 'NS08'), ('SK06', 'NS10'),
('SK07', 'NS01'), ('SK07', 'NS03'), ('SK07', 'NS04'), ('SK07', 'NS06'), ('SK07', 'NS08'),
('SK08', 'NS03'), ('SK08', 'NS04'), ('SK08', 'NS05'), ('SK08', 'NS06'), ('SK08', 'NS08'),
('SK09', 'NS01'), ('SK09', 'NS02'), ('SK09', 'NS03'), ('SK09', 'NS06'), ('SK09', 'NS08'),
('SK10', 'NS01'), ('SK10', 'NS04'), ('SK10', 'NS05'), ('SK10', 'NS06'), ('SK10', 'NS08')
ON DUPLICATE KEY UPDATE `Event_ID` = VALUES(`Event_ID`);

-- Insert tickets
INSERT INTO `tickets` (`Ticket_ID`, `Ticket_Name`, `Event_ID`, `Status`) VALUES
('V01', 'Vé sự kiện âm nhạc', 'SK01', 'available'),
('V02', 'Vé ẩm thực đường phố', 'SK02', 'available'),
('V03', 'Ca nhạc và pháo hoa chào đón năm mới 2026', 'SK03', 'available'),
('V04', 'Biểu diễn drone nghệ thuật', 'SK04', 'available'),
('V05', 'Ngày hội việc làm', 'SK05', 'available'),
('V06', 'Biểu diễn nhạc nước nghệ thuật', 'SK06', 'available'),
('V07', 'Halloween đường phố', 'SK07', 'available'),
('V08', 'Ngày hội đua thuyền', 'SK08', 'available'),
('V09', 'Chương trình chào đón năm mới 2026', 'SK09', 'available'),
('V10', 'Ngày hội giáng sinh', 'SK10', 'available')
ON DUPLICATE KEY UPDATE `Ticket_Name` = VALUES(`Ticket_Name`);

