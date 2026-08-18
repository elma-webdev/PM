/*
  Warnings:

  - You are about to drop the column `link_meet` on the `sessoes` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "sessoes" DROP COLUMN "link_meet",
ADD COLUMN     "extra_data" JSONB;
