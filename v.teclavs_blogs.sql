-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               10.4.27-MariaDB - mariadb.org binary distribution
-- Server OS:                    Win64
-- HeidiSQL Version:             12.3.0.6589
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for myblog
DROP DATABASE IF EXISTS `myblog`;
CREATE DATABASE IF NOT EXISTS `myblog` /*!40100 DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci */;
USE `myblog`;

-- Dumping structure for table myblog.vt_blogs
DROP TABLE IF EXISTS `vt_blogs`;
CREATE TABLE IF NOT EXISTS `vt_blogs` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(10) unsigned NOT NULL,
  `text` varchar(255) NOT NULL,
  `img` varchar(255) NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT 0 COMMENT '0: public; 1:private',
  `views` int(11) NOT NULL,
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `vt_blogs_user_id_index` (`user_id`),
  CONSTRAINT `vt_blogs_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `vt_users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Dumping data for table myblog.vt_blogs: ~8 rows (approximately)
INSERT INTO `vt_blogs` (`id`, `user_id`, `text`, `img`, `status`, `views`, `created_at`) VALUES
	(3, 1, '234567890', '[]', 1, 0, '2023-10-03 15:18:03'),
	(6, 1, '5', '[]', 1, 0, '2023-12-03 15:19:45'),
	(16, 1, '<3', '["/uploads/blogs/images-1701608414961.png","/uploads/blogs/images-1701608414979.png"]', 1, 0, '2023-12-03 15:19:46'),
	(17, 1, 'blog post without images', '[]', 1, 0, '2023-12-03 15:19:47'),
	(18, 1, 'time test', '[]', 1, 0, '2023-12-03 15:19:48'),
	(19, 1, 'time test', '[]', 1, 0, '2023-12-03 15:19:06'),
	(20, 1, 'q', '[]', 1, 0, '2023-12-03 15:59:26'),
	(21, 1, '1', '[]', 1, 0, '2023-12-03 16:10:05');

-- Dumping structure for table myblog.vt_comments
DROP TABLE IF EXISTS `vt_comments`;
CREATE TABLE IF NOT EXISTS `vt_comments` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(10) unsigned NOT NULL,
  `blog_id` int(10) unsigned NOT NULL,
  `comment_id` int(10) unsigned DEFAULT NULL,
  `text` varchar(255) NOT NULL,
  `img` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `vt_comments_user_id_index` (`user_id`),
  KEY `vt_comments_blog_id_index` (`blog_id`),
  KEY `vt_comments_comment_id_index` (`comment_id`),
  CONSTRAINT `vt_comments_blog_id_foreign` FOREIGN KEY (`blog_id`) REFERENCES `vt_blogs` (`id`),
  CONSTRAINT `vt_comments_comment_id_foreign` FOREIGN KEY (`comment_id`) REFERENCES `vt_comments` (`id`),
  CONSTRAINT `vt_comments_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `vt_users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Dumping data for table myblog.vt_comments: ~1 rows (approximately)
INSERT INTO `vt_comments` (`id`, `user_id`, `blog_id`, `comment_id`, `text`, `img`) VALUES
	(1, 1, 6, NULL, 'hello', '');

-- Dumping structure for table myblog.vt_likes
DROP TABLE IF EXISTS `vt_likes`;
CREATE TABLE IF NOT EXISTS `vt_likes` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(10) unsigned NOT NULL,
  `blog_id` int(10) unsigned NOT NULL,
  `comment_id` int(10) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `vt_likes_user_id_index` (`user_id`),
  KEY `vt_likes_blog_id_index` (`blog_id`),
  KEY `vt_likes_comment_id_index` (`comment_id`),
  CONSTRAINT `vt_likes_blog_id_foreign` FOREIGN KEY (`blog_id`) REFERENCES `vt_blogs` (`id`),
  CONSTRAINT `vt_likes_comment_id_foreign` FOREIGN KEY (`comment_id`) REFERENCES `vt_comments` (`id`),
  CONSTRAINT `vt_likes_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `vt_users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Dumping data for table myblog.vt_likes: ~1 rows (approximately)
INSERT INTO `vt_likes` (`id`, `user_id`, `blog_id`, `comment_id`) VALUES
	(6, 1, 3, NULL);

-- Dumping structure for table myblog.vt_subcribers
DROP TABLE IF EXISTS `vt_subcribers`;
CREATE TABLE IF NOT EXISTS `vt_subcribers` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(10) unsigned NOT NULL,
  `subscriber_id` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `vt_subcribers_user_id_index` (`user_id`),
  KEY `vt_subcribers_subscriber_id_index` (`subscriber_id`),
  CONSTRAINT `vt_subcribers_subscriber_id_foreign` FOREIGN KEY (`subscriber_id`) REFERENCES `vt_users` (`id`),
  CONSTRAINT `vt_subcribers_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `vt_users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Dumping data for table myblog.vt_subcribers: ~0 rows (approximately)

-- Dumping structure for table myblog.vt_users
DROP TABLE IF EXISTS `vt_users`;
CREATE TABLE IF NOT EXISTS `vt_users` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `profile_id` int(10) unsigned NOT NULL,
  `inf_id` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `vt_users_profile_id_index` (`profile_id`),
  KEY `vt_users_inf_id_index` (`inf_id`),
  CONSTRAINT `vt_users_inf_id_foreign` FOREIGN KEY (`inf_id`) REFERENCES `vt_user_inf` (`id`),
  CONSTRAINT `vt_users_profile_id_foreign` FOREIGN KEY (`profile_id`) REFERENCES `vt_user_profile` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Dumping data for table myblog.vt_users: ~1 rows (approximately)
INSERT INTO `vt_users` (`id`, `profile_id`, `inf_id`) VALUES
	(1, 1, 1);

-- Dumping structure for table myblog.vt_user_inf
DROP TABLE IF EXISTS `vt_user_inf`;
CREATE TABLE IF NOT EXISTS `vt_user_inf` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `surname` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Dumping data for table myblog.vt_user_inf: ~1 rows (approximately)
INSERT INTO `vt_user_inf` (`id`, `name`, `surname`, `email`, `password`) VALUES
	(1, 'vlad', 'teclavs', 'gmail.com', '1');

-- Dumping structure for table myblog.vt_user_profile
DROP TABLE IF EXISTS `vt_user_profile`;
CREATE TABLE IF NOT EXISTS `vt_user_profile` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `img` varchar(255) NOT NULL,
  `description` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Dumping data for table myblog.vt_user_profile: ~1 rows (approximately)
INSERT INTO `vt_user_profile` (`id`, `username`, `img`, `description`) VALUES
	(1, 'Vlad', '/uploads/blogs/images-1701450399235.png', '');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
