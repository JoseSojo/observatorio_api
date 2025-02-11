-- AlterTable
ALTER TABLE `configInvestigationLine` ADD COLUMN `parentId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `configInvestigationLine` ADD CONSTRAINT `configInvestigationLine_parentId_fkey` FOREIGN KEY (`parentId`) REFERENCES `configInvestigationLine`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
