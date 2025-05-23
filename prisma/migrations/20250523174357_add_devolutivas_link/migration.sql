/*
  Warnings:

  - The values [Enviado] on the enum `StatusDevolutiva` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `duracao_video` on the `Devolutiva` table. All the data in the column will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "StatusDevolutiva_new" AS ENUM ('Aguardando', 'Aprovado', 'Revisão');
ALTER TABLE "Devolutiva" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Devolutiva" ALTER COLUMN "status" TYPE "StatusDevolutiva_new" USING ("status"::text::"StatusDevolutiva_new");
ALTER TYPE "StatusDevolutiva" RENAME TO "StatusDevolutiva_old";
ALTER TYPE "StatusDevolutiva_new" RENAME TO "StatusDevolutiva";
DROP TYPE "StatusDevolutiva_old";
ALTER TABLE "Devolutiva" ALTER COLUMN "status" SET DEFAULT 'Aguardando';
COMMIT;

-- AlterTable
ALTER TABLE "Devolutiva" DROP COLUMN "duracao_video",
ADD COLUMN     "devolutivaAgendamentoId" TEXT,
ALTER COLUMN "status" SET DEFAULT 'Aguardando';

-- AddForeignKey
ALTER TABLE "Devolutiva" ADD CONSTRAINT "Devolutiva_devolutivaAgendamentoId_fkey" FOREIGN KEY ("devolutivaAgendamentoId") REFERENCES "DevolutivaAgendamento"("id") ON DELETE SET NULL ON UPDATE CASCADE;
