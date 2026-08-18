/*
  Warnings:

  - You are about to drop the column `limite_atendimento` on the `agendas` table. All the data in the column will be lost.
  - You are about to drop the column `status_disponibilidade` on the `agendas` table. All the data in the column will be lost.
  - You are about to drop the `filas` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "filas" DROP CONSTRAINT "filas_paciente_id_fkey";

-- DropForeignKey
ALTER TABLE "filas" DROP CONSTRAINT "filas_triagem_id_fkey";

-- AlterTable
ALTER TABLE "agendas" DROP COLUMN "limite_atendimento",
DROP COLUMN "status_disponibilidade",
ADD COLUMN     "modalidade" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "psicologos" ADD COLUMN     "ano_conclusao" INTEGER,
ADD COLUMN     "ano_experiencia" INTEGER,
ADD COLUMN     "contacto" TEXT,
ADD COLUMN     "grau_academico" TEXT,
ADD COLUMN     "idiomas" TEXT,
ADD COLUMN     "nacionalidade" TEXT,
ADD COLUMN     "nbi" TEXT,
ADD COLUMN     "sexo" INTEGER,
ADD COLUMN     "universidade" TEXT;

-- AlterTable
ALTER TABLE "sessoes" ADD COLUMN     "link_meet" TEXT,
ADD COLUMN     "modo_sessao" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "triagens" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- DropTable
DROP TABLE "filas";

-- CreateTable
CREATE TABLE "privilegios" (
    "privilegio_id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "privilegios_pkey" PRIMARY KEY ("privilegio_id")
);

-- CreateTable
CREATE TABLE "plano_privilegios" (
    "id" TEXT NOT NULL,
    "plano_id" TEXT NOT NULL,
    "privilegio_id" TEXT NOT NULL,

    CONSTRAINT "plano_privilegios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "planos" (
    "plano_id" TEXT NOT NULL,
    "duracao" INTEGER NOT NULL,
    "valor" DECIMAL(65,30) NOT NULL,
    "nivel" INTEGER NOT NULL,

    CONSTRAINT "planos_pkey" PRIMARY KEY ("plano_id")
);

-- CreateTable
CREATE TABLE "subscricoes" (
    "subsc_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fim" TIMESTAMP(3),
    "referencia" TEXT,
    "plano_id" TEXT NOT NULL,
    "psicologo_id" TEXT NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "subscricoes_pkey" PRIMARY KEY ("subsc_id")
);

-- CreateTable
CREATE TABLE "pagamentos" (
    "pagamento_id" TEXT NOT NULL,
    "quantia" DECIMAL(65,30) NOT NULL,
    "metodo" TEXT NOT NULL DEFAULT 'EMIS',
    "status" TEXT NOT NULL,
    "referencia" TEXT,
    "observacao" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sessaoId" TEXT NOT NULL,

    CONSTRAINT "pagamentos_pkey" PRIMARY KEY ("pagamento_id")
);

-- CreateTable
CREATE TABLE "relatorios" (
    "relatorio_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "paciente_id" TEXT NOT NULL,
    "psicologo_id" TEXT NOT NULL,
    "demanda" TEXT NOT NULL,
    "procedimentos" TEXT NOT NULL,
    "analises" TEXT NOT NULL,
    "conclusao" TEXT NOT NULL,
    "assinatura" TEXT,
    "local_atendimento" TEXT,

    CONSTRAINT "relatorios_pkey" PRIMARY KEY ("relatorio_id")
);

-- CreateTable
CREATE TABLE "laudos" (
    "laudo_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "paciente_id" TEXT NOT NULL,
    "psicologo_id" TEXT NOT NULL,
    "objetivo" TEXT NOT NULL,
    "resultado" TEXT NOT NULL,
    "discussao" TEXT NOT NULL,
    "conclusao" TEXT NOT NULL,
    "assinatura" TEXT,
    "historico" TEXT NOT NULL,

    CONSTRAINT "laudos_pkey" PRIMARY KEY ("laudo_id")
);

-- CreateTable
CREATE TABLE "mensagens" (
    "mensagem_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "file" TEXT,
    "paciente_id" TEXT NOT NULL,
    "psicologo_id" TEXT NOT NULL,

    CONSTRAINT "mensagens_pkey" PRIMARY KEY ("mensagem_id")
);

-- CreateTable
CREATE TABLE "PacientePsicologo" (
    "id" TEXT NOT NULL,
    "paciente_id" TEXT NOT NULL,
    "psicologo_id" TEXT NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "encerradoEm" TIMESTAMP(3),

    CONSTRAINT "PacientePsicologo_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "plano_privilegios" ADD CONSTRAINT "plano_privilegios_plano_id_fkey" FOREIGN KEY ("plano_id") REFERENCES "planos"("plano_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "plano_privilegios" ADD CONSTRAINT "plano_privilegios_privilegio_id_fkey" FOREIGN KEY ("privilegio_id") REFERENCES "privilegios"("privilegio_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscricoes" ADD CONSTRAINT "subscricoes_plano_id_fkey" FOREIGN KEY ("plano_id") REFERENCES "planos"("plano_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscricoes" ADD CONSTRAINT "subscricoes_psicologo_id_fkey" FOREIGN KEY ("psicologo_id") REFERENCES "psicologos"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pagamentos" ADD CONSTRAINT "pagamentos_sessaoId_fkey" FOREIGN KEY ("sessaoId") REFERENCES "sessoes"("sessao_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "relatorios" ADD CONSTRAINT "relatorios_paciente_id_fkey" FOREIGN KEY ("paciente_id") REFERENCES "pacientes"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "relatorios" ADD CONSTRAINT "relatorios_psicologo_id_fkey" FOREIGN KEY ("psicologo_id") REFERENCES "psicologos"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "laudos" ADD CONSTRAINT "laudos_paciente_id_fkey" FOREIGN KEY ("paciente_id") REFERENCES "pacientes"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "laudos" ADD CONSTRAINT "laudos_psicologo_id_fkey" FOREIGN KEY ("psicologo_id") REFERENCES "psicologos"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mensagens" ADD CONSTRAINT "mensagens_paciente_id_fkey" FOREIGN KEY ("paciente_id") REFERENCES "pacientes"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mensagens" ADD CONSTRAINT "mensagens_psicologo_id_fkey" FOREIGN KEY ("psicologo_id") REFERENCES "psicologos"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PacientePsicologo" ADD CONSTRAINT "PacientePsicologo_paciente_id_fkey" FOREIGN KEY ("paciente_id") REFERENCES "pacientes"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PacientePsicologo" ADD CONSTRAINT "PacientePsicologo_psicologo_id_fkey" FOREIGN KEY ("psicologo_id") REFERENCES "psicologos"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
