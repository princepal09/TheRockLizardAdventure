/*
  Warnings:

  - Added the required column `image_public_id` to the `expedition_image` table without a default value. This is not possible if the table is not empty.
  - Added the required column `image_public_id` to the `gallery` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `expedition_image` ADD COLUMN `image_public_id` VARCHAR(1000) NOT NULL;

-- AlterTable
ALTER TABLE `gallery` ADD COLUMN `image_public_id` VARCHAR(1000) NOT NULL;
