/*
  Warnings:

  - Added the required column `createById` to the `ConfigCity` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createById` to the `ConfigCountry` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createById` to the `ConfigState` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `ConfigCity` ADD COLUMN `createById` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `ConfigCountry` ADD COLUMN `createById` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `ConfigState` ADD COLUMN `createById` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `ConfigCountry` ADD CONSTRAINT `ConfigCountry_createById_fkey` FOREIGN KEY (`createById`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ConfigState` ADD CONSTRAINT `ConfigState_createById_fkey` FOREIGN KEY (`createById`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ConfigCity` ADD CONSTRAINT `ConfigCity_createById_fkey` FOREIGN KEY (`createById`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
