/*
  Warnings:

  - You are about to alter the column `actual` on the `workProfile` table. The data in that column could be lost. The data in that column will be cast from `TinyInt` to `VarChar(191)`.

*/
-- AlterTable
ALTER TABLE `workProfile` MODIFY `actual` VARCHAR(191) NOT NULL DEFAULT 'SI';
