-- CreateTable
CREATE TABLE `Paciente` (
    `pacId` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(255) NOT NULL,
    `idade` DECIMAL(65, 30) NULL,
    `password` VARCHAR(191) NOT NULL,
    `photo` VARCHAR(191) NULL,
    `email` VARCHAR(255) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `telefone` INTEGER NULL,
    `userId` INTEGER NOT NULL,

    UNIQUE INDEX `email`(`email`),
    UNIQUE INDEX `userId`(`userId`),
    PRIMARY KEY (`pacId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Agenda_Psicologo` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `status_disponibilidade` BOOLEAN NULL,
    `isLogged` BOOLEAN NULL,
    `atendimento` ENUM('video', 'chat') NOT NULL DEFAULT 'video',
    `limiteAtendimento` INTEGER NOT NULL,
    `psicologoId` INTEGER NOT NULL,

    UNIQUE INDEX `psicologoId`(`psicologoId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Psicologo` (
    `psycId` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(255) NULL,
    `password` VARCHAR(191) NOT NULL,
    `photo` VARCHAR(191) NULL,
    `email` VARCHAR(255) NOT NULL,
    `bio` VARCHAR(500) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `role` ENUM('PACIENTE', 'PSICOLOGO') NOT NULL DEFAULT 'PSICOLOGO',

    UNIQUE INDEX `email`(`email`),
    PRIMARY KEY (`psycId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `isAnonimo` BOOLEAN NOT NULL DEFAULT false,
    `role` ENUM('PACIENTE', 'PSICOLOGO') NOT NULL DEFAULT 'PACIENTE',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Avaliacao` (
    `idStars` INTEGER NOT NULL AUTO_INCREMENT,
    `sms` VARCHAR(255) NOT NULL,
    `userId` INTEGER NOT NULL,
    `psicologoId` INTEGER NOT NULL,

    PRIMARY KEY (`idStars`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LogAtividade` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `usuarioId` INTEGER NOT NULL,
    `tipo` ENUM('login', 'logout', 'inicio_triagem', 'conclusao_triagem', 'inicio_sessao', 'fim_sessao', 'mensagem', 'erro') NOT NULL,
    `mensagem` VARCHAR(191) NOT NULL,
    `data` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Sessao` (
    `sessaoId` INTEGER NOT NULL AUTO_INCREMENT,
    `status` ENUM('ativa', 'finalizada') NULL,
    `inicio` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `fim` DATETIME(3) NULL,
    `userId` INTEGER NOT NULL,
    `psicologoId` INTEGER NOT NULL,

    PRIMARY KEY (`sessaoId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Triagem` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `score` INTEGER NOT NULL,
    `userId` INTEGER NOT NULL,
    `urgencia` VARCHAR(191) NOT NULL,
    `respostas` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `userId`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Paciente` ADD CONSTRAINT `Pacientes_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Agenda_Psicologo` ADD CONSTRAINT `atendimento_ibfk_1` FOREIGN KEY (`psicologoId`) REFERENCES `Psicologo`(`psycId`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Avaliacao` ADD CONSTRAINT `stars_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Avaliacao` ADD CONSTRAINT `Avaliacao_psicologoId_fkey` FOREIGN KEY (`psicologoId`) REFERENCES `Psicologo`(`psycId`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Sessao` ADD CONSTRAINT `sessao_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Sessao` ADD CONSTRAINT `Sessao_psicologoId_fkey` FOREIGN KEY (`psicologoId`) REFERENCES `Psicologo`(`psycId`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Triagem` ADD CONSTRAINT `userT_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE NO ACTION ON UPDATE CASCADE;
