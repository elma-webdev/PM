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

-- AddForeignKey
ALTER TABLE `Avaliacao` ADD CONSTRAINT `Stars_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Avaliacao` ADD CONSTRAINT `Avaliacao_psicologoId_fkey` FOREIGN KEY (`psicologoId`) REFERENCES `Psicologo`(`psycId`) ON DELETE NO ACTION ON UPDATE CASCADE;
