/*
  Warnings:

  - You are about to drop the column `projects_id` on the `author` table. All the data in the column will be lost.
  - You are about to drop the column `mimy_type` on the `configDocument` table. All the data in the column will be lost.
  - You are about to drop the column `original_name` on the `configDocument` table. All the data in the column will be lost.
  - You are about to drop the column `category_id` on the `configProgram` table. All the data in the column will be lost.
  - You are about to drop the column `create_at` on the `history` table. All the data in the column will be lost.
  - You are about to drop the column `event_name` on the `history` table. All the data in the column will be lost.
  - You are about to drop the column `object_name` on the `history` table. All the data in the column will be lost.
  - You are about to drop the column `object_reference_id` on the `history` table. All the data in the column will be lost.
  - You are about to drop the column `document_id` on the `projects` table. All the data in the column will be lost.
  - You are about to drop the column `line_id` on the `projects` table. All the data in the column will be lost.
  - You are about to drop the column `program_id` on the `projects` table. All the data in the column will be lost.
  - Added the required column `projectsId` to the `author` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mimyType` to the `configDocument` table without a default value. This is not possible if the table is not empty.
  - Added the required column `originalName` to the `configDocument` table without a default value. This is not possible if the table is not empty.
  - Added the required column `categoryId` to the `configProgram` table without a default value. This is not possible if the table is not empty.
  - Added the required column `documentId` to the `projects` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lineId` to the `projects` table without a default value. This is not possible if the table is not empty.
  - Added the required column `programId` to the `projects` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `author` DROP FOREIGN KEY `author_projects_id_fkey`;

-- DropForeignKey
ALTER TABLE `configProgram` DROP FOREIGN KEY `configProgram_category_id_fkey`;

-- DropForeignKey
ALTER TABLE `projects` DROP FOREIGN KEY `projects_document_id_fkey`;

-- DropForeignKey
ALTER TABLE `projects` DROP FOREIGN KEY `projects_line_id_fkey`;

-- DropForeignKey
ALTER TABLE `projects` DROP FOREIGN KEY `projects_program_id_fkey`;

-- AlterTable
ALTER TABLE `author` DROP COLUMN `projects_id`,
    ADD COLUMN `projectsId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `configDocument` DROP COLUMN `mimy_type`,
    DROP COLUMN `original_name`,
    ADD COLUMN `mimyType` VARCHAR(191) NOT NULL,
    ADD COLUMN `originalName` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `configProgram` DROP COLUMN `category_id`,
    ADD COLUMN `categoryId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `history` DROP COLUMN `create_at`,
    DROP COLUMN `event_name`,
    DROP COLUMN `object_name`,
    DROP COLUMN `object_reference_id`,
    ADD COLUMN `createAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `eventName` VARCHAR(191) NULL,
    ADD COLUMN `objectName` VARCHAR(191) NULL,
    ADD COLUMN `objectReferenceId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `projects` DROP COLUMN `document_id`,
    DROP COLUMN `line_id`,
    DROP COLUMN `program_id`,
    ADD COLUMN `documentId` VARCHAR(191) NOT NULL,
    ADD COLUMN `lineId` VARCHAR(191) NOT NULL,
    ADD COLUMN `programId` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `author` ADD CONSTRAINT `author_projectsId_fkey` FOREIGN KEY (`projectsId`) REFERENCES `projects`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `projects` ADD CONSTRAINT `projects_programId_fkey` FOREIGN KEY (`programId`) REFERENCES `configProgram`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `projects` ADD CONSTRAINT `projects_lineId_fkey` FOREIGN KEY (`lineId`) REFERENCES `configInvestigationLine`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `projects` ADD CONSTRAINT `projects_documentId_fkey` FOREIGN KEY (`documentId`) REFERENCES `configDocument`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `configProgram` ADD CONSTRAINT `configProgram_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `configCategory`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
