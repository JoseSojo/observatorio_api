/*
  Warnings:

  - You are about to drop the column `eventName` on the `StaticticsForMonth` table. All the data in the column will be lost.
  - You are about to drop the column `eventName` on the `StaticticsForYear` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `StaticticsForMonth` DROP COLUMN `eventName`;

-- AlterTable
ALTER TABLE `StaticticsForYear` DROP COLUMN `eventName`;
