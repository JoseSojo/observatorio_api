/*
  Warnings:

  - You are about to drop the column `description` on the `workProfile` table. All the data in the column will be lost.
  - You are about to drop the column `empresa` on the `workProfile` table. All the data in the column will be lost.
  - You are about to drop the column `industria` on the `workProfile` table. All the data in the column will be lost.
  - You are about to drop the column `motivoSalida` on the `workProfile` table. All the data in the column will be lost.
  - You are about to drop the column `puesto` on the `workProfile` table. All the data in the column will be lost.
  - You are about to drop the column `tipo` on the `workProfile` table. All the data in the column will be lost.
  - You are about to drop the column `ubication` on the `workProfile` table. All the data in the column will be lost.
  - Added the required column `actual` to the `workProfile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cargo` to the `workProfile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `institucion` to the `workProfile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ocupacion` to the `workProfile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tipoInstitucion` to the `workProfile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `workProfile` DROP COLUMN `description`,
    DROP COLUMN `empresa`,
    DROP COLUMN `industria`,
    DROP COLUMN `motivoSalida`,
    DROP COLUMN `puesto`,
    DROP COLUMN `tipo`,
    DROP COLUMN `ubication`,
    ADD COLUMN `actual` BOOLEAN NOT NULL,
    ADD COLUMN `cargo` VARCHAR(191) NOT NULL,
    ADD COLUMN `institucion` VARCHAR(191) NOT NULL,
    ADD COLUMN `ocupacion` VARCHAR(191) NOT NULL,
    ADD COLUMN `tipoInstitucion` VARCHAR(191) NOT NULL;
