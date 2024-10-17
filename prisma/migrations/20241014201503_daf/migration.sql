-- DropForeignKey
ALTER TABLE `Permits` DROP FOREIGN KEY `Permits_createById_fkey`;

-- AlterTable
ALTER TABLE `Permits` MODIFY `createById` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Permits` ADD CONSTRAINT `Permits_createById_fkey` FOREIGN KEY (`createById`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
