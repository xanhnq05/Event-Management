-- Tắt foreign key checks tạm thời
SET FOREIGN_KEY_CHECKS = 0;

-- Lấy danh sách tất cả tables và xóa chúng
SET @tables = NULL;
SELECT GROUP_CONCAT('`', table_schema, '`.`', table_name, '`')
INTO @tables
FROM information_schema.tables
WHERE table_schema = 'user_db';  -- Thay 'qlsk' bằng tên database của bạn

SET @tables = CONCAT('DROP TABLE IF EXISTS ', @tables);
PREPARE stmt FROM @tables;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Bật lại foreign key checks
SET FOREIGN_KEY_CHECKS = 1;