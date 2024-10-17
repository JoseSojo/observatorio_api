/*
  Warnings:

  - Added the required column `year` to the `StaticticsForMonth` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `StaticticsForMonth` ADD COLUMN `year` INTEGER NOT NULL;
