-- CreateTable
CREATE TABLE `staticticsForCentury` (
    `id` VARCHAR(191) NOT NULL,
    `objectName` VARCHAR(191) NULL,
    `objectReferenceId` VARCHAR(191) NOT NULL DEFAULT 'biblioteca',
    `year` INTEGER NOT NULL,
    `totalYear` INTEGER NOT NULL DEFAULT 0,
    `updateAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
