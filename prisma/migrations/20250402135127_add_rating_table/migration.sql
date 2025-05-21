-- CreateTable
CREATE TABLE "AvaliacaoWorkshop" (
    "id" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "workshopId" TEXT NOT NULL,
    "rating" INTEGER NOT NULL DEFAULT 0,
    "feedback" TEXT,

    CONSTRAINT "AvaliacaoWorkshop_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AvaliacaoWorkshop_usuarioId_workshopId_key" ON "AvaliacaoWorkshop"("usuarioId", "workshopId");

-- AddForeignKey
ALTER TABLE "AvaliacaoWorkshop" ADD CONSTRAINT "AvaliacaoWorkshop_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AvaliacaoWorkshop" ADD CONSTRAINT "AvaliacaoWorkshop_workshopId_fkey" FOREIGN KEY ("workshopId") REFERENCES "Workshop"("id") ON DELETE CASCADE ON UPDATE CASCADE;
