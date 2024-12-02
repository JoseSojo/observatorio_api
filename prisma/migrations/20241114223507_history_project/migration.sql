/*
  Warnings:

  - Added the required column `projectId` to the `historyProject` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `historyProject` ADD COLUMN `projectId` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `historyProject` ADD CONSTRAINT `historyProject_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `projects`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
