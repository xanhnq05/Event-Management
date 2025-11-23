CREATE DATABASE IF NOT EXISTS qlsk;
USE qlsk;

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

CREATE TABLE `artist` (
  `Artist_ID` varchar(20) NOT NULL,
  `Artist_Name` varchar(255) NOT NULL,
  `Email` varchar(100) DEFAULT NULL,
  `Phone` varchar(20) DEFAULT NULL,
  `Image_URL` varchar(500) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `artist`
--

INSERT INTO `artist` (`Artist_ID`, `Artist_Name`, `Email`, `Phone`, `Image_URL`) VALUES
('NS01', 'Sơn Tùng MTP', 'nguyenthanhtung@gmail.com', '0895623166', NULL),
('NS02', 'Quang Hùng Master D', 'hung@gmail.com', '0865923652', NULL),
('NS03', 'Mono', 'mono@gmail.com', '0956235641', NULL),
('NS04', 'Hiếu Thứ 2', 'tranminhieu@gmail.com', '0956235413', NULL),
('NS05', 'Andree Right Hand', 'andree@gmail.com', '0956321465', NULL),
('NS06', 'Soobin Hoàng Sơn', 'soobin@gmail.com', '0948562130', NULL),
('NS07', 'Phương Ly', 'phuongly@gmail.com', '0945625896', NULL),
('NS08', 'Lyly', 'nguyenhoangly@gmail.com', '0941235123', NULL),
('NS09', 'Bích Phương', 'bichphuong@gmail.com', '0984561356', NULL),
('NS10', 'Jack - J97', 'trinhtranphuongtuan@gmail.com', '0948253165', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `category`
--

CREATE TABLE `category` (
  `Category_ID` varchar(20) NOT NULL,
  `Category_Name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `category`
--

INSERT INTO `category` (`Category_ID`, `Category_Name`) VALUES
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
('DM20', 'Nhạc nước');

-- --------------------------------------------------------

--
-- Table structure for table `event`
--

CREATE TABLE `event` (
  `Event_ID` varchar(20) NOT NULL,
  `Event_Name` varchar(255) NOT NULL,
  `Description` text DEFAULT NULL,
  `Start_DateTime` datetime DEFAULT NULL,
  `End_DateTime` datetime DEFAULT NULL,
  `Price_Ticket` decimal(10,2) DEFAULT NULL,
  `Quantity` int(11) DEFAULT NULL,
  `Address` varchar(255) DEFAULT NULL,
  `Image_URL` varchar(500) DEFAULT NULL,
  `User_ID` varchar(20) DEFAULT NULL,
  `Category_ID` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `event`
--

INSERT INTO `event` (`Event_ID`, `Event_Name`, `Description`, `Start_DateTime`, `End_DateTime`, `Price_Ticket`, `Quantity`, `Address`, `Image_URL`, `User_ID`, `Category_ID`) VALUES
('SK01', 'Lễ hội âm nhạc', 'Lễ hội âm nhạc quy tụ rất nhiều các tiết mục âm nhạc đặc sắc cùng với đó là màn hòa tấu của tất cả các loại nhạc cụ khác nhau.', '2025-11-21 23:45:00', '2025-11-22 02:00:00', 1000000.00, 200, 'Phố Đi Bộ Nguyễn Huệ, Quận 01, Thành Phố Hồ Chí Minh', NULL, 'ND01', 'DM02'),
('SK02', 'Ẩm thực đường phố', 'Nơi quy tụ các món ăn đa dạng khác nhau đến từ các vùng miền khác nhau trên cả nước.', '2025-11-28 23:45:00', '2025-11-29 23:45:00', 1000000.00, 250, 'Công viên bến Bạch Đằng, Quận 01, Thành Phố Hồ Chí Minh', NULL, 'ND02', 'DM01'),
('SK03', 'Ca nhạc và pháo hoa chào đón năm mới 2026', 'Đêm nhạc bùng nổ cùng với màn biểu diễn pháo hoa chào đón năm mới 2026.', '2025-12-31 23:48:09', '2026-01-01 01:00:00', 5000000.00, 500, 'Phố Đi Bộ Nguyễn Huệ, Quận 01, Thành Phố Hồ Chí Minh', NULL, 'ND03', 'DM05'),
('Sk04', 'Biểu diễn drone nghệ thuật', 'Màn biểu diễn hàng ngàn thiết bị bay drone vô cùng độc đáo và sáng tạo.', '2025-12-03 23:48:09', '2025-12-04 00:30:00', 1000000.00, 500, 'Phố Đi Bộ Nguyễn Huệ, Quận 01, Thành Phố Hồ Chí Minh', NULL, 'ND04', 'DM12'),
('SK05', 'Ngày hội việc làm', 'Tạo điều kiện cho các bạn sinh viên có cơ hội được tham gia thực tập, trao đổi các kinh nghiệm và có được những kiến thức bổ ích.', '2025-11-29 23:52:37', '2025-11-30 17:00:00', 1000000.00, 600, 'Trường Đại Học Tôn Đức Thắng, Đường Nguyễn Hữu Thọ, Phường Tân Hưng, Quận 07, Thành Phố Hồ Chí Minh', NULL, 'ND05', 'DM16'),
('SK06', 'Biểu diễn nhạc nước nghệ thuật', 'Một sự kiện đáng được chờ đợi cùng màn kết hợp nhạc nước được hòa tấu theo phong cách hiện đại và nhịp nhàng.', '2025-12-04 23:52:37', '2025-12-05 00:30:00', 1000000.00, 450, 'Phố Đi Bộ Nguyễn Huệ, Quận 01, Thành Phố Hồ Chí Minh', NULL, 'ND06', 'DM12'),
('SK07', 'Halloween đường phố', 'Ngày hội hóa trang của tất cả mọi người trên thế giới, mang đến nhiều phiên bản cosplay mang đậm tính kinh dị.', '2025-12-02 23:56:42', '2025-12-03 02:00:00', 5000000.00, 300, 'Công viên nước Đầm Sen, Quận 10, Thành Phố Hồ Chí Minh', NULL, 'ND01', 'DM10'),
('SK08', 'Ngày hội đua thuyền', 'Sức mạnh tập thể là thứ có thể đánh bại mọi thứ, cùng chờ đợi màn so tài trên sông vô cùng kịch tính.', '2025-12-04 23:56:42', '2025-12-05 18:00:00', 5000000.00, 450, 'Công viên bến Bạch Đằng, Quận 01, Thành Phố Hồ Chí Minh', NULL, 'ND02', 'DM11'),
('SK09', 'Chương trình chào đón năm mới 2026', 'Những màn bắn phóa hoa vô cùng rực rỡ, đẹp mắt mang đến màn kết hợp vô vùng rực rỡ.', '2025-12-31 00:00:03', '2026-01-01 01:00:00', 5000000.00, 300, 'Phố Đi Bộ Nguyễn Huệ, Quận 01, Thành Phố Hồ Chí Minh', NULL, 'ND03', 'DM17'),
('SK10', 'Ngày hội giáng sinh', 'Giáng sinh mang đến sự ấm áp, trong lành cũng những tiếng lắng động của tuyết.', '2025-12-25 23:56:42', '2025-12-26 02:00:00', 5000000.00, 450, 'Dinh Độc Lập, Đường Nam Kỳ Khởi Nghĩa, Phường Bến Thành, Thành Phố Hồ Chí Minh', NULL, 'ND04', 'DM05');

-- --------------------------------------------------------

--
-- Table structure for table `eventartist`
--

CREATE TABLE `eventartist` (
  `Event_ID` varchar(20) NOT NULL,
  `Artist_ID` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `eventartist`
--

INSERT INTO `eventartist` (`Event_ID`, `Artist_ID`) VALUES
('SK01', 'NS01'),
('SK01', 'NS02'),
('SK01', 'NS03'),
('SK01', 'NS04'),
('SK01', 'NS05'),
('SK02', 'NS06'),
('SK02', 'NS07'),
('SK02', 'NS08'),
('SK02', 'NS09'),
('SK02', 'NS10'),
('SK03', 'NS02'),
('SK03', 'NS03'),
('SK03', 'NS04'),
('SK03', 'NS06'),
('SK03', 'NS07'),
('SK04', 'NS01'),
('SK04', 'NS05'),
('SK04', 'NS06'),
('SK04', 'NS08'),
('SK04', 'NS09'),
('SK05', 'NS02'),
('SK05', 'NS03'),
('SK05', 'NS04'),
('SK05', 'NS05'),
('SK05', 'NS06'),
('SK06', 'NS01'),
('SK06', 'NS03'),
('SK06', 'NS04'),
('SK06', 'NS08'),
('SK06', 'NS10'),
('SK07', 'NS01'),
('SK07', 'NS03'),
('SK07', 'NS04'),
('SK07', 'NS06'),
('SK07', 'NS08'),
('SK08', 'NS03'),
('SK08', 'NS04'),
('SK08', 'NS05'),
('SK08', 'NS06'),
('SK08', 'NS08'),
('SK09', 'NS01'),
('SK09', 'NS02'),
('SK09', 'NS03'),
('SK09', 'NS06'),
('SK09', 'NS08'),
('SK10', 'NS01'),
('SK10', 'NS04'),
('SK10', 'NS05'),
('SK10', 'NS06'),
('SK10', 'NS08');

-- --------------------------------------------------------

--
-- Table structure for table `purchasedticket`
--

CREATE TABLE `purchasedticket` (
  `Purchased_ID` varchar(20) NOT NULL,
  `Ticket_ID` varchar(20) DEFAULT NULL,
  `User_ID` varchar(20) DEFAULT NULL,
  `Date_Purchase` datetime DEFAULT current_timestamp(),
  `QR_Code` varchar(255) DEFAULT NULL,
  `CheckIn_Status` tinyint(1) DEFAULT 0 COMMENT '0: Chưa checkin, 1: Đã checkin'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `purchasedticket`
--

INSERT INTO `purchasedticket` (`Purchased_ID`, `Ticket_ID`, `User_ID`, `Date_Purchase`, `QR_Code`, `CheckIn_Status`) VALUES
('VM01', 'V01', 'ND01', '2025-11-19 00:00:00', NULL, 0),
('VM02', 'V02', 'ND02', '2025-11-19 00:00:00', NULL, 0),
('VM03', 'V03', 'ND03', '2025-11-19 00:00:00', NULL, 0),
('VM04', 'V04', 'ND04', '2025-11-19 00:00:00', NULL, 0),
('VM05', 'V05', 'ND05', '2025-11-19 00:00:00', NULL, 0),
('VM06', 'V06', 'ND06', '2025-11-19 00:00:00', NULL, 0),
('VM07', 'V07', 'ND01', '2025-11-19 00:00:00', NULL, 0),
('VM08', 'V08', 'ND04', '2025-11-19 00:00:00', NULL, 0),
('VM09', 'V09', 'ND03', '2025-11-19 00:00:00', NULL, 0),
('VM10', 'V10', 'ND02', '2025-11-19 00:00:00', NULL, 0),
('VM11', 'V03', 'ND01', '2025-11-19 00:00:00', NULL, 0),
('VM12', 'V02', 'ND03', '2025-11-19 00:00:00', NULL, 0),
('VM13', 'V06', 'ND04', '2025-11-19 00:00:00', NULL, 0),
('VM14', 'V07', 'ND05', '2025-11-19 00:00:00', NULL, 0),
('VM15', 'V09', 'ND06', '2025-11-19 00:00:00', NULL, 0),
('VM16', 'V07', 'ND04', '2025-11-19 00:00:00', NULL, 0);

-- --------------------------------------------------------

--
-- Table structure for table `ticket`
--

CREATE TABLE `ticket` (
  `Ticket_ID` varchar(20) NOT NULL,
  `Ticket_Name` varchar(100) DEFAULT NULL,
  `Event_ID` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `ticket`
--

INSERT INTO `ticket` (`Ticket_ID`, `Ticket_Name`, `Event_ID`) VALUES
('V01', 'Vé sự kiện âm nhạc', 'SK01'),
('V02', 'Vé ẩm thực đường phố', 'SK02'),
('V03', 'Ca nhạc và pháo hoa chào đón năm mới 2026', 'SK03'),
('V04', 'Biểu diễn drone nghệ thuật', 'SK04'),
('V05', 'Ngày hội việc làm', 'SK05'),
('V06', 'Biểu diễn nhạc nước nghệ thuật', 'SK06'),
('V07', 'Halloween đường phố', 'SK07'),
('V08', 'Ngày hội đua thuyền', 'SK08'),
('V09', 'Chương trình chào đón năm mới 2026', 'SK09'),
('V10', 'Ngày hội giáng sinh', 'SK10');

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
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
  `Password` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`User_ID`, `FullName`, `Birthday`, `Sex`, `Address`, `Phone`, `Gmail`, `Avatar_URL`, `Amount`, `Account`, `Password`) VALUES
('ND01', 'Võ Thái Tuấn', '2015-11-09', 'Nam', 'Quận 06, Thành Phố Hồ Chí Minh', '0899506263', 'vothaituan@gmail.com', NULL, 0.00, 'vothaituan', '123456'),
('ND02', 'Nguyễn Quốc Xanh', '2016-11-16', 'Nam', 'Nhà Bè, Thành Phố Hồ Chí Minh', '0846521263', 'nguyenquocxanh@gmail.com', NULL, 0.00, 'nguyenquocxanh', '123456'),
('ND03', 'Nguyễn Thanh Tú', '2017-11-08', 'Nam', 'Nhà Bè, Thành Phố Hồ Chí Minh', '0863263564', 'nguyenthanhtu@gmail.com', NULL, 0.00, 'nguyenthanhtu', '123456'),
('ND04', 'Phan Tuấn Vỹ', '2016-11-23', 'Nam', 'Quận 07, Thành Phố Hồ Chí Minh', '0862456352', 'phantuanvy@gmail.com', NULL, 0.00, 'phantuanvy', '123456'),
('ND05', 'Nguyễn Thanh Tùng', '2016-11-16', 'Nam', 'Quận 01, Thành Phố Hồ Chí Minh', '0923556413', 'nguyenthanhtung@gmail.com', NULL, 0.00, 'nguyenthanhtung', '123456'),
('ND06', 'Nguyễn Ngọc Minh Thư', '2016-11-23', 'Nữ', 'Quận Thủ Đức, Thành Phố Hồ Chí Minh', '0987643261', 'nguyenngocminhthu@gmail.com', NULL, 0.00, 'nguyenngocminhthu', '123456');

-- --------------------------------------------------------

--
-- Indexes for dumped tables
--

--
-- Indexes for table `artist`
--
ALTER TABLE `artist`
  ADD PRIMARY KEY (`Artist_ID`);

--
-- Indexes for table `category`
--
ALTER TABLE `category`
  ADD PRIMARY KEY (`Category_ID`);

--
-- Indexes for table `event`
--
ALTER TABLE `event`
  ADD PRIMARY KEY (`Event_ID`),
  ADD KEY `User_ID` (`User_ID`),
  ADD KEY `Category_ID` (`Category_ID`);

--
-- Indexes for table `eventartist`
--
ALTER TABLE `eventartist`
  ADD PRIMARY KEY (`Event_ID`,`Artist_ID`),
  ADD KEY `Artist_ID` (`Artist_ID`);

--
-- Indexes for table `purchasedticket`
--
ALTER TABLE `purchasedticket`
  ADD PRIMARY KEY (`Purchased_ID`),
  ADD UNIQUE KEY `QR_Code` (`QR_Code`),
  ADD KEY `Ticket_ID` (`Ticket_ID`),
  ADD KEY `User_ID` (`User_ID`);

--
-- Indexes for table `ticket`
--
ALTER TABLE `ticket`
  ADD PRIMARY KEY (`Ticket_ID`),
  ADD KEY `Event_ID` (`Event_ID`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`User_ID`),
  ADD UNIQUE KEY `Account` (`Account`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `event`
--
ALTER TABLE `event`
  ADD CONSTRAINT `event_ibfk_1` FOREIGN KEY (`User_ID`) REFERENCES `user` (`User_ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `event_ibfk_2` FOREIGN KEY (`Category_ID`) REFERENCES `category` (`Category_ID`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `eventartist`
--
ALTER TABLE `eventartist`
  ADD CONSTRAINT `eventartist_ibfk_1` FOREIGN KEY (`Event_ID`) REFERENCES `event` (`Event_ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `eventartist_ibfk_2` FOREIGN KEY (`Artist_ID`) REFERENCES `artist` (`Artist_ID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `purchasedticket`
--
ALTER TABLE `purchasedticket`
  ADD CONSTRAINT `purchasedticket_ibfk_1` FOREIGN KEY (`Ticket_ID`) REFERENCES `ticket` (`Ticket_ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `purchasedticket_ibfk_2` FOREIGN KEY (`User_ID`) REFERENCES `user` (`User_ID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `ticket`
--
ALTER TABLE `ticket`
  ADD CONSTRAINT `ticket_ibfk_1` FOREIGN KEY (`Event_ID`) REFERENCES `event` (`Event_ID`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
