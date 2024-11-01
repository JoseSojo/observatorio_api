-- DropForeignKey
ALTER TABLE `Notification` DROP FOREIGN KEY `Notification_userForId_fkey`;

-- AlterTable
ALTER TABLE `Notification` MODIFY `userForId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Notification` ADD CONSTRAINT `Notification_userForId_fkey` FOREIGN KEY (`userForId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
