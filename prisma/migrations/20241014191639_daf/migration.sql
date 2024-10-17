/*
  Warnings:

  - You are about to drop the `Permissons` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `Permissons` DROP FOREIGN KEY `Permissons_createById_fkey`;

-- DropTable
DROP TABLE `Permissons`;

-- CreateTable
CREATE TABLE `Permits` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `roles` JSON NOT NULL,
    `createById` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Permits_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Permits` ADD CONSTRAINT `Permits_createById_fkey` FOREIGN KEY (`createById`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
