-- CreateTable
CREATE TABLE `user` (
    `id` VARCHAR(191) NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `nacionality` VARCHAR(191) NULL,
    `ci` VARCHAR(191) NULL,
    `name` VARCHAR(191) NULL,
    `secondName` VARCHAR(191) NULL,
    `lastname` VARCHAR(191) NULL,
    `secondLastname` VARCHAR(191) NULL,
    `birtdate` DATETIME(3) NULL,
    `age` INTEGER NULL,
    `estadoCivil` VARCHAR(191) NULL,
    `sexo` VARCHAR(191) NULL,
    `email` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NULL,
    `phone2` VARCHAR(191) NULL,
    `email2` VARCHAR(191) NULL,
    `parroquiaId` VARCHAR(191) NULL,
    `token` VARCHAR(191) NULL,
    `deleteAt` VARCHAR(191) NULL,
    `createAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updateAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `parentId` VARCHAR(191) NULL,
    `rolId` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `educationProfile` (
    `id` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `titulo` VARCHAR(191) NOT NULL,
    `institucion` VARCHAR(191) NOT NULL,
    `dateStart` DATETIME(3) NOT NULL,
    `dateEnd` DATETIME(3) NOT NULL,
    `duration` INTEGER NULL,
    `ubication` VARCHAR(191) NOT NULL,
    `formato` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `deleteAt` VARCHAR(191) NULL,
    `createAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updateAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `workProfile` (
    `id` VARCHAR(191) NOT NULL,
    `empresa` VARCHAR(191) NOT NULL,
    `ubication` VARCHAR(191) NOT NULL,
    `puesto` VARCHAR(191) NOT NULL,
    `tipo` VARCHAR(191) NOT NULL,
    `dateStart` DATETIME(3) NOT NULL,
    `dateEnd` DATETIME(3) NOT NULL,
    `industria` VARCHAR(191) NOT NULL,
    `motivoSalida` VARCHAR(191) NULL,
    `description` VARCHAR(191) NULL,
    `userId` VARCHAR(191) NOT NULL,
    `deleteAt` VARCHAR(191) NULL,
    `createAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updateAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `userGroup` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `group` JSON NOT NULL,
    `createById` VARCHAR(191) NULL,
    `deleteAt` VARCHAR(191) NULL,
    `createAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updateAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `author` (
    `id` VARCHAR(191) NOT NULL,
    `projectsId` VARCHAR(191) NOT NULL,
    `createById` VARCHAR(191) NOT NULL,
    `deleteAt` VARCHAR(191) NULL,
    `createAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updateAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `projects` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(300) NOT NULL,
    `resumen` VARCHAR(500) NOT NULL,
    `keywords` VARCHAR(300) NOT NULL,
    `public` BOOLEAN NOT NULL DEFAULT true,
    `downloader` BOOLEAN NOT NULL DEFAULT true,
    `date` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NULL,
    `programId` VARCHAR(191) NOT NULL,
    `lineId` VARCHAR(191) NULL,
    `documentId` VARCHAR(191) NOT NULL,
    `deleteAt` VARCHAR(191) NULL,
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
    `projectId` VARCHAR(191) NOT NULL,
    `deleteAt` VARCHAR(191) NULL,
    `createAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updateAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

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

-- CreateTable
CREATE TABLE `configDocument` (
    `id` VARCHAR(191) NOT NULL,
    `size` DECIMAL(65, 30) NOT NULL,
    `originalName` VARCHAR(191) NOT NULL,
    `path` VARCHAR(191) NOT NULL,
    `donwload` VARCHAR(191) NOT NULL DEFAULT '',
    `mimyType` VARCHAR(191) NOT NULL,
    `createById` VARCHAR(191) NOT NULL,
    `deleteAt` VARCHAR(191) NULL,
    `updateAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `configCategory` (
    `id` VARCHAR(191) NOT NULL,
    `ident` VARCHAR(191) NOT NULL DEFAULT '',
    `name` VARCHAR(191) NOT NULL,
    `createById` VARCHAR(191) NOT NULL,
    `deleteAt` VARCHAR(191) NULL,
    `updateAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `configProgram` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `categoryId` VARCHAR(191) NOT NULL,
    `createById` VARCHAR(191) NOT NULL,
    `deleteAt` VARCHAR(191) NULL,
    `updateAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `configInvestigationLine` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `createById` VARCHAR(191) NOT NULL,
    `deleteAt` VARCHAR(191) NULL,
    `updateAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `history` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `ip` VARCHAR(191) NOT NULL,
    `browser` VARCHAR(191) NOT NULL,
    `eventName` VARCHAR(191) NOT NULL,
    `objectName` VARCHAR(191) NOT NULL,
    `objectId` VARCHAR(191) NOT NULL,
    `objectReference` VARCHAR(191) NOT NULL,
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
ALTER TABLE `user` ADD CONSTRAINT `user_parroquiaId_fkey` FOREIGN KEY (`parroquiaId`) REFERENCES `configParroquia`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user` ADD CONSTRAINT `user_parentId_fkey` FOREIGN KEY (`parentId`) REFERENCES `user`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user` ADD CONSTRAINT `user_rolId_fkey` FOREIGN KEY (`rolId`) REFERENCES `userGroup`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `educationProfile` ADD CONSTRAINT `educationProfile_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `workProfile` ADD CONSTRAINT `workProfile_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `userGroup` ADD CONSTRAINT `userGroup_createById_fkey` FOREIGN KEY (`createById`) REFERENCES `user`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `author` ADD CONSTRAINT `author_projectsId_fkey` FOREIGN KEY (`projectsId`) REFERENCES `projects`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `author` ADD CONSTRAINT `author_createById_fkey` FOREIGN KEY (`createById`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `projects` ADD CONSTRAINT `projects_programId_fkey` FOREIGN KEY (`programId`) REFERENCES `configProgram`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `projects` ADD CONSTRAINT `projects_lineId_fkey` FOREIGN KEY (`lineId`) REFERENCES `configInvestigationLine`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `projects` ADD CONSTRAINT `projects_documentId_fkey` FOREIGN KEY (`documentId`) REFERENCES `configDocument`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `historyProject` ADD CONSTRAINT `historyProject_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `historyProject` ADD CONSTRAINT `historyProject_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `projects`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

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

-- AddForeignKey
ALTER TABLE `configDocument` ADD CONSTRAINT `configDocument_createById_fkey` FOREIGN KEY (`createById`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `configCategory` ADD CONSTRAINT `configCategory_createById_fkey` FOREIGN KEY (`createById`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `configProgram` ADD CONSTRAINT `configProgram_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `configCategory`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `configProgram` ADD CONSTRAINT `configProgram_createById_fkey` FOREIGN KEY (`createById`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `configInvestigationLine` ADD CONSTRAINT `configInvestigationLine_createById_fkey` FOREIGN KEY (`createById`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
