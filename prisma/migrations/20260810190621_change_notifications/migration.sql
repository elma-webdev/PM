/*
  Warnings:

  - You are about to drop the column `user_id` on the `notificacoes` table. All the data in the column will be lost.
  - You are about to drop the column `score` on the `triagens` table. All the data in the column will be lost.
  - You are about to drop the column `urgencia` on the `triagens` table. All the data in the column will be lost.
  - Changed the type of `status` on the `subscricoes` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "notificacoes" DROP CONSTRAINT "notificacoes_user_id_fkey";

-- AlterTable
ALTER TABLE "notificacoes" DROP COLUMN "user_id";

-- AlterTable
ALTER TABLE "sessoes" ADD COLUMN     "avaliacao" TEXT;

-- AlterTable
ALTER TABLE "subscricoes" DROP COLUMN "status",
ADD COLUMN     "status" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "triagens" DROP COLUMN "score",
DROP COLUMN "urgencia";

-- CreateTable
CREATE TABLE "Usernotificacoes" (
    "notification_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "not_id" TEXT NOT NULL,

    CONSTRAINT "Usernotificacoes_pkey" PRIMARY KEY ("notification_id")
);

-- AddForeignKey
ALTER TABLE "Usernotificacoes" ADD CONSTRAINT "Usernotificacoes_not_id_fkey" FOREIGN KEY ("not_id") REFERENCES "notificacoes"("not_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Usernotificacoes" ADD CONSTRAINT "Usernotificacoes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
