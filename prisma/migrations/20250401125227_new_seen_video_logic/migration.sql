/*
  Warnings:

  - You are about to drop the column `done` on the `Workshop` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Workshop" DROP COLUMN "done";

-- CreateTable
CREATE TABLE "ProgressoWorkshop" (
    "id" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "workshopId" TEXT NOT NULL,
    "done" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "ProgressoWorkshop_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProgressoWorkshop_usuarioId_workshopId_key" ON "ProgressoWorkshop"("usuarioId", "workshopId");

-- AddForeignKey
ALTER TABLE "ProgressoWorkshop" ADD CONSTRAINT "ProgressoWorkshop_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgressoWorkshop" ADD CONSTRAINT "ProgressoWorkshop_workshopId_fkey" FOREIGN KEY ("workshopId") REFERENCES "Workshop"("id") ON DELETE CASCADE ON UPDATE CASCADE;
