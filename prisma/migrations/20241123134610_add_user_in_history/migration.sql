/*
  Warnings:

  - Added the required column `userId` to the `history` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `history` ADD COLUMN `userId` VARCHAR(191) NOT NULL;
