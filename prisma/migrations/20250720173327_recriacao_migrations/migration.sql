/*
  Warnings:

  - You are about to drop the column `userId` on the `fila` table. All the data in the column will be lost.
  - You are about to drop the `espera` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[triagem]` on the table `Fila` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `triagem` to the `Fila` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `fila` DROP FOREIGN KEY `fila_ibfk_1`;

-- DropIndex
DROP INDEX `userId` ON `fila`;

-- AlterTable
ALTER TABLE `fila` DROP COLUMN `userId`,
    ADD COLUMN `triagem` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `logatividade` MODIFY `tipo` ENUM('login', 'logout', 'inicio_triagem', 'conclusao_triagem', 'inicio_sessao', 'fim_sessao', 'create_account', 'mensagem', 'erro') NOT NULL;

-- DropTable
DROP TABLE `espera`;

-- CreateIndex
CREATE UNIQUE INDEX `triagem` ON `Fila`(`triagem`);

-- AddForeignKey
ALTER TABLE `Fila` ADD CONSTRAINT `fila_ibfk_1` FOREIGN KEY (`triagem`) REFERENCES `Triagem`(`id`) ON DELETE NO ACTION ON UPDATE CASCADE;
