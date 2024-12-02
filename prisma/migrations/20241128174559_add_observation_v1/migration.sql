-- AlterTable
ALTER TABLE `user` ADD COLUMN `age` INTEGER NULL,
    ADD COLUMN `birtdate` DATETIME(3) NULL,
    ADD COLUMN `estadoCivil` VARCHAR(191) NULL,
    ADD COLUMN `nacionality` VARCHAR(191) NULL,
    ADD COLUMN `parroquiaId` VARCHAR(191) NULL,
    ADD COLUMN `secondLastname` VARCHAR(191) NULL,
    ADD COLUMN `secondName` VARCHAR(191) NULL,
    ADD COLUMN `sexo` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `configState` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `createById` VARCHAR(191) NOT NULL,
    `deleteAt` VARCHAR(191) NULL,
    `updateAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `configMunicipio` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `stateId` VARCHAR(191) NOT NULL,
    `createById` VARCHAR(191) NOT NULL,
    `deleteAt` VARCHAR(191) NULL,
    `updateAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `configParroquia` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `municipioId` VARCHAR(191) NOT NULL,
    `createById` VARCHAR(191) NOT NULL,
    `deleteAt` VARCHAR(191) NULL,
    `updateAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `configNucleo` (
    `id` VARCHAR(191) NOT NULL,
    `parroquiaId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `createById` VARCHAR(191) NOT NULL,
    `deleteAt` VARCHAR(191) NULL,
    `updateAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `user` ADD CONSTRAINT `user_parroquiaId_fkey` FOREIGN KEY (`parroquiaId`) REFERENCES `configParroquia`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `configState` ADD CONSTRAINT `configState_createById_fkey` FOREIGN KEY (`createById`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `configMunicipio` ADD CONSTRAINT `configMunicipio_stateId_fkey` FOREIGN KEY (`stateId`) REFERENCES `configState`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `configMunicipio` ADD CONSTRAINT `configMunicipio_createById_fkey` FOREIGN KEY (`createById`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `configParroquia` ADD CONSTRAINT `configParroquia_municipioId_fkey` FOREIGN KEY (`municipioId`) REFERENCES `configMunicipio`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `configParroquia` ADD CONSTRAINT `configParroquia_createById_fkey` FOREIGN KEY (`createById`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `configNucleo` ADD CONSTRAINT `configNucleo_parroquiaId_fkey` FOREIGN KEY (`parroquiaId`) REFERENCES `configParroquia`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `configNucleo` ADD CONSTRAINT `configNucleo_createById_fkey` FOREIGN KEY (`createById`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
