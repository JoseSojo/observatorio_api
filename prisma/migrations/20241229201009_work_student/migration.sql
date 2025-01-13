-- CreateTable
CREATE TABLE `cursosProfile` (
    `id` VARCHAR(191) NOT NULL,
    `tipo` VARCHAR(191) NOT NULL,
    `horas` INTEGER NOT NULL,
    `country` VARCHAR(191) NOT NULL,
    `institucion` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `area` VARCHAR(191) NOT NULL,
    `subarea` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `deleteAt` VARCHAR(191) NULL,
    `createAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updateAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `cursosProfile` ADD CONSTRAINT `cursosProfile_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
