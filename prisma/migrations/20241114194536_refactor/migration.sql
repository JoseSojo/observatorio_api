/*
  Warnings:

  - You are about to drop the column `create_at` on the `author` table. All the data in the column will be lost.
  - You are about to drop the column `create_by_id` on the `author` table. All the data in the column will be lost.
  - You are about to drop the column `delete_at` on the `author` table. All the data in the column will be lost.
  - You are about to drop the column `update_at` on the `author` table. All the data in the column will be lost.
  - You are about to drop the column `create_at` on the `projects` table. All the data in the column will be lost.
  - You are about to drop the column `delete_at` on the `projects` table. All the data in the column will be lost.
  - You are about to drop the column `update_at` on the `projects` table. All the data in the column will be lost.
  - You are about to drop the `config_category` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `config_document` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `config_investigation_line` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `config_program` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `history_project` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `statictics_for_month` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `statictics_for_year` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user_group` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `createById` to the `author` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `author` DROP FOREIGN KEY `author_create_by_id_fkey`;

-- DropForeignKey
ALTER TABLE `config_category` DROP FOREIGN KEY `config_category_create_by_id_fkey`;

-- DropForeignKey
ALTER TABLE `config_document` DROP FOREIGN KEY `config_document_create_by_id_fkey`;

-- DropForeignKey
ALTER TABLE `config_investigation_line` DROP FOREIGN KEY `config_investigation_line_create_by_id_fkey`;

-- DropForeignKey
ALTER TABLE `config_program` DROP FOREIGN KEY `config_program_category_id_fkey`;

-- DropForeignKey
ALTER TABLE `config_program` DROP FOREIGN KEY `config_program_create_by_id_fkey`;

-- DropForeignKey
ALTER TABLE `history_project` DROP FOREIGN KEY `history_project_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `projects` DROP FOREIGN KEY `projects_document_id_fkey`;

-- DropForeignKey
ALTER TABLE `projects` DROP FOREIGN KEY `projects_line_id_fkey`;

-- DropForeignKey
ALTER TABLE `projects` DROP FOREIGN KEY `projects_program_id_fkey`;

-- DropForeignKey
ALTER TABLE `user` DROP FOREIGN KEY `user_rolId_fkey`;

-- DropForeignKey
ALTER TABLE `user_group` DROP FOREIGN KEY `user_group_create_by_id_fkey`;

-- AlterTable
ALTER TABLE `author` DROP COLUMN `create_at`,
    DROP COLUMN `create_by_id`,
    DROP COLUMN `delete_at`,
    DROP COLUMN `update_at`,
    ADD COLUMN `createAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `createById` VARCHAR(191) NOT NULL,
    ADD COLUMN `deleteAt` DATETIME(3) NULL,
    ADD COLUMN `updateAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `projects` DROP COLUMN `create_at`,
    DROP COLUMN `delete_at`,
    DROP COLUMN `update_at`,
    ADD COLUMN `createAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `deleteAt` DATETIME(3) NULL,
    ADD COLUMN `updateAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3);

-- DropTable
DROP TABLE `config_category`;

-- DropTable
DROP TABLE `config_document`;

-- DropTable
DROP TABLE `config_investigation_line`;

-- DropTable
DROP TABLE `config_program`;

-- DropTable
DROP TABLE `history_project`;

-- DropTable
DROP TABLE `statictics_for_month`;

-- DropTable
DROP TABLE `statictics_for_year`;

-- DropTable
DROP TABLE `user_group`;

-- CreateTable
CREATE TABLE `userGroup` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `group` JSON NOT NULL,
    `createById` VARCHAR(191) NOT NULL,
    `deleteAt` DATETIME(3) NULL,
    `createAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updateAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `historyProject` (
    `id` VARCHAR(191) NOT NULL,
    `eventName` VARCHAR(191) NOT NULL,
    `userAuth` BOOLEAN NOT NULL DEFAULT false,
    `userId` VARCHAR(191) NULL,
    `deleteAt` DATETIME(3) NULL,
    `createAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updateAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `configDocument` (
    `id` VARCHAR(191) NOT NULL,
    `size` DECIMAL(65, 30) NOT NULL,
    `original_name` VARCHAR(191) NOT NULL,
    `path` VARCHAR(191) NOT NULL,
    `mimy_type` VARCHAR(191) NOT NULL,
    `createById` VARCHAR(191) NOT NULL,
    `deleteAt` DATETIME(3) NULL,
    `updateAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `configCategory` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `createById` VARCHAR(191) NOT NULL,
    `deleteAt` DATETIME(3) NULL,
    `updateAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `configCategory_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `configProgram` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `category_id` VARCHAR(191) NOT NULL,
    `createById` VARCHAR(191) NOT NULL,
    `deleteAt` DATETIME(3) NULL,
    `updateAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `configProgram_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `configInvestigationLine` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `createById` VARCHAR(191) NOT NULL,
    `deleteAt` DATETIME(3) NULL,
    `updateAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `staticticsForMonth` (
    `id` VARCHAR(191) NOT NULL,
    `objectName` VARCHAR(191) NULL,
    `objectReferenceId` VARCHAR(191) NOT NULL DEFAULT 'biblioteca',
    `year` INTEGER NOT NULL,
    `monthName` VARCHAR(191) NOT NULL,
    `monthNumber` INTEGER NOT NULL,
    `totalMonth` INTEGER NOT NULL DEFAULT 0,
    `totalDay1` INTEGER NOT NULL DEFAULT 0,
    `totalDay2` INTEGER NOT NULL DEFAULT 0,
    `totalDay3` INTEGER NOT NULL DEFAULT 0,
    `totalDay4` INTEGER NOT NULL DEFAULT 0,
    `totalDay5` INTEGER NOT NULL DEFAULT 0,
    `totalDay6` INTEGER NOT NULL DEFAULT 0,
    `totalDay7` INTEGER NOT NULL DEFAULT 0,
    `totalDay8` INTEGER NOT NULL DEFAULT 0,
    `totalDay9` INTEGER NOT NULL DEFAULT 0,
    `totalDay10` INTEGER NOT NULL DEFAULT 0,
    `totalDay11` INTEGER NOT NULL DEFAULT 0,
    `totalDay12` INTEGER NOT NULL DEFAULT 0,
    `totalDay13` INTEGER NOT NULL DEFAULT 0,
    `totalDay14` INTEGER NOT NULL DEFAULT 0,
    `totalDay15` INTEGER NOT NULL DEFAULT 0,
    `totalDay16` INTEGER NOT NULL DEFAULT 0,
    `totalDay17` INTEGER NOT NULL DEFAULT 0,
    `totalDay18` INTEGER NOT NULL DEFAULT 0,
    `totalDay19` INTEGER NOT NULL DEFAULT 0,
    `totalDay20` INTEGER NOT NULL DEFAULT 0,
    `totalDay21` INTEGER NOT NULL DEFAULT 0,
    `totalDay22` INTEGER NOT NULL DEFAULT 0,
    `totalDay23` INTEGER NOT NULL DEFAULT 0,
    `totalDay24` INTEGER NOT NULL DEFAULT 0,
    `totalDay25` INTEGER NOT NULL DEFAULT 0,
    `totalDay26` INTEGER NOT NULL DEFAULT 0,
    `totalDay27` INTEGER NOT NULL DEFAULT 0,
    `totalDay28` INTEGER NOT NULL DEFAULT 0,
    `totalDay29` INTEGER NOT NULL DEFAULT 0,
    `totalDay30` INTEGER NOT NULL DEFAULT 0,
    `totalDay31` INTEGER NOT NULL DEFAULT 0,
    `updateAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `staticticsForYear` (
    `id` VARCHAR(191) NOT NULL,
    `objectName` VARCHAR(191) NULL,
    `objectReferenceId` VARCHAR(191) NOT NULL DEFAULT 'biblioteca',
    `year` INTEGER NOT NULL,
    `totalYear` INTEGER NOT NULL DEFAULT 0,
    `totalMonth1` INTEGER NOT NULL DEFAULT 0,
    `totalMonth2` INTEGER NOT NULL DEFAULT 0,
    `totalMonth3` INTEGER NOT NULL DEFAULT 0,
    `totalMonth4` INTEGER NOT NULL DEFAULT 0,
    `totalMonth5` INTEGER NOT NULL DEFAULT 0,
    `totalMonth6` INTEGER NOT NULL DEFAULT 0,
    `totalMonth7` INTEGER NOT NULL DEFAULT 0,
    `totalMonth8` INTEGER NOT NULL DEFAULT 0,
    `totalMonth9` INTEGER NOT NULL DEFAULT 0,
    `totalMonth10` INTEGER NOT NULL DEFAULT 0,
    `totalMonth11` INTEGER NOT NULL DEFAULT 0,
    `totalMonth12` INTEGER NOT NULL DEFAULT 0,
    `updateAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `user` ADD CONSTRAINT `user_rolId_fkey` FOREIGN KEY (`rolId`) REFERENCES `userGroup`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `userGroup` ADD CONSTRAINT `userGroup_createById_fkey` FOREIGN KEY (`createById`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `author` ADD CONSTRAINT `author_createById_fkey` FOREIGN KEY (`createById`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `projects` ADD CONSTRAINT `projects_program_id_fkey` FOREIGN KEY (`program_id`) REFERENCES `configProgram`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `projects` ADD CONSTRAINT `projects_line_id_fkey` FOREIGN KEY (`line_id`) REFERENCES `configInvestigationLine`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `projects` ADD CONSTRAINT `projects_document_id_fkey` FOREIGN KEY (`document_id`) REFERENCES `configDocument`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `historyProject` ADD CONSTRAINT `historyProject_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `configDocument` ADD CONSTRAINT `configDocument_createById_fkey` FOREIGN KEY (`createById`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `configCategory` ADD CONSTRAINT `configCategory_createById_fkey` FOREIGN KEY (`createById`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `configProgram` ADD CONSTRAINT `configProgram_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `configCategory`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `configProgram` ADD CONSTRAINT `configProgram_createById_fkey` FOREIGN KEY (`createById`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `configInvestigationLine` ADD CONSTRAINT `configInvestigationLine_createById_fkey` FOREIGN KEY (`createById`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
