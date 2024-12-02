/*
  Warnings:

  - You are about to drop the column `objectReferenceId` on the `history` table. All the data in the column will be lost.
  - Added the required column `objectId` to the `history` table without a default value. This is not possible if the table is not empty.
  - Added the required column `objectReference` to the `history` table without a default value. This is not possible if the table is not empty.
  - Made the column `eventName` on table `history` required. This step will fail if there are existing NULL values in that column.
  - Made the column `objectName` on table `history` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `history` DROP COLUMN `objectReferenceId`,
    ADD COLUMN `objectId` VARCHAR(191) NOT NULL,
    ADD COLUMN `objectReference` VARCHAR(191) NOT NULL,
    MODIFY `eventName` VARCHAR(191) NOT NULL,
    MODIFY `objectName` VARCHAR(191) NOT NULL;
