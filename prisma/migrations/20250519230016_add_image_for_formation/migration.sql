/*
  Warnings:

  - A unique constraint covering the columns `[image_link]` on the table `Formacao` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Formacao" ADD COLUMN     "descricao" TEXT,
ADD COLUMN     "image_link" VARCHAR(255);

-- CreateIndex
CREATE UNIQUE INDEX "Formacao_image_link_key" ON "Formacao"("image_link");
