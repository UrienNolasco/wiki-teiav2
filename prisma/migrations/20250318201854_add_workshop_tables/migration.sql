/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "TipoUsuario" AS ENUM ('Aluno', 'Avaliador', 'Administrador');

-- CreateEnum
CREATE TYPE "TipoDevolutiva" AS ENUM ('PDF', 'PPTX', 'VIDEO');

-- CreateEnum
CREATE TYPE "StatusDevolutiva" AS ENUM ('Enviado', 'Aprovado', 'Rejeitado');

-- DropForeignKey
ALTER TABLE "Account" DROP CONSTRAINT "Account_userId_fkey";

-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_userId_fkey";

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "usuarios" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "tipo" "TipoUsuario" NOT NULL,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "modulos" (
    "id" TEXT NOT NULL,
    "nome" VARCHAR(255) NOT NULL,

    CONSTRAINT "modulos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "capacitacoes" (
    "id" TEXT NOT NULL,
    "nome" VARCHAR(255) NOT NULL,
    "link_video" TEXT,
    "moduloId" TEXT NOT NULL,

    CONSTRAINT "capacitacoes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workshops" (
    "id" TEXT NOT NULL,
    "nome" VARCHAR(255) NOT NULL,
    "moduloId" TEXT,
    "capacitacaoId" TEXT,

    CONSTRAINT "workshops_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "devolutivas" (
    "id" TEXT NOT NULL,
    "workshopId" TEXT NOT NULL,
    "alunoId" TEXT NOT NULL,
    "tipo" "TipoDevolutiva" NOT NULL,
    "arquivo_url" TEXT NOT NULL,
    "status" "StatusDevolutiva" NOT NULL DEFAULT 'Enviado',
    "duracao_video" INTEGER,

    CONSTRAINT "devolutivas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "progresso_video" (
    "id" TEXT NOT NULL,
    "devolutivaId" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "tempo_assistido" INTEGER NOT NULL,
    "ultima_atualizacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "progresso_video_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "avaliacoes" (
    "id" TEXT NOT NULL,
    "devolutivaId" TEXT NOT NULL,
    "avaliadorId" TEXT NOT NULL,
    "nota" DECIMAL(3,1) NOT NULL,
    "comentario" TEXT,

    CONSTRAINT "avaliacoes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- CreateIndex
CREATE UNIQUE INDEX "modulos_nome_key" ON "modulos"("nome");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "capacitacoes" ADD CONSTRAINT "capacitacoes_moduloId_fkey" FOREIGN KEY ("moduloId") REFERENCES "modulos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workshops" ADD CONSTRAINT "workshops_moduloId_fkey" FOREIGN KEY ("moduloId") REFERENCES "modulos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workshops" ADD CONSTRAINT "workshops_capacitacaoId_fkey" FOREIGN KEY ("capacitacaoId") REFERENCES "capacitacoes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "devolutivas" ADD CONSTRAINT "devolutivas_workshopId_fkey" FOREIGN KEY ("workshopId") REFERENCES "workshops"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "devolutivas" ADD CONSTRAINT "devolutivas_alunoId_fkey" FOREIGN KEY ("alunoId") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "progresso_video" ADD CONSTRAINT "progresso_video_devolutivaId_fkey" FOREIGN KEY ("devolutivaId") REFERENCES "devolutivas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "progresso_video" ADD CONSTRAINT "progresso_video_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "avaliacoes" ADD CONSTRAINT "avaliacoes_devolutivaId_fkey" FOREIGN KEY ("devolutivaId") REFERENCES "devolutivas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "avaliacoes" ADD CONSTRAINT "avaliacoes_avaliadorId_fkey" FOREIGN KEY ("avaliadorId") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;
