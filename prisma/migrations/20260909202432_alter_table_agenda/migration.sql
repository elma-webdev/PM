/*
  Warnings:

  - You are about to drop the column `is_logged` on the `agendas` table. All the data in the column will be lost.
  - You are about to drop the column `modalidade` on the `agendas` table. All the data in the column will be lost.
  - The `disponibilidade` column on the `agendas` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `dataHora` to the `agendas` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "psicologo_agenda";

-- AlterTable
ALTER TABLE "agendas" DROP COLUMN "is_logged",
DROP COLUMN "modalidade",
ADD COLUMN     "dataHora" TIMESTAMP(3) NOT NULL,
DROP COLUMN "disponibilidade",
ADD COLUMN     "disponibilidade" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "psicologos" ADD COLUMN     "is_logged" INTEGER DEFAULT 0,
ADD COLUMN     "modalidade" INTEGER DEFAULT 0;
