-- CreateTable
CREATE TABLE `History` (
    `id` VARCHAR(191) NOT NULL,
    `eventName` VARCHAR(191) NULL,
    `objectName` VARCHAR(191) NULL,
    `objectReferenceModel` VARCHAR(191) NULL,
    `objectReferenceId` VARCHAR(191) NULL,
    `createAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `StaticticsForMonth` (
    `id` VARCHAR(191) NOT NULL,
    `eventName` VARCHAR(191) NULL,
    `objectName` VARCHAR(191) NULL,
    `objectReferenceModel` VARCHAR(191) NULL,
    `objectReferenceId` VARCHAR(191) NULL,
    `monthName` VARCHAR(191) NOT NULL,
    `monthNumber` VARCHAR(191) NOT NULL,
    `totalMonth` INTEGER NOT NULL,
    `totalDay1` INTEGER NOT NULL,
    `totalDay2` INTEGER NOT NULL,
    `totalDay3` INTEGER NOT NULL,
    `totalDay4` INTEGER NOT NULL,
    `totalDay5` INTEGER NOT NULL,
    `totalDay6` INTEGER NOT NULL,
    `totalDay7` INTEGER NOT NULL,
    `totalDay8` INTEGER NOT NULL,
    `totalDay9` INTEGER NOT NULL,
    `totalDay10` INTEGER NOT NULL,
    `totalDay11` INTEGER NOT NULL,
    `totalDay12` INTEGER NOT NULL,
    `totalDay13` INTEGER NOT NULL,
    `totalDay14` INTEGER NOT NULL,
    `totalDay15` INTEGER NOT NULL,
    `totalDay16` INTEGER NOT NULL,
    `totalDay17` INTEGER NOT NULL,
    `totalDay18` INTEGER NOT NULL,
    `totalDay19` INTEGER NOT NULL,
    `totalDay20` INTEGER NOT NULL,
    `totalDay21` INTEGER NOT NULL,
    `totalDay22` INTEGER NOT NULL,
    `totalDay23` INTEGER NOT NULL,
    `totalDay24` INTEGER NOT NULL,
    `totalDay25` INTEGER NOT NULL,
    `totalDay26` INTEGER NOT NULL,
    `totalDay27` INTEGER NOT NULL,
    `totalDay28` INTEGER NOT NULL,
    `totalDay29` INTEGER NOT NULL,
    `totalDay30` INTEGER NOT NULL,
    `totalDay31` INTEGER NOT NULL,
    `updateAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `StaticticsForYear` (
    `id` VARCHAR(191) NOT NULL,
    `eventName` VARCHAR(191) NULL,
    `objectName` VARCHAR(191) NULL,
    `objectReferenceModel` VARCHAR(191) NULL,
    `objectReferenceId` VARCHAR(191) NULL,
    `year` INTEGER NOT NULL,
    `totalYear` INTEGER NOT NULL,
    `totalMonth1` INTEGER NOT NULL,
    `totalMonth2` INTEGER NOT NULL,
    `totalMonth3` INTEGER NOT NULL,
    `totalMonth4` INTEGER NOT NULL,
    `totalMonth5` INTEGER NOT NULL,
    `totalMonth6` INTEGER NOT NULL,
    `totalMonth7` INTEGER NOT NULL,
    `totalMonth8` INTEGER NOT NULL,
    `totalMonth9` INTEGER NOT NULL,
    `totalMonth10` INTEGER NOT NULL,
    `totalMonth11` INTEGER NOT NULL,
    `totalMonth12` INTEGER NOT NULL,
    `updateAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
