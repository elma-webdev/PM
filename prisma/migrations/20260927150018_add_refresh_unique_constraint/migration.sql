/*
  Warnings:

  - A unique constraint covering the columns `[refresh]` on the table `RefreshToken` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "RefreshToken_refresh_key" ON "RefreshToken"("refresh");
