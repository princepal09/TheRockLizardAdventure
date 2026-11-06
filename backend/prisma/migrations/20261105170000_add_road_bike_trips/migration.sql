-- AlterTable
ALTER TABLE `contact` ADD COLUMN `trip_id` CHAR(36) NULL;

-- CreateTable
CREATE TABLE `trip` (
    `id` CHAR(36) NOT NULL,
    `trip_type` ENUM('ROAD', 'BIKE') NOT NULL,
    `vehicle_details` TEXT NULL,
    `name` VARCHAR(200) NOT NULL,
    `slug` VARCHAR(220) NOT NULL,
    `summary` VARCHAR(500) NULL,
    `description` TEXT NULL,
    `region_id` CHAR(36) NOT NULL,
    `difficulty` ENUM('EASY', 'MODERATE', 'DIFFICULT', 'VERY_DIFFICULT', 'EXTREME') NOT NULL,
    `status` ENUM('DRAFT', 'PUBLISHED', 'ARCHIVED') NOT NULL DEFAULT 'DRAFT',
    `duration_days` INTEGER NOT NULL,
    `distance_km` DECIMAL(8, 2) NULL,
    `max_altitude_meters` INTEGER NULL,
    `starting_point` VARCHAR(255) NULL,
    `ending_point` VARCHAR(255) NULL,
    `cover_image_url` VARCHAR(1000) NULL,
    `cover_image_public_id` VARCHAR(1000) NULL,
    `price` DECIMAL(10, 2) NULL,
    `discount_price` DECIMAL(10, 2) NULL,
    `currency` CHAR(3) NOT NULL DEFAULT 'INR',
    `max_group_size` INTEGER NULL,
    `min_age` INTEGER NULL,
    `max_age` INTEGER NULL,
    `is_featured` BOOLEAN NOT NULL DEFAULT false,
    `published_at` DATETIME(0) NULL,
    `created_by` CHAR(36) NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `departure_dates` TEXT NULL,
    `meeting_point` TEXT NULL,
    `inclusions` TEXT NULL,
    `exclusions` TEXT NULL,
    `required_gear` TEXT NULL,
    `cancellation_policy` TEXT NULL,
    `refund_policy` TEXT NULL,

    UNIQUE INDEX `trip_slug_key`(`slug`),
    INDEX `trip_region_id_status_idx`(`region_id`, `status`),
    INDEX `trip_status_is_featured_idx`(`status`, `is_featured`),
    INDEX `trip_status_published_at_idx`(`status`, `published_at`),
    INDEX `trip_difficulty_idx`(`difficulty`),
    INDEX `trip_status_trip_type_idx`(`status`, `trip_type`),
    INDEX `trip_created_by_idx`(`created_by`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `trip_season` (
    `trip_id` CHAR(36) NOT NULL,
    `season_id` CHAR(36) NOT NULL,

    INDEX `trip_season_season_id_idx`(`season_id`),
    PRIMARY KEY (`trip_id`, `season_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `trip_itinerary` (
    `id` CHAR(36) NOT NULL,
    `trip_id` CHAR(36) NOT NULL,
    `day_number` INTEGER NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,
    `distance_km` DECIMAL(8, 2) NULL,
    `altitude_meters` INTEGER NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `trip_itinerary_trip_id_day_number_key`(`trip_id`, `day_number`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `trip_image` (
    `id` CHAR(36) NOT NULL,
    `trip_id` CHAR(36) NOT NULL,
    `image_url` VARCHAR(1000) NOT NULL,
    `image_public_id` VARCHAR(1000) NOT NULL,
    `alt_text` VARCHAR(255) NULL,
    `caption` VARCHAR(255) NULL,
    `sort_order` INTEGER NOT NULL DEFAULT 0,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `trip_image_trip_id_sort_order_idx`(`trip_id`, `sort_order`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `trip` ADD CONSTRAINT `trip_region_id_fkey` FOREIGN KEY (`region_id`) REFERENCES `region`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `trip` ADD CONSTRAINT `trip_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `admin`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `trip_season` ADD CONSTRAINT `trip_season_trip_id_fkey` FOREIGN KEY (`trip_id`) REFERENCES `trip`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `trip_season` ADD CONSTRAINT `trip_season_season_id_fkey` FOREIGN KEY (`season_id`) REFERENCES `season`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `trip_itinerary` ADD CONSTRAINT `trip_itinerary_trip_id_fkey` FOREIGN KEY (`trip_id`) REFERENCES `trip`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `trip_image` ADD CONSTRAINT `trip_image_trip_id_fkey` FOREIGN KEY (`trip_id`) REFERENCES `trip`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `contact` ADD CONSTRAINT `contact_trip_id_fkey` FOREIGN KEY (`trip_id`) REFERENCES `trip`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
