-- CreateTable
CREATE TABLE `user` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NULL,
    `lastname` VARCHAR(191) NULL,
    `token` VARCHAR(191) NULL,
    `deleteAt` DATETIME(3) NULL,
    `createAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updateAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `parentId` VARCHAR(191) NULL,
    `rolId` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_group` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `group` JSON NOT NULL,
    `create_by_id` VARCHAR(191) NOT NULL,
    `delete_at` DATETIME(3) NULL,
    `create_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `update_at` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `author` (
    `id` VARCHAR(191) NOT NULL,
    `projects_id` VARCHAR(191) NOT NULL,
    `create_by_id` VARCHAR(191) NOT NULL,
    `delete_at` DATETIME(3) NULL,
    `create_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `update_at` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),

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
    `date` DATETIME(3) NOT NULL,
    `status` VARCHAR(191) NULL,
    `program_id` VARCHAR(191) NOT NULL,
    `line_id` VARCHAR(191) NOT NULL,
    `document_id` VARCHAR(191) NOT NULL,
    `delete_at` DATETIME(3) NULL,
    `create_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `update_at` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `history_project` (
    `id` VARCHAR(191) NOT NULL,
    `event_name` VARCHAR(191) NOT NULL,
    `user_auth` BOOLEAN NOT NULL DEFAULT false,
    `user_id` VARCHAR(191) NULL,
    `delete_at` DATETIME(3) NULL,
    `create_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `update_at` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `config_document` (
    `id` VARCHAR(191) NOT NULL,
    `size` DECIMAL(65, 30) NOT NULL,
    `original_name` VARCHAR(191) NOT NULL,
    `path` VARCHAR(191) NOT NULL,
    `mimy_type` VARCHAR(191) NOT NULL,
    `create_by_id` VARCHAR(191) NOT NULL,
    `delete_at` DATETIME(3) NULL,
    `update_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `create_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `config_category` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `create_by_id` VARCHAR(191) NOT NULL,
    `delete_at` DATETIME(3) NULL,
    `update_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `create_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `config_category_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `config_program` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `category_id` VARCHAR(191) NOT NULL,
    `create_by_id` VARCHAR(191) NOT NULL,
    `delete_at` DATETIME(3) NULL,
    `update_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `create_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `config_program_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `config_investigation_line` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `create_by_id` VARCHAR(191) NOT NULL,
    `delete_at` DATETIME(3) NULL,
    `update_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `create_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `history` (
    `id` VARCHAR(191) NOT NULL,
    `ip` VARCHAR(191) NOT NULL,
    `browser` VARCHAR(191) NOT NULL,
    `event_name` VARCHAR(191) NULL,
    `object_name` VARCHAR(191) NULL,
    `object_reference_id` VARCHAR(191) NULL,
    `create_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `statictics_for_month` (
    `id` VARCHAR(191) NOT NULL,
    `objectName` VARCHAR(191) NULL,
    `objectReferenceId` VARCHAR(191) NOT NULL DEFAULT 'biblioteca',
    `year` INTEGER NOT NULL,
    `month_name` VARCHAR(191) NOT NULL,
    `month_number` INTEGER NOT NULL,
    `total_month` INTEGER NOT NULL DEFAULT 0,
    `total_day1` INTEGER NOT NULL DEFAULT 0,
    `total_day2` INTEGER NOT NULL DEFAULT 0,
    `total_day3` INTEGER NOT NULL DEFAULT 0,
    `total_day4` INTEGER NOT NULL DEFAULT 0,
    `total_day5` INTEGER NOT NULL DEFAULT 0,
    `total_day6` INTEGER NOT NULL DEFAULT 0,
    `total_day7` INTEGER NOT NULL DEFAULT 0,
    `total_day8` INTEGER NOT NULL DEFAULT 0,
    `total_day9` INTEGER NOT NULL DEFAULT 0,
    `total_day10` INTEGER NOT NULL DEFAULT 0,
    `total_day11` INTEGER NOT NULL DEFAULT 0,
    `total_day12` INTEGER NOT NULL DEFAULT 0,
    `total_day13` INTEGER NOT NULL DEFAULT 0,
    `total_day14` INTEGER NOT NULL DEFAULT 0,
    `total_day15` INTEGER NOT NULL DEFAULT 0,
    `total_day16` INTEGER NOT NULL DEFAULT 0,
    `total_day17` INTEGER NOT NULL DEFAULT 0,
    `total_day18` INTEGER NOT NULL DEFAULT 0,
    `total_day19` INTEGER NOT NULL DEFAULT 0,
    `total_day20` INTEGER NOT NULL DEFAULT 0,
    `total_day21` INTEGER NOT NULL DEFAULT 0,
    `total_day22` INTEGER NOT NULL DEFAULT 0,
    `total_day23` INTEGER NOT NULL DEFAULT 0,
    `total_day24` INTEGER NOT NULL DEFAULT 0,
    `total_day25` INTEGER NOT NULL DEFAULT 0,
    `total_day26` INTEGER NOT NULL DEFAULT 0,
    `total_day27` INTEGER NOT NULL DEFAULT 0,
    `total_day28` INTEGER NOT NULL DEFAULT 0,
    `total_day29` INTEGER NOT NULL DEFAULT 0,
    `total_day30` INTEGER NOT NULL DEFAULT 0,
    `total_day31` INTEGER NOT NULL DEFAULT 0,
    `updateAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `statictics_for_year` (
    `id` VARCHAR(191) NOT NULL,
    `objectName` VARCHAR(191) NULL,
    `objectReferenceId` VARCHAR(191) NOT NULL DEFAULT 'biblioteca',
    `year` INTEGER NOT NULL,
    `totalYear` INTEGER NOT NULL DEFAULT 0,
    `total_month1` INTEGER NOT NULL DEFAULT 0,
    `total_month2` INTEGER NOT NULL DEFAULT 0,
    `total_month3` INTEGER NOT NULL DEFAULT 0,
    `total_month4` INTEGER NOT NULL DEFAULT 0,
    `total_month5` INTEGER NOT NULL DEFAULT 0,
    `total_month6` INTEGER NOT NULL DEFAULT 0,
    `total_month7` INTEGER NOT NULL DEFAULT 0,
    `total_month8` INTEGER NOT NULL DEFAULT 0,
    `total_month9` INTEGER NOT NULL DEFAULT 0,
    `total_month10` INTEGER NOT NULL DEFAULT 0,
    `total_month11` INTEGER NOT NULL DEFAULT 0,
    `total_month12` INTEGER NOT NULL DEFAULT 0,
    `updateAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `user` ADD CONSTRAINT `user_parentId_fkey` FOREIGN KEY (`parentId`) REFERENCES `user`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user` ADD CONSTRAINT `user_rolId_fkey` FOREIGN KEY (`rolId`) REFERENCES `user_group`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_group` ADD CONSTRAINT `user_group_create_by_id_fkey` FOREIGN KEY (`create_by_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `author` ADD CONSTRAINT `author_projects_id_fkey` FOREIGN KEY (`projects_id`) REFERENCES `projects`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `author` ADD CONSTRAINT `author_create_by_id_fkey` FOREIGN KEY (`create_by_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `projects` ADD CONSTRAINT `projects_program_id_fkey` FOREIGN KEY (`program_id`) REFERENCES `config_program`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `projects` ADD CONSTRAINT `projects_line_id_fkey` FOREIGN KEY (`line_id`) REFERENCES `config_investigation_line`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `projects` ADD CONSTRAINT `projects_document_id_fkey` FOREIGN KEY (`document_id`) REFERENCES `config_document`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `history_project` ADD CONSTRAINT `history_project_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `config_document` ADD CONSTRAINT `config_document_create_by_id_fkey` FOREIGN KEY (`create_by_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `config_category` ADD CONSTRAINT `config_category_create_by_id_fkey` FOREIGN KEY (`create_by_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `config_program` ADD CONSTRAINT `config_program_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `config_category`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `config_program` ADD CONSTRAINT `config_program_create_by_id_fkey` FOREIGN KEY (`create_by_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `config_investigation_line` ADD CONSTRAINT `config_investigation_line_create_by_id_fkey` FOREIGN KEY (`create_by_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
