/*
  Warnings:

  - You are about to drop the column `paciente_id` on the `mensagens` table. All the data in the column will be lost.
  - You are about to drop the column `psicologo_id` on the `mensagens` table. All the data in the column will be lost.
  - You are about to drop the column `metodo` on the `pagamentos` table. All the data in the column will be lost.
  - You are about to drop the column `observacao` on the `pagamentos` table. All the data in the column will be lost.
  - You are about to drop the column `quantia` on the `pagamentos` table. All the data in the column will be lost.
  - You are about to drop the column `sessaoId` on the `pagamentos` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `pagamentos` table. All the data in the column will be lost.
  - You are about to drop the column `ano_conclusao` on the `psicologos` table. All the data in the column will be lost.
  - You are about to drop the column `grau_academico` on the `psicologos` table. All the data in the column will be lost.
  - You are about to drop the column `modalidade` on the `psicologos` table. All the data in the column will be lost.
  - You are about to drop the column `universidade` on the `psicologos` table. All the data in the column will be lost.
  - You are about to drop the column `avaliacao` on the `sessoes` table. All the data in the column will be lost.
  - You are about to drop the column `modo_sessao` on the `sessoes` table. All the data in the column will be lost.
  - You are about to drop the column `paciente_id` on the `sessoes` table. All the data in the column will be lost.
  - You are about to drop the column `psicologo_id` on the `sessoes` table. All the data in the column will be lost.
  - The `status` column on the `sessoes` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `agendas` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `plano_privilegios` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `planos` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `privilegios` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `subscricoes` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[referencia]` on the table `pagamentos` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[agendamento_id]` on the table `sessoes` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `destinatario_id` to the `mensagens` table without a default value. This is not possible if the table is not empty.
  - Added the required column `remetente_id` to the `mensagens` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nbi` to the `pacientes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `agendamento_id` to the `pagamentos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `valor` to the `pagamentos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `agendamento_id` to the `sessoes` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "EstadoAgendamento" AS ENUM ('SOLICITADO', 'PENDENTE_PAGAMENTO', 'CONFIRMADO', 'RECUSADO', 'EXPIRADO', 'CANCELADO', 'REMARCADO');

-- CreateEnum
CREATE TYPE "EstadoPagamento" AS ENUM ('PENDENTE', 'CONFIRMADO', 'FALHOU', 'CANCELADO', 'REEMBOLSADO');

-- CreateEnum
CREATE TYPE "EstadoSessao" AS ENUM ('AGENDADA', 'EM_ANDAMENTO', 'CONCLUIDA', 'FALTOU', 'CANCELADA');

-- DropForeignKey
ALTER TABLE "agendas" DROP CONSTRAINT "agendas_psicologo_id_fkey";

-- DropForeignKey
ALTER TABLE "mensagens" DROP CONSTRAINT "mensagens_paciente_id_fkey";

-- DropForeignKey
ALTER TABLE "mensagens" DROP CONSTRAINT "mensagens_psicologo_id_fkey";

-- DropForeignKey
ALTER TABLE "pagamentos" DROP CONSTRAINT "pagamentos_sessaoId_fkey";

-- DropForeignKey
ALTER TABLE "plano_privilegios" DROP CONSTRAINT "plano_privilegios_plano_id_fkey";

-- DropForeignKey
ALTER TABLE "plano_privilegios" DROP CONSTRAINT "plano_privilegios_privilegio_id_fkey";

-- DropForeignKey
ALTER TABLE "sessoes" DROP CONSTRAINT "sessoes_paciente_id_fkey";

-- DropForeignKey
ALTER TABLE "sessoes" DROP CONSTRAINT "sessoes_psicologo_id_fkey";

-- DropForeignKey
ALTER TABLE "subscricoes" DROP CONSTRAINT "subscricoes_plano_id_fkey";

-- DropForeignKey
ALTER TABLE "subscricoes" DROP CONSTRAINT "subscricoes_psicologo_id_fkey";

-- AlterTable
ALTER TABLE "mensagens" DROP COLUMN "paciente_id",
DROP COLUMN "psicologo_id",
ADD COLUMN     "conteudo" TEXT,
ADD COLUMN     "dataLeitura" TIMESTAMP(3),
ADD COLUMN     "destinatario_id" TEXT NOT NULL,
ADD COLUMN     "lida" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "remetente_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "pacientes" ADD COLUMN     "nbi" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "pagamentos" DROP COLUMN "metodo",
DROP COLUMN "observacao",
DROP COLUMN "quantia",
DROP COLUMN "sessaoId",
DROP COLUMN "status",
ADD COLUMN     "agendamento_id" TEXT NOT NULL,
ADD COLUMN     "dataPagamento" TIMESTAMP(3),
ADD COLUMN     "estado" "EstadoPagamento" NOT NULL DEFAULT 'PENDENTE',
ADD COLUMN     "metodoPagamento" TEXT,
ADD COLUMN     "valor" DECIMAL(10,2) NOT NULL,
ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "psicologos" DROP COLUMN "ano_conclusao",
DROP COLUMN "grau_academico",
DROP COLUMN "modalidade",
DROP COLUMN "universidade";

-- AlterTable
ALTER TABLE "sessoes" DROP COLUMN "avaliacao",
DROP COLUMN "modo_sessao",
DROP COLUMN "paciente_id",
DROP COLUMN "psicologo_id",
ADD COLUMN     "agendamento_id" TEXT NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "EstadoSessao" NOT NULL DEFAULT 'AGENDADA',
ALTER COLUMN "updatedAt" DROP DEFAULT;

-- DropTable
DROP TABLE "agendas";

-- DropTable
DROP TABLE "plano_privilegios";

-- DropTable
DROP TABLE "planos";

-- DropTable
DROP TABLE "privilegios";

-- DropTable
DROP TABLE "subscricoes";

-- CreateTable
CREATE TABLE "agendamentos" (
    "agendamento_id" TEXT NOT NULL,
    "modo_sessao" INTEGER NOT NULL DEFAULT 0,
    "psicologo_id" TEXT,
    "paciente_id" TEXT NOT NULL,
    "data" DATE NOT NULL,
    "horaInicio" TIME(0) NOT NULL,
    "horaFim" TIME(0) NOT NULL,
    "duracaoMinutos" INTEGER NOT NULL DEFAULT 45,
    "observacao" VARCHAR(500),
    "estado" "EstadoAgendamento" NOT NULL DEFAULT 'SOLICITADO',
    "valor" TEXT,
    "expiracaoReserva" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "agendamentos_pkey" PRIMARY KEY ("agendamento_id")
);

-- CreateIndex
CREATE INDEX "agendamentos_psicologo_id_idx" ON "agendamentos"("psicologo_id");

-- CreateIndex
CREATE INDEX "agendamentos_estado_idx" ON "agendamentos"("estado");

-- CreateIndex
CREATE UNIQUE INDEX "pagamentos_referencia_key" ON "pagamentos"("referencia");

-- CreateIndex
CREATE INDEX "pagamentos_agendamento_id_idx" ON "pagamentos"("agendamento_id");

-- CreateIndex
CREATE UNIQUE INDEX "sessoes_agendamento_id_key" ON "sessoes"("agendamento_id");

-- AddForeignKey
ALTER TABLE "agendamentos" ADD CONSTRAINT "agendamentos_psicologo_id_fkey" FOREIGN KEY ("psicologo_id") REFERENCES "psicologos"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agendamentos" ADD CONSTRAINT "agendamentos_paciente_id_fkey" FOREIGN KEY ("paciente_id") REFERENCES "pacientes"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessoes" ADD CONSTRAINT "sessoes_agendamento_id_fkey" FOREIGN KEY ("agendamento_id") REFERENCES "agendamentos"("agendamento_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pagamentos" ADD CONSTRAINT "pagamentos_agendamento_id_fkey" FOREIGN KEY ("agendamento_id") REFERENCES "agendamentos"("agendamento_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mensagens" ADD CONSTRAINT "mensagens_remetente_id_fkey" FOREIGN KEY ("remetente_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mensagens" ADD CONSTRAINT "mensagens_destinatario_id_fkey" FOREIGN KEY ("destinatario_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
