-- CreateTable
CREATE TABLE "agendas" (
    "agenda_id" TEXT NOT NULL,
    "psicologo_id" TEXT NOT NULL,
    "dataHora" TIMESTAMP(3) NOT NULL,
    "disponibilidade" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "agendas_pkey" PRIMARY KEY ("agenda_id")
);

-- CreateTable
CREATE TABLE "psicologos" (
    "user_id" TEXT NOT NULL,
    "bio" VARCHAR(500),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "numero_ordem" TEXT NOT NULL,
    "especialidade" VARCHAR(255),
    "sexo" INTEGER,
    "nacionalidade" TEXT,
    "universidade" TEXT,
    "ano_conclusao" INTEGER,
    "ano_experiencia" INTEGER,
    "modalidade" INTEGER DEFAULT 0,
    "is_logged" INTEGER DEFAULT 0,
    "nbi" TEXT,
    "grau_academico" TEXT,
    "idiomas" TEXT,
    "contacto" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" INTEGER NOT NULL DEFAULT 2,

    CONSTRAINT "psicologos_pkey" PRIMARY KEY ("user_id")
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
CREATE TABLE "avaliacoes" (
    "star_id" TEXT NOT NULL,
    "observacao" VARCHAR(255) NOT NULL,
    "psicologo_id" TEXT NOT NULL,
    "paciente_id" TEXT NOT NULL,

    CONSTRAINT "avaliacoes_pkey" PRIMARY KEY ("star_id")
);

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
    "inicio" TIMESTAMP(3),
    "referencia" TEXT,
    "plano_id" TEXT NOT NULL,
    "psicologo_id" TEXT NOT NULL,
    "status" INTEGER NOT NULL,

    CONSTRAINT "subscricoes_pkey" PRIMARY KEY ("subsc_id")
);

-- CreateTable
CREATE TABLE "sessoes" (
    "sessao_id" TEXT NOT NULL,
    "status" INTEGER NOT NULL DEFAULT 0,
    "inicio" TIMESTAMP(3),
    "fim" TIMESTAMP(3),
    "psicologo_id" TEXT NOT NULL,
    "paciente_id" TEXT NOT NULL,
    "modo_sessao" INTEGER NOT NULL DEFAULT 0,
    "extra_data" JSONB,
    "avaliacao" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sessoes_pkey" PRIMARY KEY ("sessao_id")
);

-- CreateTable
CREATE TABLE "pagamentos" (
    "pagamento_id" TEXT NOT NULL,
    "quantia" DECIMAL(65,30) NOT NULL,
    "metodo" TEXT NOT NULL DEFAULT 'EMIS',
    "status" INTEGER NOT NULL DEFAULT 2,
    "referencia" TEXT,
    "observacao" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sessaoId" TEXT NOT NULL,

    CONSTRAINT "pagamentos_pkey" PRIMARY KEY ("pagamento_id")
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
CREATE TABLE "triagens" (
    "id" TEXT NOT NULL,
    "respostas" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "paciente_id" TEXT NOT NULL,

    CONSTRAINT "triagens_pkey" PRIMARY KEY ("id")
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
CREATE TABLE "logs" (
    "log_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "tipo" INTEGER NOT NULL,
    "mensagem" TEXT NOT NULL,
    "data" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "logs_pkey" PRIMARY KEY ("log_id")
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

-- CreateTable
CREATE TABLE "notificacoes" (
    "not_id" TEXT NOT NULL,
    "mensagem" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notificacoes_pkey" PRIMARY KEY ("not_id")
);

-- CreateTable
CREATE TABLE "Usernotificacoes" (
    "notification_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "not_id" TEXT NOT NULL,

    CONSTRAINT "Usernotificacoes_pkey" PRIMARY KEY ("notification_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "psicologos_numero_ordem_key" ON "psicologos"("numero_ordem");

-- CreateIndex
CREATE UNIQUE INDEX "triagens_paciente_id_key" ON "triagens"("paciente_id");

-- CreateIndex
CREATE UNIQUE INDEX "email" ON "users"("email");

-- CreateIndex
CREATE INDEX "password_codes_code_idx" ON "password_codes"("code");

-- CreateIndex
CREATE UNIQUE INDEX "RefreshToken_refresh_key" ON "RefreshToken"("refresh");

-- AddForeignKey
ALTER TABLE "agendas" ADD CONSTRAINT "agendas_psicologo_id_fkey" FOREIGN KEY ("psicologo_id") REFERENCES "psicologos"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "psicologos" ADD CONSTRAINT "psicologos_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_psicologo_id_fkey" FOREIGN KEY ("psicologo_id") REFERENCES "psicologos"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "avaliacoes" ADD CONSTRAINT "avaliacoes_paciente_id_fkey" FOREIGN KEY ("paciente_id") REFERENCES "pacientes"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "avaliacoes" ADD CONSTRAINT "avaliacoes_psicologo_id_fkey" FOREIGN KEY ("psicologo_id") REFERENCES "psicologos"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "plano_privilegios" ADD CONSTRAINT "plano_privilegios_plano_id_fkey" FOREIGN KEY ("plano_id") REFERENCES "planos"("plano_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "plano_privilegios" ADD CONSTRAINT "plano_privilegios_privilegio_id_fkey" FOREIGN KEY ("privilegio_id") REFERENCES "privilegios"("privilegio_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscricoes" ADD CONSTRAINT "subscricoes_plano_id_fkey" FOREIGN KEY ("plano_id") REFERENCES "planos"("plano_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscricoes" ADD CONSTRAINT "subscricoes_psicologo_id_fkey" FOREIGN KEY ("psicologo_id") REFERENCES "psicologos"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessoes" ADD CONSTRAINT "sessoes_paciente_id_fkey" FOREIGN KEY ("paciente_id") REFERENCES "pacientes"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessoes" ADD CONSTRAINT "sessoes_psicologo_id_fkey" FOREIGN KEY ("psicologo_id") REFERENCES "psicologos"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pagamentos" ADD CONSTRAINT "pagamentos_sessaoId_fkey" FOREIGN KEY ("sessaoId") REFERENCES "sessoes"("sessao_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pacientes" ADD CONSTRAINT "pacientes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "triagens" ADD CONSTRAINT "triagens_paciente_id_fkey" FOREIGN KEY ("paciente_id") REFERENCES "pacientes"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

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
ALTER TABLE "password_codes" ADD CONSTRAINT "password_codes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PacientePsicologo" ADD CONSTRAINT "PacientePsicologo_paciente_id_fkey" FOREIGN KEY ("paciente_id") REFERENCES "pacientes"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PacientePsicologo" ADD CONSTRAINT "PacientePsicologo_psicologo_id_fkey" FOREIGN KEY ("psicologo_id") REFERENCES "psicologos"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RefreshToken" ADD CONSTRAINT "RefreshToken_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Usernotificacoes" ADD CONSTRAINT "Usernotificacoes_not_id_fkey" FOREIGN KEY ("not_id") REFERENCES "notificacoes"("not_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Usernotificacoes" ADD CONSTRAINT "Usernotificacoes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
