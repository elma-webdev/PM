/*
  Warnings:

  - You are about to drop the column `data` on the `agendamentos` table. All the data in the column will be lost.
  - You are about to drop the column `horaFim` on the `agendamentos` table. All the data in the column will be lost.
  - You are about to drop the column `horaInicio` on the `agendamentos` table. All the data in the column will be lost.
  - Added the required column `dataInicio` to the `agendamentos` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "agendamentos" DROP COLUMN "data",
DROP COLUMN "horaFim",
DROP COLUMN "horaInicio",
ADD COLUMN     "dataFim" TIMESTAMP(3),
ADD COLUMN     "dataInicio" TIMESTAMP(3) NOT NULL;
