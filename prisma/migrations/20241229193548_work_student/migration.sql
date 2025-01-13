/*
  Warnings:

  - You are about to drop the column `dateEnd` on the `educationProfile` table. All the data in the column will be lost.
  - You are about to drop the column `dateStart` on the `educationProfile` table. All the data in the column will be lost.
  - You are about to drop the column `duration` on the `educationProfile` table. All the data in the column will be lost.
  - You are about to drop the column `formato` on the `educationProfile` table. All the data in the column will be lost.
  - You are about to drop the column `titulo` on the `educationProfile` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `educationProfile` table. All the data in the column will be lost.
  - You are about to drop the column `ubication` on the `educationProfile` table. All the data in the column will be lost.
  - Added the required column `area` to the `educationProfile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `countryId` to the `educationProfile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nivel` to the `educationProfile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `profesion` to the `educationProfile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subarea` to the `educationProfile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `yearEnd` to the `educationProfile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `educationProfile` DROP COLUMN `dateEnd`,
    DROP COLUMN `dateStart`,
    DROP COLUMN `duration`,
    DROP COLUMN `formato`,
    DROP COLUMN `titulo`,
    DROP COLUMN `type`,
    DROP COLUMN `ubication`,
    ADD COLUMN `area` VARCHAR(191) NOT NULL,
    ADD COLUMN `countryId` VARCHAR(191) NOT NULL,
    ADD COLUMN `nivel` VARCHAR(191) NOT NULL,
    ADD COLUMN `profesion` VARCHAR(191) NOT NULL,
    ADD COLUMN `subarea` VARCHAR(191) NOT NULL,
    ADD COLUMN `yearEnd` VARCHAR(191) NOT NULL;
