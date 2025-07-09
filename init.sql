-- Initialize database with proper charset
CREATE DATABASE IF NOT EXISTS kulturaview CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE kulturaview;

-- Grant privileges
GRANT ALL PRIVILEGES ON kulturaview.* TO 'kulturaview'@'%';
FLUSH PRIVILEGES;
