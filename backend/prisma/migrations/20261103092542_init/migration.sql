/*
  Warnings:

  - You are about to drop the column `footer_text` on the `site_settings` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `site_settings` DROP COLUMN `footer_text`,
    ADD COLUMN `hero_image_public_id` VARCHAR(1000) NULL,
    ADD COLUMN `logo_public_id` VARCHAR(1000) NULL,
    ADD COLUMN `whatsapp_phone` VARCHAR(30) NULL;
