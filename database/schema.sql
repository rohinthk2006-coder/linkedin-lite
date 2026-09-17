-- =============================================================================
-- LinkSphere - Complete MySQL 8.0+ Schema & Seed Setup
-- =============================================================================

CREATE DATABASE IF NOT EXISTS `linkin lite` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE IF NOT EXISTS `linkin_lite` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE `linkin_lite`;

-- Schema Definition
SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS `connections`;
DROP TABLE IF EXISTS `notifications`;
DROP TABLE IF EXISTS `certifications`;
DROP TABLE IF EXISTS `projects`;
DROP TABLE IF EXISTS `experiences`;
DROP TABLE IF EXISTS `educations`;
DROP TABLE IF EXISTS `comments`;
DROP TABLE IF EXISTS `likes`;
DROP TABLE IF EXISTS `posts`;
DROP TABLE IF EXISTS `user_skills`;
DROP TABLE IF EXISTS `skills`;
DROP TABLE IF EXISTS `users`;

-- 1. users
CREATE TABLE `users` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `first_name` VARCHAR(255) NOT NULL,
    `last_name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `headline` VARCHAR(255) DEFAULT NULL,
    `about` TEXT DEFAULT NULL,
    `location` VARCHAR(255) DEFAULT NULL,
    `profile_image` TEXT DEFAULT NULL,
    `role` VARCHAR(50) NOT NULL,
    `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_users_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. skills
CREATE TABLE `skills` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_skills_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. user_skills
CREATE TABLE `user_skills` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT NOT NULL,
    `skill_id` BIGINT NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_user_skills_user_skill` (`user_id`, `skill_id`),
    KEY `idx_user_skills_user` (`user_id`),
    KEY `idx_user_skills_skill` (`skill_id`),
    CONSTRAINT `fk_user_skills_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `fk_user_skills_skill` FOREIGN KEY (`skill_id`) REFERENCES `skills` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. posts
CREATE TABLE `posts` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `content` TEXT NOT NULL,
    `image_url` TEXT DEFAULT NULL,
    `author_id` BIGINT NOT NULL,
    `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    PRIMARY KEY (`id`),
    KEY `idx_posts_author` (`author_id`),
    KEY `idx_posts_created_at` (`created_at` DESC),
    CONSTRAINT `fk_posts_author` FOREIGN KEY (`author_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. likes
CREATE TABLE `likes` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `post_id` BIGINT NOT NULL,
    `user_id` BIGINT NOT NULL,
    `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_likes_post_user` (`post_id`, `user_id`),
    KEY `idx_likes_post` (`post_id`),
    KEY `idx_likes_user` (`user_id`),
    CONSTRAINT `fk_likes_post` FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `fk_likes_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. comments
CREATE TABLE `comments` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `content` TEXT NOT NULL,
    `post_id` BIGINT NOT NULL,
    `user_id` BIGINT NOT NULL,
    `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    PRIMARY KEY (`id`),
    KEY `idx_comments_post` (`post_id`),
    KEY `idx_comments_user` (`user_id`),
    CONSTRAINT `fk_comments_post` FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `fk_comments_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. educations
CREATE TABLE `educations` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `institution` VARCHAR(255) NOT NULL,
    `degree` VARCHAR(255) NOT NULL,
    `field_of_study` VARCHAR(255) DEFAULT NULL,
    `start_date` DATE DEFAULT NULL,
    `end_date` DATE DEFAULT NULL,
    `description` TEXT DEFAULT NULL,
    `user_id` BIGINT NOT NULL,
    PRIMARY KEY (`id`),
    KEY `idx_educations_user` (`user_id`),
    CONSTRAINT `fk_educations_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. experiences
CREATE TABLE `experiences` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `company` VARCHAR(255) NOT NULL,
    `position` VARCHAR(255) NOT NULL,
    `location` VARCHAR(255) DEFAULT NULL,
    `start_date` DATE DEFAULT NULL,
    `end_date` DATE DEFAULT NULL,
    `description` TEXT DEFAULT NULL,
    `user_id` BIGINT NOT NULL,
    PRIMARY KEY (`id`),
    KEY `idx_experiences_user` (`user_id`),
    CONSTRAINT `fk_experiences_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. projects
CREATE TABLE `projects` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(255) NOT NULL,
    `description` TEXT DEFAULT NULL,
    `technologies` VARCHAR(255) DEFAULT NULL,
    `project_url` VARCHAR(255) DEFAULT NULL,
    `user_id` BIGINT NOT NULL,
    PRIMARY KEY (`id`),
    KEY `idx_projects_user` (`user_id`),
    CONSTRAINT `fk_projects_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. certifications
CREATE TABLE `certifications` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `issuing_organization` VARCHAR(255) DEFAULT NULL,
    `issue_date` DATE DEFAULT NULL,
    `credential_id` VARCHAR(255) DEFAULT NULL,
    `credential_url` VARCHAR(255) DEFAULT NULL,
    `user_id` BIGINT NOT NULL,
    PRIMARY KEY (`id`),
    KEY `idx_certifications_user` (`user_id`),
    CONSTRAINT `fk_certifications_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 11. notifications
CREATE TABLE `notifications` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `recipient_id` BIGINT NOT NULL,
    `sender_id` BIGINT NOT NULL,
    `type` VARCHAR(50) NOT NULL,
    `message` VARCHAR(255) NOT NULL,
    `reference_id` BIGINT DEFAULT NULL,
    `is_read` TINYINT(1) NOT NULL DEFAULT 0,
    `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    PRIMARY KEY (`id`),
    KEY `idx_notifications_recipient` (`recipient_id`),
    KEY `idx_notifications_sender` (`sender_id`),
    KEY `idx_notifications_created_at` (`created_at` DESC),
    CONSTRAINT `fk_notifications_recipient` FOREIGN KEY (`recipient_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `fk_notifications_sender` FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 12. connections
CREATE TABLE `connections` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `sender_id` BIGINT NOT NULL,
    `receiver_id` BIGINT NOT NULL,
    `status` VARCHAR(50) NOT NULL,
    `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_connections_sender_receiver` (`sender_id`, `receiver_id`),
    KEY `idx_connections_sender` (`sender_id`),
    KEY `idx_connections_receiver` (`receiver_id`),
    CONSTRAINT `fk_connections_sender` FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `fk_connections_receiver` FOREIGN KEY (`receiver_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;

-- Seed Data Insertion
INSERT INTO `skills` (`id`, `name`) VALUES
(1, 'Java'),
(2, 'Spring Boot'),
(3, 'React'),
(4, 'TypeScript'),
(5, 'MySQL'),
(6, 'Tailwind CSS'),
(7, 'Docker'),
(8, 'AWS')
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);

INSERT INTO `users` (`id`, `first_name`, `last_name`, `email`, `password`, `headline`, `about`, `location`, `profile_image`, `role`, `created_at`, `updated_at`) VALUES
(1, 'Admin', 'System', 'admin@linksphere.com', '$2a$10$rYJkD70H7qBwibrnBWgHkOCVbYbfBcDiCOboL3CI.A.I13LgH17je', 'System Administrator & Lead Architect', 'Platform administrator managing LinkSphere system health and operations.', 'San Francisco, CA', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80', 'ROLE_ADMIN', NOW(6), NOW(6)),
(2, 'Alex', 'Morgan', 'alex.morgan@example.com', '$2a$10$rYJkD70H7qBwibrnBWgHkOCVbYbfBcDiCOboL3CI.A.I13LgH17je', 'Senior Full-Stack Engineer @ TechCorp | Open Source Contributor', 'Passionate software craftsman with 6+ years of experience building distributed backend APIs and responsive modern React frontends.', 'New York, NY', 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80', 'ROLE_USER', NOW(6), NOW(6)),
(3, 'Sarah', 'Chen', 'sarah.chen@example.com', '$2a$10$rYJkD70H7qBwibrnBWgHkOCVbYbfBcDiCOboL3CI.A.I13LgH17je', 'Lead AI Research Engineer | Machine Learning Specialist', 'Pioneering deep learning solutions, LLM architectures, and scalable data pipelines for enterprise healthcare solutions.', 'Boston, MA', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80', 'ROLE_USER', NOW(6), NOW(6)),
(4, 'David', 'Kowalski', 'david.k@example.com', '$2a$10$rYJkD70H7qBwibrnBWgHkOCVbYbfBcDiCOboL3CI.A.I13LgH17je', 'DevOps Specialist | Kubernetes & Cloud Architecture', 'Automating infrastructure, zero-downtime CI/CD deployments, and high-availability cloud cluster orchestration.', 'Seattle, WA', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80', 'ROLE_USER', NOW(6), NOW(6)),
(5, 'Elena', 'Rostova', 'elena.r@example.com', '$2a$10$rYJkD70H7qBwibrnBWgHkOCVbYbfBcDiCOboL3CI.A.I13LgH17je', 'UI/UX Principal Designer & Product Strategist', 'Creating intuitive human-centered design systems and delightful digital product experiences.', 'Austin, TX', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80', 'ROLE_USER', NOW(6), NOW(6))
ON DUPLICATE KEY UPDATE 
    `password` = VALUES(`password`),
    `first_name` = VALUES(`first_name`),
    `last_name` = VALUES(`last_name`),
    `headline` = VALUES(`headline`),
    `about` = VALUES(`about`),
    `location` = VALUES(`location`),
    `profile_image` = VALUES(`profile_image`),
    `role` = VALUES(`role`);

INSERT INTO `user_skills` (`id`, `user_id`, `skill_id`) VALUES
(1, 2, 1),
(2, 2, 2),
(3, 2, 3),
(4, 2, 4),
(5, 2, 5),
(6, 2, 6),
(7, 2, 7),
(8, 2, 8),
(9, 3, 1),
(10, 3, 8)
ON DUPLICATE KEY UPDATE `id` = VALUES(`id`);

INSERT INTO `educations` (`id`, `institution`, `degree`, `field_of_study`, `start_date`, `end_date`, `description`, `user_id`) VALUES
(1, 'Stanford University', 'Master of Science', 'Computer Science', '2018-09-01', '2020-06-01', 'Graduated with Distinction. Specialized in Distributed Systems.', 2)
ON DUPLICATE KEY UPDATE 
    `institution` = VALUES(`institution`),
    `degree` = VALUES(`degree`),
    `field_of_study` = VALUES(`field_of_study`),
    `description` = VALUES(`description`);

INSERT INTO `experiences` (`id`, `company`, `position`, `location`, `start_date`, `end_date`, `description`, `user_id`) VALUES
(1, 'TechCorp Inc.', 'Senior Full-Stack Engineer', 'New York, NY', '2021-01-15', NULL, 'Leading a team of 6 engineers architecting microservice APIs and modern web clients.', 2)
ON DUPLICATE KEY UPDATE 
    `company` = VALUES(`company`),
    `position` = VALUES(`position`),
    `location` = VALUES(`location`),
    `description` = VALUES(`description`);

INSERT INTO `projects` (`id`, `title`, `description`, `technologies`, `project_url`, `user_id`) VALUES
(1, 'LinkSphere Networking Engine', 'High-performance full-stack networking platform built with Spring Boot 3 & React.', 'Java 21, Spring Boot, React, Vite, Tailwind CSS, MySQL', 'https://github.com/example/linksphere', 2)
ON DUPLICATE KEY UPDATE 
    `title` = VALUES(`title`),
    `description` = VALUES(`description`),
    `technologies` = VALUES(`technologies`),
    `project_url` = VALUES(`project_url`);

INSERT INTO `certifications` (`id`, `name`, `issuing_organization`, `issue_date`, `credential_id`, `credential_url`, `user_id`) VALUES
(1, 'AWS Certified Solutions Architect – Professional', 'Amazon Web Services', '2022-05-10', 'AWS-PAS-99201', 'https://aws.amazon.com/verification', 2)
ON DUPLICATE KEY UPDATE 
    `name` = VALUES(`name`),
    `issuing_organization` = VALUES(`issuing_organization`),
    `credential_id` = VALUES(`credential_id`),
    `credential_url` = VALUES(`credential_url`);

INSERT INTO `connections` (`id`, `sender_id`, `receiver_id`, `status`, `created_at`) VALUES
(1, 2, 3, 'ACCEPTED', NOW(6)),
(2, 4, 2, 'PENDING', NOW(6))
ON DUPLICATE KEY UPDATE `status` = VALUES(`status`);

INSERT INTO `posts` (`id`, `content`, `image_url`, `author_id`, `created_at`, `updated_at`) VALUES
(1, '🚀 Excited to announce the launch of LinkSphere! Built with Spring Boot 3.2, Java 21, and React 18. Clean architecture, JWT authentication, and real-time networking controls.', 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80', 2, NOW(6), NOW(6)),
(2, 'Machine Learning tip of the day: When training deep neural networks, always monitor your validation loss curves closely to catch overfitting early!', NULL, 3, NOW(6), NOW(6))
ON DUPLICATE KEY UPDATE 
    `content` = VALUES(`content`),
    `image_url` = VALUES(`image_url`);

INSERT INTO `likes` (`id`, `post_id`, `user_id`, `created_at`) VALUES
(1, 1, 3, NOW(6))
ON DUPLICATE KEY UPDATE `id` = VALUES(`id`);

INSERT INTO `comments` (`id`, `content`, `post_id`, `user_id`, `created_at`, `updated_at`) VALUES
(1, 'Congratulations Alex! The UI looks extraordinarily sleek and clean!', 1, 3, NOW(6), NOW(6))
ON DUPLICATE KEY UPDATE 
    `content` = VALUES(`content`);

INSERT INTO `notifications` (`id`, `recipient_id`, `sender_id`, `type`, `message`, `reference_id`, `is_read`, `created_at`) VALUES
(1, 2, 4, 'CONNECTION_REQUEST', 'David Kowalski sent you a connection request', NULL, 0, NOW(6))
ON DUPLICATE KEY UPDATE 
    `message` = VALUES(`message`),
    `is_read` = VALUES(`is_read`);
