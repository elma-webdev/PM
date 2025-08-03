-- AlterTable
ALTER TABLE `paciente` MODIFY `telefone` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `psicologo` MODIFY `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);
