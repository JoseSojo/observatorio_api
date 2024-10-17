-- AlterTable
ALTER TABLE `User` ADD COLUMN `languajeId` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `ConfigLanguaje` (
    `id` VARCHAR(191) NOT NULL,
    `payload` VARCHAR(191) NOT NULL,
    `label` VARCHAR(191) NOT NULL,
    `createById` VARCHAR(191) NULL,
    `isDelete` BOOLEAN NOT NULL DEFAULT false,
    `createAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updateAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_languajeId_fkey` FOREIGN KEY (`languajeId`) REFERENCES `ConfigLanguaje`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ConfigLanguaje` ADD CONSTRAINT `ConfigLanguaje_createById_fkey` FOREIGN KEY (`createById`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
