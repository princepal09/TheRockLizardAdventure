/*
  Warnings:

  - The primary key for the `admin` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `contact` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `expedition` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `expedition_image` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `expedition_itinerary` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `expedition_season` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `gallery` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `refresh_token` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `region` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `reset_password_token` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `season` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `site_settings` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `trek` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `trek_image` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `trek_itinerary` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `trek_month` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `trek_season` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE `contact` DROP FOREIGN KEY `contact_expedition_id_fkey`;

-- DropForeignKey
ALTER TABLE `contact` DROP FOREIGN KEY `contact_trek_id_fkey`;

-- DropForeignKey
ALTER TABLE `expedition` DROP FOREIGN KEY `expedition_created_by_fkey`;

-- DropForeignKey
ALTER TABLE `expedition` DROP FOREIGN KEY `expedition_region_id_fkey`;

-- DropForeignKey
ALTER TABLE `expedition_image` DROP FOREIGN KEY `expedition_image_expedition_id_fkey`;

-- DropForeignKey
ALTER TABLE `expedition_itinerary` DROP FOREIGN KEY `expedition_itinerary_expedition_id_fkey`;

-- DropForeignKey
ALTER TABLE `expedition_season` DROP FOREIGN KEY `expedition_season_expedition_id_fkey`;

-- DropForeignKey
ALTER TABLE `expedition_season` DROP FOREIGN KEY `expedition_season_season_id_fkey`;

-- DropForeignKey
ALTER TABLE `refresh_token` DROP FOREIGN KEY `refresh_token_admin_id_fkey`;

-- DropForeignKey
ALTER TABLE `reset_password_token` DROP FOREIGN KEY `reset_password_token_admin_id_fkey`;

-- DropForeignKey
ALTER TABLE `trek` DROP FOREIGN KEY `trek_created_by_fkey`;

-- DropForeignKey
ALTER TABLE `trek` DROP FOREIGN KEY `trek_region_id_fkey`;

-- DropForeignKey
ALTER TABLE `trek_image` DROP FOREIGN KEY `trek_image_trek_id_fkey`;

-- DropForeignKey
ALTER TABLE `trek_itinerary` DROP FOREIGN KEY `trek_itinerary_trek_id_fkey`;

-- DropForeignKey
ALTER TABLE `trek_month` DROP FOREIGN KEY `trek_month_trek_id_fkey`;

-- DropForeignKey
ALTER TABLE `trek_season` DROP FOREIGN KEY `trek_season_season_id_fkey`;

-- DropForeignKey
ALTER TABLE `trek_season` DROP FOREIGN KEY `trek_season_trek_id_fkey`;

-- AlterTable
ALTER TABLE `admin` DROP PRIMARY KEY,
    MODIFY `id` CHAR(36) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `contact` DROP PRIMARY KEY,
    MODIFY `id` CHAR(36) NOT NULL,
    MODIFY `trek_id` CHAR(36) NULL,
    MODIFY `expedition_id` CHAR(36) NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `expedition` DROP PRIMARY KEY,
    MODIFY `id` CHAR(36) NOT NULL,
    MODIFY `region_id` CHAR(36) NOT NULL,
    MODIFY `created_by` CHAR(36) NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `expedition_image` DROP PRIMARY KEY,
    MODIFY `id` CHAR(36) NOT NULL,
    MODIFY `expedition_id` CHAR(36) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `expedition_itinerary` DROP PRIMARY KEY,
    MODIFY `id` CHAR(36) NOT NULL,
    MODIFY `expedition_id` CHAR(36) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `expedition_season` DROP PRIMARY KEY,
    MODIFY `expedition_id` CHAR(36) NOT NULL,
    MODIFY `season_id` CHAR(36) NOT NULL,
    ADD PRIMARY KEY (`expedition_id`, `season_id`);

-- AlterTable
ALTER TABLE `gallery` DROP PRIMARY KEY,
    MODIFY `id` CHAR(36) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `refresh_token` DROP PRIMARY KEY,
    MODIFY `id` CHAR(36) NOT NULL,
    MODIFY `admin_id` CHAR(36) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `region` DROP PRIMARY KEY,
    MODIFY `id` CHAR(36) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `reset_password_token` DROP PRIMARY KEY,
    MODIFY `id` CHAR(36) NOT NULL,
    MODIFY `admin_id` CHAR(36) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `season` DROP PRIMARY KEY,
    MODIFY `id` CHAR(36) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `site_settings` DROP PRIMARY KEY,
    MODIFY `id` CHAR(36) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `trek` DROP PRIMARY KEY,
    MODIFY `id` CHAR(36) NOT NULL,
    MODIFY `region_id` CHAR(36) NOT NULL,
    MODIFY `created_by` CHAR(36) NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `trek_image` DROP PRIMARY KEY,
    MODIFY `id` CHAR(36) NOT NULL,
    MODIFY `trek_id` CHAR(36) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `trek_itinerary` DROP PRIMARY KEY,
    MODIFY `id` CHAR(36) NOT NULL,
    MODIFY `trek_id` CHAR(36) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `trek_month` DROP PRIMARY KEY,
    MODIFY `trek_id` CHAR(36) NOT NULL,
    ADD PRIMARY KEY (`trek_id`, `month`);

-- AlterTable
ALTER TABLE `trek_season` DROP PRIMARY KEY,
    MODIFY `trek_id` CHAR(36) NOT NULL,
    MODIFY `season_id` CHAR(36) NOT NULL,
    ADD PRIMARY KEY (`trek_id`, `season_id`);

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
