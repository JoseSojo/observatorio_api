/*
  Warnings:

  - Added the required column `updateAt` to the `ConfigCity` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updateAt` to the `ConfigCountry` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updateAt` to the `ConfigState` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updateAt` to the `Permits` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `ConfigCity` ADD COLUMN `createAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `isDelete` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `updateAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `ConfigCountry` ADD COLUMN `createAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `isDelete` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `updateAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `ConfigState` ADD COLUMN `createAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `isDelete` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `updateAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `Permits` ADD COLUMN `createAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `isDelete` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `updateAt` DATETIME(3) NOT NULL;
