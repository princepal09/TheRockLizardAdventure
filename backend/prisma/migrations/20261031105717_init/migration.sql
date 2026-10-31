-- CreateTable
CREATE TABLE `admin` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `password_hash` VARCHAR(255) NOT NULL,
    `profile_image_url` VARCHAR(1000) NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `last_login_at` DATETIME(0) NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `admin_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `refresh_token` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `admin_id` INTEGER NOT NULL,
    `token_hash` VARCHAR(255) NOT NULL,
    `expires_at` DATETIME(0) NOT NULL,
    `revoked_at` DATETIME(0) NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `refresh_token_token_hash_key`(`token_hash`),
    INDEX `refresh_token_admin_id_idx`(`admin_id`),
    INDEX `refresh_token_expires_at_idx`(`expires_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `reset_password_token` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `admin_id` INTEGER NOT NULL,
    `token_hash` VARCHAR(255) NOT NULL,
    `expires_at` DATETIME(0) NOT NULL,
    `used_at` DATETIME(0) NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `reset_password_token_token_hash_key`(`token_hash`),
    INDEX `reset_password_token_admin_id_idx`(`admin_id`),
    INDEX `reset_password_token_expires_at_idx`(`expires_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `region` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(150) NOT NULL,
    `slug` VARCHAR(180) NOT NULL,
    `description` TEXT NULL,
    `image_url` VARCHAR(1000) NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `region_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `season` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `slug` VARCHAR(120) NOT NULL,
    `description` TEXT NULL,
    `start_month` TINYINT UNSIGNED NULL,
    `end_month` TINYINT UNSIGNED NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `season_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `trek` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(200) NOT NULL,
    `slug` VARCHAR(220) NOT NULL,
    `summary` VARCHAR(500) NULL,
    `description` TEXT NULL,
    `region_id` INTEGER NOT NULL,
    `difficulty` ENUM('EASY', 'MODERATE', 'DIFFICULT', 'VERY_DIFFICULT', 'EXTREME') NOT NULL,
    `status` ENUM('DRAFT', 'PUBLISHED', 'ARCHIVED') NOT NULL DEFAULT 'DRAFT',
    `duration_days` INTEGER NOT NULL,
    `distance_km` DECIMAL(8, 2) NULL,
    `max_altitude_meters` INTEGER NULL,
    `starting_point` VARCHAR(255) NULL,
    `ending_point` VARCHAR(255) NULL,
    `cover_image_url` VARCHAR(1000) NULL,
    `price` DECIMAL(10, 2) NULL,
    `discount_price` DECIMAL(10, 2) NULL,
    `currency` CHAR(3) NOT NULL DEFAULT 'INR',
    `max_group_size` INTEGER NULL,
    `min_age` INTEGER NULL,
    `max_age` INTEGER NULL,
    `is_featured` BOOLEAN NOT NULL DEFAULT false,
    `published_at` DATETIME(0) NULL,
    `created_by` INTEGER NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `trek_slug_key`(`slug`),
    INDEX `trek_region_id_status_idx`(`region_id`, `status`),
    INDEX `trek_status_is_featured_idx`(`status`, `is_featured`),
    INDEX `trek_status_published_at_idx`(`status`, `published_at`),
    INDEX `trek_difficulty_idx`(`difficulty`),
    INDEX `trek_created_by_idx`(`created_by`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `trek_season` (
    `trek_id` INTEGER NOT NULL,
    `season_id` INTEGER NOT NULL,

    INDEX `trek_season_season_id_idx`(`season_id`),
    PRIMARY KEY (`trek_id`, `season_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `trek_month` (
    `trek_id` INTEGER NOT NULL,
    `month` TINYINT UNSIGNED NOT NULL,

    INDEX `trek_month_month_idx`(`month`),
    PRIMARY KEY (`trek_id`, `month`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `trek_itinerary` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `trek_id` INTEGER NOT NULL,
    `day_number` INTEGER NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,
    `distance_km` DECIMAL(8, 2) NULL,
    `altitude_meters` INTEGER NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `trek_itinerary_trek_id_day_number_key`(`trek_id`, `day_number`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `trek_image` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `trek_id` INTEGER NOT NULL,
    `image_url` VARCHAR(1000) NOT NULL,
    `alt_text` VARCHAR(255) NULL,
    `caption` VARCHAR(255) NULL,
    `sort_order` INTEGER NOT NULL DEFAULT 0,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `trek_image_trek_id_sort_order_idx`(`trek_id`, `sort_order`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `expedition` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(200) NOT NULL,
    `slug` VARCHAR(220) NOT NULL,
    `summary` VARCHAR(500) NULL,
    `description` TEXT NULL,
    `region_id` INTEGER NOT NULL,
    `difficulty` ENUM('EASY', 'MODERATE', 'DIFFICULT', 'VERY_DIFFICULT', 'EXTREME') NOT NULL,
    `status` ENUM('DRAFT', 'PUBLISHED', 'ARCHIVED') NOT NULL DEFAULT 'DRAFT',
    `duration_days` INTEGER NOT NULL,
    `distance_km` DECIMAL(8, 2) NULL,
    `max_altitude_meters` INTEGER NULL,
    `starting_point` VARCHAR(255) NULL,
    `ending_point` VARCHAR(255) NULL,
    `cover_image_url` VARCHAR(1000) NULL,
    `price` DECIMAL(10, 2) NULL,
    `discount_price` DECIMAL(10, 2) NULL,
    `currency` CHAR(3) NOT NULL DEFAULT 'INR',
    `max_group_size` INTEGER NULL,
    `min_age` INTEGER NULL,
    `max_age` INTEGER NULL,
    `is_featured` BOOLEAN NOT NULL DEFAULT false,
    `published_at` DATETIME(0) NULL,
    `created_by` INTEGER NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `expedition_slug_key`(`slug`),
    INDEX `expedition_region_id_status_idx`(`region_id`, `status`),
    INDEX `expedition_status_is_featured_idx`(`status`, `is_featured`),
    INDEX `expedition_status_published_at_idx`(`status`, `published_at`),
    INDEX `expedition_difficulty_idx`(`difficulty`),
    INDEX `expedition_created_by_idx`(`created_by`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `expedition_season` (
    `expedition_id` INTEGER NOT NULL,
    `season_id` INTEGER NOT NULL,

    INDEX `expedition_season_season_id_idx`(`season_id`),
    PRIMARY KEY (`expedition_id`, `season_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `expedition_itinerary` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `expedition_id` INTEGER NOT NULL,
    `day_number` INTEGER NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,
    `distance_km` DECIMAL(8, 2) NULL,
    `altitude_meters` INTEGER NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `expedition_itinerary_expedition_id_day_number_key`(`expedition_id`, `day_number`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `expedition_image` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `expedition_id` INTEGER NOT NULL,
    `image_url` VARCHAR(1000) NOT NULL,
    `alt_text` VARCHAR(255) NULL,
    `caption` VARCHAR(255) NULL,
    `sort_order` INTEGER NOT NULL DEFAULT 0,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `expedition_image_expedition_id_sort_order_idx`(`expedition_id`, `sort_order`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `gallery` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `image_url` VARCHAR(1000) NOT NULL,
    `alt_text` VARCHAR(255) NULL,
    `sort_order` INTEGER NOT NULL DEFAULT 0,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `gallery_is_active_sort_order_idx`(`is_active`, `sort_order`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `contact` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(150) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `phone` VARCHAR(30) NULL,
    `subject` VARCHAR(255) NULL,
    `message` TEXT NOT NULL,
    `trek_id` INTEGER NULL,
    `expedition_id` INTEGER NULL,
    `status` ENUM('READ', 'UNREAD') NOT NULL DEFAULT 'UNREAD',
    `admin_notes` TEXT NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `contact_status_created_at_idx`(`status`, `created_at`),
    INDEX `contact_email_idx`(`email`),
    INDEX `contact_trek_id_idx`(`trek_id`),
    INDEX `contact_expedition_id_idx`(`expedition_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `site_settings` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `logo_url` VARCHAR(1000) NULL,
    `hero_image_url` VARCHAR(1000) NULL,
    `contact_email` VARCHAR(255) NULL,
    `contact_phone` VARCHAR(30) NULL,
    `address` TEXT NULL,
    `facebook_url` VARCHAR(500) NULL,
    `instagram_url` VARCHAR(500) NULL,
    `youtube_url` VARCHAR(500) NULL,
    `footer_text` TEXT NULL,
    `updated_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `refresh_token` ADD CONSTRAINT `refresh_token_admin_id_fkey` FOREIGN KEY (`admin_id`) REFERENCES `admin`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reset_password_token` ADD CONSTRAINT `reset_password_token_admin_id_fkey` FOREIGN KEY (`admin_id`) REFERENCES `admin`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `trek` ADD CONSTRAINT `trek_region_id_fkey` FOREIGN KEY (`region_id`) REFERENCES `region`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `trek` ADD CONSTRAINT `trek_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `admin`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `trek_season` ADD CONSTRAINT `trek_season_trek_id_fkey` FOREIGN KEY (`trek_id`) REFERENCES `trek`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `trek_season` ADD CONSTRAINT `trek_season_season_id_fkey` FOREIGN KEY (`season_id`) REFERENCES `season`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `trek_month` ADD CONSTRAINT `trek_month_trek_id_fkey` FOREIGN KEY (`trek_id`) REFERENCES `trek`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `trek_itinerary` ADD CONSTRAINT `trek_itinerary_trek_id_fkey` FOREIGN KEY (`trek_id`) REFERENCES `trek`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `trek_image` ADD CONSTRAINT `trek_image_trek_id_fkey` FOREIGN KEY (`trek_id`) REFERENCES `trek`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `expedition` ADD CONSTRAINT `expedition_region_id_fkey` FOREIGN KEY (`region_id`) REFERENCES `region`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `expedition` ADD CONSTRAINT `expedition_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `admin`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `expedition_season` ADD CONSTRAINT `expedition_season_expedition_id_fkey` FOREIGN KEY (`expedition_id`) REFERENCES `expedition`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `expedition_season` ADD CONSTRAINT `expedition_season_season_id_fkey` FOREIGN KEY (`season_id`) REFERENCES `season`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `expedition_itinerary` ADD CONSTRAINT `expedition_itinerary_expedition_id_fkey` FOREIGN KEY (`expedition_id`) REFERENCES `expedition`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `expedition_image` ADD CONSTRAINT `expedition_image_expedition_id_fkey` FOREIGN KEY (`expedition_id`) REFERENCES `expedition`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `contact` ADD CONSTRAINT `contact_trek_id_fkey` FOREIGN KEY (`trek_id`) REFERENCES `trek`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `contact` ADD CONSTRAINT `contact_expedition_id_fkey` FOREIGN KEY (`expedition_id`) REFERENCES `expedition`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
