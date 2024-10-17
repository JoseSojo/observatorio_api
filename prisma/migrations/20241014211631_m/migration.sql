/*
  Warnings:

  - A unique constraint covering the columns `[coinId]` on the table `ConfigCountry` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `ConfigCity` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stateId` to the `ConfigCity` table without a default value. This is not possible if the table is not empty.
  - Added the required column `coinId` to the `ConfigCountry` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `ConfigCountry` table without a default value. This is not possible if the table is not empty.
  - Added the required column `prefixPhone` to the `ConfigCountry` table without a default value. This is not possible if the table is not empty.
  - Added the required column `countryId` to the `ConfigState` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `ConfigState` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `ConfigCity` ADD COLUMN `name` VARCHAR(191) NOT NULL,
    ADD COLUMN `stateId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `ConfigCountry` ADD COLUMN `coinId` VARCHAR(191) NOT NULL,
    ADD COLUMN `name` VARCHAR(191) NOT NULL,
    ADD COLUMN `prefixPhone` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `ConfigState` ADD COLUMN `countryId` VARCHAR(191) NOT NULL,
    ADD COLUMN `name` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `Coin` (
    `id` VARCHAR(191) NOT NULL,
    `prefix` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `isDelete` BOOLEAN NOT NULL DEFAULT false,
    `createAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updateAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `ConfigCountry_coinId_key` ON `ConfigCountry`(`coinId`);

-- AddForeignKey
ALTER TABLE `ConfigCountry` ADD CONSTRAINT `ConfigCountry_coinId_fkey` FOREIGN KEY (`coinId`) REFERENCES `Coin`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ConfigState` ADD CONSTRAINT `ConfigState_countryId_fkey` FOREIGN KEY (`countryId`) REFERENCES `ConfigCountry`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ConfigCity` ADD CONSTRAINT `ConfigCity_stateId_fkey` FOREIGN KEY (`stateId`) REFERENCES `ConfigState`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
