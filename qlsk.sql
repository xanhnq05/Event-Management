-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 15, 2025 at 12:37 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `qlsk`
--

-- --------------------------------------------------------

--
-- Table structure for table `artist`
--

CREATE TABLE `artist` (
  `Artist_ID` varchar(20) NOT NULL,
  `Artist_Name` varchar(255) DEFAULT NULL,
  `Email` varchar(100) DEFAULT NULL,
  `Phone` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `artist`
--

INSERT INTO `artist` (`Artist_ID`, `Artist_Name`, `Email`, `Phone`) VALUES
('NS01', 'Sơn Tùng MTP', 'nguyenthanhtung_mtp@gmail.com', '0956823456'),
('NS02', 'Hiếu Thứ 2', 'tranminhhieu@gmail.com', '0947365819'),
('NS03', 'Andree Right Hand', 'andree@gmail.com', '0924538748'),
('NS04', 'Soobin Hoàng Sơn', 'soobin@gmail.com', '0932348138'),
('NS05', 'Bray', 'bray@gmail.com', '0957494720'),
('NS06', 'Quang Hùng MasterD', 'quanghung@gmail.com', '0957395720'),
('NS07', 'LyLy', 'nguyenhoangly@gmail.com', '0984739580'),
('NS08', 'Anh Tú', 'anhtu@gmail.com', '0948390294'),
('NS09', 'Mono', 'mono@gmail.com', '0957395820'),
('NS10', 'Ngô Kiến Huy', 'ngokienhuy@gmail.com', '0938492049'),
('NS11', 'Phương Mỹ Chi', 'phuongmychi@gmail.com', '0930589489'),
('NS12', 'Tăng Duy Tân', 'tangduytan@gmail.com', '0957384957'),
('NS13', 'Bích Phương', 'bichphuong@gmail.com', '0958247980'),
('NS14', 'Hòa Minzy', 'hoaminzy@gmail.com', '0957389580'),
('NS15', 'Phương Ly', 'phuongly@gmail.com', '0956374890');

-- --------------------------------------------------------

--
-- Table structure for table `category`
--

CREATE TABLE `category` (
  `Category_ID` varchar(20) NOT NULL,
  `Category_Name` varchar(100) DEFAULT NULL
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
  `Event_Name` varchar(255) DEFAULT NULL,
  `Description` text DEFAULT NULL,
  `Start_DateTime` datetime DEFAULT NULL,
  `Venue_ID` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `event`
--

INSERT INTO `event` (`Event_ID`, `Event_Name`, `Description`, `Start_DateTime`, `Venue_ID`) VALUES
('SK01', 'Lễ hội âm nhạc', 'Lễ hội âm nhạc quy tụ với hơn hàng ngàn các thiết bị âm thanh, các nhạc cụ hiện đại cùng nhau mang đến một lễ hội hoành tráng.', '2025-11-21 21:26:44', 'D01'),
('SK02', 'Ẩm thực đường phố', 'Tập hợp nhiều các món ăn đến từ các tỉnh, thành phố trên khắp cả nước.', '2025-11-28 21:26:44', 'D02'),
('SK03', 'Ca nhạc và pháo hoa chào đón năm mới 2026', 'Đêm nhạc bùng nổ và màn phóa hoa rực rỡ chào đón năm mới 2026 thành công và tốt đẹp.', '2025-12-31 21:30:00', 'D03'),
('SK04', 'Biểu diễn drone nghệ thuật', 'Màn biểu diễn nghệ thuật với hơn 5000 thiết bị bay drone tạo nên một vùng trời rực rỡ sắc màu.', '2025-12-09 21:33:02', 'D04'),
('SK05', 'Ngày hội việc làm', 'Tạo nên cơ hội ứng tuyển vào các ngành nghề yêu thích, hỗ trợ các bạn sinh viên có một công việc ổn định.', '2025-12-05 21:34:11', 'D05'),
('SK06', 'Biểu diễn nhạc nước nghệ thuật', 'Một sự kết hợp độc đáo giữa âm thanh và nước tạo nên một chương trình biểu diễn nhạc nước hoành tráng và sôi động.', '2025-11-26 21:35:50', 'D04'),
('SK07', 'Halloween đường phố.', 'Ngày hội hóa trang được mong chờ nhất với các trang phục cosplay độc đáo được khoát lên cùng với dáng vẻ vui tươi, hồn nhiên và cũng đầy vẻ đáng sợ.', '2025-10-15 21:37:41', 'D04'),
('SK08', 'Ngày hội đua thuyền', 'Sức mạnh, sự đoàn kết, khả năng kết hợp nhịp nhàng là những thứ cần thiết để làm nên một chiếc thuyền mạnh mẽ.', '2025-12-19 21:40:49', 'D01'),
('SK09', 'Chương trình chào đón năm mới 2026', 'Những màn biểu diễn đặc sắc kết hợp màn pháo hoa rực rỡ cả bầu trời chào đón năm mới 2026', '2025-12-31 21:43:33', 'D04'),
('SK10', 'Ngày hội giáng sinh', 'Giáng sinh mang đến cảm giác ấm áp, an lành và mang đến niềm hạnh phúc cho gia đình, người thân và bạn bè', '2025-12-03 21:48:47', 'D04');

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
('SK02', 'NS01'),
('SK02', 'NS02'),
('SK02', 'NS04'),
('SK02', 'NS07'),
('SK02', 'NS09'),
('SK03', 'NS01'),
('SK03', 'NS03'),
('SK03', 'NS05'),
('SK03', 'NS09'),
('SK04', 'NS01'),
('SK04', 'NS02'),
('SK04', 'NS03'),
('SK04', 'NS04'),
('SK04', 'NS05'),
('SK05', 'NS05'),
('SK05', 'NS07'),
('SK05', 'NS08'),
('SK05', 'NS10'),
('SK05', 'NS11'),
('SK06', 'NS01'),
('SK06', 'NS12'),
('SK06', 'NS13'),
('SK06', 'NS14'),
('SK06', 'NS15'),
('SK07', 'NS01'),
('SK07', 'NS03'),
('SK07', 'NS06'),
('SK07', 'NS09'),
('SK07', 'NS14'),
('SK08', 'NS03'),
('SK08', 'NS04'),
('SK08', 'NS05'),
('SK08', 'NS06'),
('SK08', 'NS08'),
('SK09', 'NS01'),
('SK09', 'NS05'),
('SK09', 'NS11'),
('SK09', 'NS12'),
('SK09', 'NS15'),
('SK10', 'NS03'),
('SK10', 'NS04'),
('SK10', 'NS06'),
('SK10', 'NS12'),
('SK10', 'NS15');

-- --------------------------------------------------------

--
-- Table structure for table `eventcategory`
--

CREATE TABLE `eventcategory` (
  `Event_ID` varchar(20) NOT NULL,
  `Category_ID` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `eventcategory`
--

INSERT INTO `eventcategory` (`Event_ID`, `Category_ID`) VALUES
('SK01', 'DM02'),
('SK01', 'DM03'),
('SK02', 'DM01'),
('SK02', 'DM09'),
('SK03', 'DM05'),
('SK03', 'DM18'),
('SK04', 'DM02'),
('SK04', 'DM12'),
('SK05', 'DM13'),
('SK05', 'DM15'),
('SK06', 'DM07'),
('SK06', 'DM20'),
('SK07', 'DM10'),
('SK07', 'DM17'),
('SK08', 'DM11'),
('SK08', 'DM19'),
('SK09', 'DM05'),
('SK09', 'DM07'),
('SK10', 'DM03'),
('SK10', 'DM17');

-- --------------------------------------------------------

--
-- Table structure for table `payment`
--

CREATE TABLE `payment` (
  `Payment_ID` varchar(20) NOT NULL,
  `Total` decimal(10,2) DEFAULT NULL,
  `Payment_Date` datetime DEFAULT NULL,
  `Status` varchar(50) DEFAULT NULL,
  `Text` text DEFAULT NULL,
  `Payment_Method` varchar(50) DEFAULT NULL,
  `User_ID` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `payment`
--

INSERT INTO `payment` (`Payment_ID`, `Total`, `Payment_Date`, `Status`, `Text`, `Payment_Method`, `User_ID`) VALUES
('HD01', 30000000.00, '2025-11-15 00:00:00', 'Đã thanh toán', 'Thanh toán tiền vé', 'Chuyển Khoản', 'ND01'),
('HD02', 5000000.00, '2025-11-15 00:00:00', 'Chưa Thanh Toán', 'Thanh toán tiền vé sự kiện', 'Chuyển Khoản', 'ND02'),
('HD03', 25000000.00, '2025-11-15 00:00:00', 'Chưa Thanh Toán', 'Thanh toán tiền vé sự kiện', 'Chuyển Khoản', 'ND02');

-- --------------------------------------------------------

--
-- Table structure for table `purchasedticket`
--

CREATE TABLE `purchasedticket` (
  `Purchased_ID` varchar(20) NOT NULL,
  `Ticket_ID` varchar(20) DEFAULT NULL,
  `Payment_ID` varchar(20) DEFAULT NULL,
  `Quantity` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `purchasedticket`
--

INSERT INTO `purchasedticket` (`Purchased_ID`, `Ticket_ID`, `Payment_ID`, `Quantity`) VALUES
('VM01', 'V01', 'HD01', 5),
('VM02', 'V02', 'HD01', 5),
('VM03', 'V03', 'HD02', 5),
('VM04', 'V06', 'HD03', 5);

--
-- Triggers `purchasedticket`
--
DELIMITER $$
CREATE TRIGGER `trg_after_purchase_detail_delete` AFTER DELETE ON `purchasedticket` FOR EACH ROW BEGIN
    -- Lấy thông tin từ dòng VỪA BỊ XÓA (bằng OLD.)
    -- và cộng trả lại số lượng vào bảng ticket
    UPDATE ticket
    SET Quantity_Stock = Quantity_Stock + OLD.Quantity
    WHERE Ticket_ID = OLD.Ticket_ID;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `trg_after_purchase_ticket` AFTER INSERT ON `purchasedticket` FOR EACH ROW BEGIN
    -- 1. Khai báo biến để giữ giá vé
    DECLARE v_ticket_price DECIMAL(10, 2);

    -- 2. Lấy giá vé từ bảng 'ticket'
    SELECT Price_Ticket INTO v_ticket_price
    FROM ticket
    WHERE Ticket_ID = NEW.Ticket_ID;

    -- 3. Cập nhật tổng tiền (Total) trong bảng 'payment'
    -- (Dùng COALESCE để xử lý nếu Total ban đầu là NULL)
    UPDATE payment
    SET Total = COALESCE(Total, 0) + (v_ticket_price * NEW.Quantity)
    WHERE Payment_ID = NEW.Payment_ID;

    -- 4. Cập nhật số lượng tồn kho (Quantity) trong bảng 'ticket'
    UPDATE ticket
    SET Quantity_Stock = Quantity_Stock - NEW.Quantity
    WHERE Ticket_ID = NEW.Ticket_ID;

END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `review`
--

CREATE TABLE `review` (
  `Review_ID` varchar(20) NOT NULL,
  `Rating` int(11) DEFAULT NULL,
  `Comment` text DEFAULT NULL,
  `User_ID` varchar(20) DEFAULT NULL,
  `Event_ID` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `review`
--

INSERT INTO `review` (`Review_ID`, `Rating`, `Comment`, `User_ID`, `Event_ID`) VALUES
('DG01', 5, 'vui tươi, sống động.', 'ND01', 'SK01'),
('DG02', 5, NULL, 'ND01', 'SK02'),
('DG03', 5, NULL, 'ND01', 'SK03'),
('DG04', 3, NULL, 'ND01', 'SK04'),
('DG05', 4, NULL, 'ND01', 'SK05'),
('DG06', 5, NULL, 'ND01', 'SK06'),
('DG07', 3, NULL, 'ND01', 'SK07'),
('DG08', 1, NULL, 'ND01', 'SK08'),
('DG09', 5, NULL, 'ND01', 'SK09'),
('DG10', 1, NULL, 'ND01', 'SK10'),
('DG11', 5, NULL, 'ND02', 'SK01'),
('DG12', 5, NULL, 'ND02', 'SK02'),
('DG13', 4, NULL, 'ND02', 'SK03'),
('DG14', 2, NULL, 'ND02', 'SK04'),
('DG15', 4, NULL, 'ND02', 'SK05'),
('DG16', 5, NULL, 'ND02', 'SK06'),
('DG17', 5, NULL, 'ND02', 'SK07'),
('DG18', 3, NULL, 'ND02', 'SK08'),
('DG19', 5, NULL, 'ND02', 'SK09'),
('DG20', 5, NULL, 'ND02', 'SK10');

-- --------------------------------------------------------

--
-- Table structure for table `ticket`
--

CREATE TABLE `ticket` (
  `Ticket_ID` varchar(20) NOT NULL,
  `Ticket_Name` varchar(100) DEFAULT NULL,
  `Quantity_Stock` int(11) DEFAULT NULL,
  `Price_Ticket` decimal(10,2) DEFAULT NULL,
  `Currency` varchar(10) DEFAULT NULL,
  `Event_ID` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `ticket`
--

INSERT INTO `ticket` (`Ticket_ID`, `Ticket_Name`, `Quantity_Stock`, `Price_Ticket`, `Currency`, `Event_ID`) VALUES
('V01', 'Vé thường', 15, 1000000.00, 'VNĐ', 'SK01'),
('V02', 'Vé VIP', 5, 5000000.00, 'VNĐ', 'SK01'),
('V03', 'Vé thường', 15, 1000000.00, 'VNĐ', 'SK02'),
('V04', 'Vé VIP', 10, 5000000.00, 'VNĐ', 'SK02'),
('V05', 'Vé thường', 20, 1000000.00, 'VNĐ', 'SK03'),
('V06', 'Vé VIP', 5, 5000000.00, 'VNĐ', 'SK03'),
('V07', 'Vé thường', 20, 1000000.00, 'VNĐ', 'SK04'),
('V08', 'Vé VIP', 10, 5000000.00, 'VNĐ', 'SK04'),
('V09', 'Vé thường', 20, 1000000.00, 'VNĐ', 'SK05'),
('V10', 'Vé VIP', 10, 5000000.00, 'VNĐ', 'SK05'),
('V11', 'Vé thường', 20, 1000000.00, 'VNĐ', 'SK06'),
('V12', 'Vé VIP', 10, 5000000.00, 'VNĐ', 'SK06'),
('V13', 'Vé thường', 20, 1000000.00, 'VNĐ', 'SK07'),
('V14', 'Vé VIP', 10, 5000000.00, 'VNĐ', 'SK07'),
('V15', 'Vé thường', 20, 1000000.00, 'VNĐ', 'SK08'),
('V16', 'Vé VIP', 10, 5000000.00, 'VNĐ', 'SK08'),
('V17', 'Vé thường', 20, 1000000.00, 'VNĐ', 'SK09'),
('V18', 'Vé VIP', 10, 5000000.00, 'VNĐ', 'SK09'),
('V19', 'Vé thường', 20, 1000000.00, 'VNĐ', 'SK10'),
('V20', 'Vé VIP', 10, 5000000.00, 'VNĐ', 'SK10');

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `User_ID` varchar(20) NOT NULL,
  `FullName` varchar(255) DEFAULT NULL,
  `Birthday` date DEFAULT NULL,
  `Sex` varchar(10) DEFAULT NULL,
  `Address` varchar(255) DEFAULT NULL,
  `Phone` varchar(20) DEFAULT NULL,
  `Account` varchar(100) DEFAULT NULL,
  `Password` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`User_ID`, `FullName`, `Birthday`, `Sex`, `Address`, `Phone`, `Account`, `Password`) VALUES
('ND01', 'Võ Thái Tuấn', '2016-11-16', 'Nam', 'Quận 06, Thành Phố Hồ Chí Minh', '0899506263', NULL, NULL),
('ND02', 'Nguyễn Quốc Xanh', '2016-03-24', 'Nam', 'Nhà Bè, Thành Phố Hồ Chí Minh', '0758628951', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `usersavedevent`
--

CREATE TABLE `usersavedevent` (
  `User_ID` varchar(20) NOT NULL,
  `Event_ID` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `usersavedevent`
--

INSERT INTO `usersavedevent` (`User_ID`, `Event_ID`) VALUES
('ND01', 'SK01'),
('ND01', 'SK02'),
('ND01', 'SK03'),
('ND01', 'SK04'),
('ND01', 'SK05'),
('ND02', 'SK06'),
('ND02', 'SK07'),
('ND02', 'SK08'),
('ND02', 'SK09'),
('ND02', 'SK10');

-- --------------------------------------------------------

--
-- Table structure for table `venue`
--

CREATE TABLE `venue` (
  `Venue_ID` varchar(20) NOT NULL,
  `Venue_Name` varchar(255) DEFAULT NULL,
  `Address` varchar(255) DEFAULT NULL,
  `City` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `venue`
--

INSERT INTO `venue` (`Venue_ID`, `Venue_Name`, `Address`, `City`) VALUES
('D01', 'Công Viên Bến Bạch Đằng', 'Đường Tôn Đức Thắng, Quận 01, Thành Phố Hồ Chí Minh', 'Thành Phố Hồ Chí Minh'),
('D02', 'Sân Vận Động Thống Nhất', 'Đường Thống Nhất, Quận 10, Thành Phố Hồ Chí Minh', 'Thành Phố Hồ Chí Minh'),
('D03', 'Công Viên Nước Đầm Sen', 'Quận 03, Thành Phố Hồ Chí Minh', 'Thành Phố Hồ Chí Minh'),
('D04', 'Phố Đi Bộ Nguyễn Huệ', 'Đường Tôn Đức Thắng, Quận 01, Thành Phố Hồ Chí Minh', 'Thành Phố Hồ Chí Minh'),
('D05', 'Trường Đại Học Tôn Đức Thắng', 'Đường Nguyễn Hữu Thọ, Quận 07, Thành Phố Hồ Chí Minh', 'Thành Phố Hồ Chí Minh');

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
  ADD KEY `Venue_ID` (`Venue_ID`);

--
-- Indexes for table `eventartist`
--
ALTER TABLE `eventartist`
  ADD PRIMARY KEY (`Event_ID`,`Artist_ID`),
  ADD KEY `Artist_ID` (`Artist_ID`);

--
-- Indexes for table `eventcategory`
--
ALTER TABLE `eventcategory`
  ADD PRIMARY KEY (`Event_ID`,`Category_ID`),
  ADD KEY `Category_ID` (`Category_ID`);

--
-- Indexes for table `payment`
--
ALTER TABLE `payment`
  ADD PRIMARY KEY (`Payment_ID`),
  ADD KEY `User_ID` (`User_ID`);

--
-- Indexes for table `purchasedticket`
--
ALTER TABLE `purchasedticket`
  ADD PRIMARY KEY (`Purchased_ID`),
  ADD KEY `Ticket_ID` (`Ticket_ID`),
  ADD KEY `Payment_ID` (`Payment_ID`);

--
-- Indexes for table `review`
--
ALTER TABLE `review`
  ADD PRIMARY KEY (`Review_ID`),
  ADD KEY `User_ID` (`User_ID`),
  ADD KEY `Event_ID` (`Event_ID`);

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
-- Indexes for table `usersavedevent`
--
ALTER TABLE `usersavedevent`
  ADD PRIMARY KEY (`User_ID`,`Event_ID`),
  ADD KEY `Event_ID` (`Event_ID`);

--
-- Indexes for table `venue`
--
ALTER TABLE `venue`
  ADD PRIMARY KEY (`Venue_ID`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `event`
--
ALTER TABLE `event`
  ADD CONSTRAINT `event_ibfk_1` FOREIGN KEY (`Venue_ID`) REFERENCES `venue` (`Venue_ID`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `eventartist`
--
ALTER TABLE `eventartist`
  ADD CONSTRAINT `eventartist_ibfk_1` FOREIGN KEY (`Event_ID`) REFERENCES `event` (`Event_ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `eventartist_ibfk_2` FOREIGN KEY (`Artist_ID`) REFERENCES `artist` (`Artist_ID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `eventcategory`
--
ALTER TABLE `eventcategory`
  ADD CONSTRAINT `eventcategory_ibfk_1` FOREIGN KEY (`Event_ID`) REFERENCES `event` (`Event_ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `eventcategory_ibfk_2` FOREIGN KEY (`Category_ID`) REFERENCES `category` (`Category_ID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `payment`
--
ALTER TABLE `payment`
  ADD CONSTRAINT `payment_ibfk_1` FOREIGN KEY (`User_ID`) REFERENCES `user` (`User_ID`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `purchasedticket`
--
ALTER TABLE `purchasedticket`
  ADD CONSTRAINT `purchasedticket_ibfk_1` FOREIGN KEY (`Ticket_ID`) REFERENCES `ticket` (`Ticket_ID`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `purchasedticket_ibfk_2` FOREIGN KEY (`Payment_ID`) REFERENCES `payment` (`Payment_ID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `review`
--
ALTER TABLE `review`
  ADD CONSTRAINT `review_ibfk_1` FOREIGN KEY (`User_ID`) REFERENCES `user` (`User_ID`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `review_ibfk_2` FOREIGN KEY (`Event_ID`) REFERENCES `event` (`Event_ID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `ticket`
--
ALTER TABLE `ticket`
  ADD CONSTRAINT `ticket_ibfk_1` FOREIGN KEY (`Event_ID`) REFERENCES `event` (`Event_ID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `usersavedevent`
--
ALTER TABLE `usersavedevent`
  ADD CONSTRAINT `usersavedevent_ibfk_1` FOREIGN KEY (`User_ID`) REFERENCES `user` (`User_ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `usersavedevent_ibfk_2` FOREIGN KEY (`Event_ID`) REFERENCES `event` (`Event_ID`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
