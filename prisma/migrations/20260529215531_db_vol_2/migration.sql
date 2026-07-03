/*
  Warnings:

  - You are about to drop the column `triagem_feita` on the `pacientes` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[paciente_id]` on the table `filas` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `paciente_id` to the `filas` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "filas" ADD COLUMN     "paciente_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "pacientes" DROP COLUMN "triagem_feita";

-- CreateIndex
CREATE UNIQUE INDEX "paciente" ON "filas"("paciente_id");

-- AddForeignKey
ALTER TABLE "filas" ADD CONSTRAINT "filas_paciente_id_fkey" FOREIGN KEY ("paciente_id") REFERENCES "pacientes"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
