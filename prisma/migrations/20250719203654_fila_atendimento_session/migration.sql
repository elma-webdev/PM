-- CreateTable
CREATE TABLE `Fila` (
    `filaId` INTEGER NOT NULL AUTO_INCREMENT,
    `statusFila` ENUM('na_fila', 'em_atendimento', 'atendido', 'removido', 'classificacao') NOT NULL,
    `entrada` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `urgencia` VARCHAR(191) NOT NULL,
    `userId` INTEGER NOT NULL,

    UNIQUE INDEX `userId`(`userId`),
    PRIMARY KEY (`filaId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Espera` (
    `esperaId` INTEGER NOT NULL AUTO_INCREMENT,
    `triagemId` INTEGER NOT NULL,

    PRIMARY KEY (`esperaId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Fila` ADD CONSTRAINT `fila_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE NO ACTION ON UPDATE CASCADE;
