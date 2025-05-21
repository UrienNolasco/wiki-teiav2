/*
  Warnings:

  - You are about to drop the `avaliacoes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `capacitacoes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `devolutivas` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `modulos` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `progresso_video` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `workshops` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "avaliacoes" DROP CONSTRAINT "avaliacoes_avaliadorId_fkey";

-- DropForeignKey
ALTER TABLE "avaliacoes" DROP CONSTRAINT "avaliacoes_devolutivaId_fkey";

-- DropForeignKey
ALTER TABLE "capacitacoes" DROP CONSTRAINT "capacitacoes_moduloId_fkey";

-- DropForeignKey
ALTER TABLE "devolutivas" DROP CONSTRAINT "devolutivas_alunoId_fkey";

-- DropForeignKey
ALTER TABLE "devolutivas" DROP CONSTRAINT "devolutivas_workshopId_fkey";

-- DropForeignKey
ALTER TABLE "progresso_video" DROP CONSTRAINT "progresso_video_devolutivaId_fkey";

-- DropForeignKey
ALTER TABLE "progresso_video" DROP CONSTRAINT "progresso_video_usuarioId_fkey";

-- DropForeignKey
ALTER TABLE "workshops" DROP CONSTRAINT "workshops_capacitacaoId_fkey";

-- DropForeignKey
ALTER TABLE "workshops" DROP CONSTRAINT "workshops_moduloId_fkey";

-- DropTable
DROP TABLE "avaliacoes";

-- DropTable
DROP TABLE "capacitacoes";

-- DropTable
DROP TABLE "devolutivas";

-- DropTable
DROP TABLE "modulos";

-- DropTable
DROP TABLE "progresso_video";

-- DropTable
DROP TABLE "workshops";

-- CreateTable
CREATE TABLE "Formacao" (
    "id" TEXT NOT NULL,
    "nome" VARCHAR(255) NOT NULL,

    CONSTRAINT "Formacao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Capacitacao" (
    "id" TEXT NOT NULL,
    "nome" VARCHAR(255) NOT NULL,
    "link_video" TEXT,
    "formacaoId" TEXT NOT NULL,

    CONSTRAINT "Capacitacao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Workshop" (
    "id" TEXT NOT NULL,
    "nome" VARCHAR(255) NOT NULL,
    "capacitacaoId" TEXT NOT NULL,
    "link_video" TEXT,

    CONSTRAINT "Workshop_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Devolutiva" (
    "id" TEXT NOT NULL,
    "workshopId" TEXT NOT NULL,
    "alunoId" TEXT NOT NULL,
    "tipo" "TipoDevolutiva" NOT NULL,
    "arquivo_url" TEXT NOT NULL,
    "status" "StatusDevolutiva" NOT NULL DEFAULT 'Enviado',
    "duracao_video" INTEGER,

    CONSTRAINT "Devolutiva_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProgressoVideo" (
    "id" TEXT NOT NULL,
    "devolutivaId" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "tempo_assistido" INTEGER NOT NULL,
    "ultima_atualizacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProgressoVideo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Avaliacao" (
    "id" TEXT NOT NULL,
    "devolutivaId" TEXT NOT NULL,
    "avaliadorId" TEXT NOT NULL,
    "nota" DECIMAL(3,1) NOT NULL,
    "comentario" TEXT,

    CONSTRAINT "Avaliacao_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Formacao_nome_key" ON "Formacao"("nome");

-- AddForeignKey
ALTER TABLE "Capacitacao" ADD CONSTRAINT "Capacitacao_formacaoId_fkey" FOREIGN KEY ("formacaoId") REFERENCES "Formacao"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Workshop" ADD CONSTRAINT "Workshop_capacitacaoId_fkey" FOREIGN KEY ("capacitacaoId") REFERENCES "Capacitacao"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Devolutiva" ADD CONSTRAINT "Devolutiva_workshopId_fkey" FOREIGN KEY ("workshopId") REFERENCES "Workshop"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Devolutiva" ADD CONSTRAINT "Devolutiva_alunoId_fkey" FOREIGN KEY ("alunoId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgressoVideo" ADD CONSTRAINT "ProgressoVideo_devolutivaId_fkey" FOREIGN KEY ("devolutivaId") REFERENCES "Devolutiva"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgressoVideo" ADD CONSTRAINT "ProgressoVideo_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Avaliacao" ADD CONSTRAINT "Avaliacao_devolutivaId_fkey" FOREIGN KEY ("devolutivaId") REFERENCES "Devolutiva"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Avaliacao" ADD CONSTRAINT "Avaliacao_avaliadorId_fkey" FOREIGN KEY ("avaliadorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
