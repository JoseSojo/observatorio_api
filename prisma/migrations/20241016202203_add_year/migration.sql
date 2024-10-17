/*
  Warnings:

  - Made the column `objectReferenceId` on table `StaticticsForMonth` required. This step will fail if there are existing NULL values in that column.
  - Made the column `objectReferenceId` on table `StaticticsForYear` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `StaticticsForMonth` MODIFY `objectReferenceId` VARCHAR(191) NOT NULL DEFAULT 'global.app';

-- AlterTable
ALTER TABLE `StaticticsForYear` MODIFY `objectReferenceId` VARCHAR(191) NOT NULL DEFAULT 'global.app';
