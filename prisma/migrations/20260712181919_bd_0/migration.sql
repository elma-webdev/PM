-- CreateTable
CREATE TABLE "agendas" (
    "agenda_id" TEXT NOT NULL,
    "status_disponibilidade" INTEGER,
    "is_logged" INTEGER,
    "limite_atendimento" INTEGER NOT NULL,
    "psicologo_id" TEXT NOT NULL,

    CONSTRAINT "agendas_pkey" PRIMARY KEY ("agenda_id")
);

-- CreateTable
CREATE TABLE "avaliacoes" (
    "star_id" TEXT NOT NULL,
    "observacao" VARCHAR(255) NOT NULL,
    "psicologo_id" TEXT NOT NULL,
    "paciente_id" TEXT NOT NULL,

    CONSTRAINT "avaliacoes_pkey" PRIMARY KEY ("star_id")
);

-- CreateTable
CREATE TABLE "notificacoes" (
    "not_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "mensagem" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notificacoes_pkey" PRIMARY KEY ("not_id")
);

-- CreateTable
CREATE TABLE "filas" (
    "fila_id" TEXT NOT NULL,
    "status_fila" INTEGER NOT NULL,
    "entrada" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "urgencia" INTEGER NOT NULL,
    "triagem_id" TEXT NOT NULL,
    "paciente_id" TEXT NOT NULL,

    CONSTRAINT "filas_pkey" PRIMARY KEY ("fila_id")
);

-- CreateTable
CREATE TABLE "logs" (
    "log_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "tipo" INTEGER NOT NULL,
    "mensagem" TEXT NOT NULL,
    "data" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "logs_pkey" PRIMARY KEY ("log_id")
);

-- CreateTable
CREATE TABLE "pacientes" (
    "user_id" TEXT NOT NULL,
    "idade" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "telefone" TEXT,

    CONSTRAINT "pacientes_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "psicologos" (
    "user_id" TEXT NOT NULL,
    "bio" VARCHAR(500),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "numero_ordem" TEXT NOT NULL,
    "especialidade" VARCHAR(255),
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" INTEGER NOT NULL DEFAULT 2,

    CONSTRAINT "psicologos_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "sessoes" (
    "sessao_id" TEXT NOT NULL,
    "status" INTEGER NOT NULL DEFAULT 0,
    "inicio" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fim" TIMESTAMP(3),
    "psicologo_id" TEXT NOT NULL,
    "paciente_id" TEXT NOT NULL,

    CONSTRAINT "sessoes_pkey" PRIMARY KEY ("sessao_id")
);

-- CreateTable
CREATE TABLE "triagens" (
    "id" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "urgencia" INTEGER NOT NULL DEFAULT 0,
    "respostas" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "paciente_id" TEXT NOT NULL,

    CONSTRAINT "triagens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "nome" VARCHAR(255) NOT NULL,
    "sobrenome" VARCHAR(255) NOT NULL,
    "password" TEXT NOT NULL,
    "photo" TEXT,
    "email" VARCHAR(255) NOT NULL,
    "role" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "password_codes" (
    "pass_id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "password_codes_pkey" PRIMARY KEY ("pass_id")
);

-- CreateTable
CREATE TABLE "posts" (
    "post_id" TEXT NOT NULL,
    "psicologo_id" TEXT,
    "content" TEXT NOT NULL,
    "photoUrl" TEXT,
    "likes" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "hastags" TEXT NOT NULL,

    CONSTRAINT "posts_pkey" PRIMARY KEY ("post_id")
);

-- CreateTable
CREATE TABLE "RefreshToken" (
    "token_id" TEXT NOT NULL,
    "expiresIn" INTEGER NOT NULL,
    "refresh" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "user_agent" TEXT NOT NULL,
    "ip" TEXT NOT NULL,

    CONSTRAINT "RefreshToken_pkey" PRIMARY KEY ("token_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "psicologo_agenda" ON "agendas"("psicologo_id");

-- CreateIndex
CREATE UNIQUE INDEX "triagem" ON "filas"("triagem_id");

-- CreateIndex
CREATE UNIQUE INDEX "paciente" ON "filas"("paciente_id");

-- CreateIndex
CREATE UNIQUE INDEX "psicologos_numero_ordem_key" ON "psicologos"("numero_ordem");

-- CreateIndex
CREATE UNIQUE INDEX "triagens_paciente_id_key" ON "triagens"("paciente_id");

-- CreateIndex
CREATE UNIQUE INDEX "email" ON "users"("email");

-- CreateIndex
CREATE INDEX "password_codes_code_idx" ON "password_codes"("code");

-- AddForeignKey
ALTER TABLE "agendas" ADD CONSTRAINT "agendas_psicologo_id_fkey" FOREIGN KEY ("psicologo_id") REFERENCES "psicologos"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "avaliacoes" ADD CONSTRAINT "avaliacoes_paciente_id_fkey" FOREIGN KEY ("paciente_id") REFERENCES "pacientes"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "avaliacoes" ADD CONSTRAINT "avaliacoes_psicologo_id_fkey" FOREIGN KEY ("psicologo_id") REFERENCES "psicologos"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notificacoes" ADD CONSTRAINT "notificacoes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "filas" ADD CONSTRAINT "filas_paciente_id_fkey" FOREIGN KEY ("paciente_id") REFERENCES "pacientes"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "filas" ADD CONSTRAINT "filas_triagem_id_fkey" FOREIGN KEY ("triagem_id") REFERENCES "triagens"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pacientes" ADD CONSTRAINT "pacientes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "psicologos" ADD CONSTRAINT "psicologos_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessoes" ADD CONSTRAINT "sessoes_paciente_id_fkey" FOREIGN KEY ("paciente_id") REFERENCES "pacientes"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessoes" ADD CONSTRAINT "sessoes_psicologo_id_fkey" FOREIGN KEY ("psicologo_id") REFERENCES "psicologos"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "triagens" ADD CONSTRAINT "triagens_paciente_id_fkey" FOREIGN KEY ("paciente_id") REFERENCES "pacientes"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "password_codes" ADD CONSTRAINT "password_codes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_psicologo_id_fkey" FOREIGN KEY ("psicologo_id") REFERENCES "psicologos"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RefreshToken" ADD CONSTRAINT "RefreshToken_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
