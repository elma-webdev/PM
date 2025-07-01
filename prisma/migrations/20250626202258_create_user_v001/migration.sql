/*
  Warnings:

  - You are about to drop the column `userId` on the `psicologo` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `userId` ON `psicologo`;

-- AlterTable
ALTER TABLE `psicologo` DROP COLUMN `userId`;
