-- DropForeignKey
ALTER TABLE `projects` DROP FOREIGN KEY `projects_lineId_fkey`;

-- AlterTable
ALTER TABLE `projects` MODIFY `lineId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `projects` ADD CONSTRAINT `projects_lineId_fkey` FOREIGN KEY (`lineId`) REFERENCES `configInvestigationLine`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
