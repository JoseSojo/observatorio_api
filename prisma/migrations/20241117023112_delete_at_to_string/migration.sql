-- AlterTable
ALTER TABLE `author` MODIFY `deleteAt` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `configCategory` MODIFY `deleteAt` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `configDocument` MODIFY `deleteAt` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `configInvestigationLine` MODIFY `deleteAt` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `configProgram` MODIFY `deleteAt` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `historyProject` MODIFY `deleteAt` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `projects` MODIFY `deleteAt` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `user` MODIFY `deleteAt` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `userGroup` MODIFY `deleteAt` VARCHAR(191) NULL;
