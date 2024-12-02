-- DropForeignKey
ALTER TABLE `userGroup` DROP FOREIGN KEY `userGroup_createById_fkey`;

-- AlterTable
ALTER TABLE `userGroup` MODIFY `createById` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `userGroup` ADD CONSTRAINT `userGroup_createById_fkey` FOREIGN KEY (`createById`) REFERENCES `user`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
