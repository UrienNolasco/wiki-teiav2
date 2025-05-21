/*
  Warnings:

  - The values [Rejeitado] on the enum `StatusDevolutiva` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the `ProgressoVideo` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "StatusDevolutiva_new" AS ENUM ('Enviado', 'Aguardando', 'Aprovado', 'Revisão');
ALTER TABLE "Devolutiva" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Devolutiva" ALTER COLUMN "status" TYPE "StatusDevolutiva_new" USING ("status"::text::"StatusDevolutiva_new");
ALTER TYPE "StatusDevolutiva" RENAME TO "StatusDevolutiva_old";
ALTER TYPE "StatusDevolutiva_new" RENAME TO "StatusDevolutiva";
DROP TYPE "StatusDevolutiva_old";
ALTER TABLE "Devolutiva" ALTER COLUMN "status" SET DEFAULT 'Enviado';
COMMIT;

-- DropForeignKey
ALTER TABLE "ProgressoVideo" DROP CONSTRAINT "ProgressoVideo_devolutivaId_fkey";

-- DropForeignKey
ALTER TABLE "ProgressoVideo" DROP CONSTRAINT "ProgressoVideo_usuarioId_fkey";

-- AlterTable
ALTER TABLE "ProgressoWorkshop" ADD COLUMN     "doneAt" TIMESTAMP(3),
ADD COLUMN     "startedAt" TIMESTAMP(3),
ADD COLUMN     "truedone" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "truedoneAt" TIMESTAMP(3);

-- DropTable
DROP TABLE "ProgressoVideo";
