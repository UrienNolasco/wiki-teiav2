-- CreateTable
CREATE TABLE "DevolutivaAgendamento" (
    "id" TEXT NOT NULL,
    "workshopId" TEXT NOT NULL,
    "agendadorId" TEXT NOT NULL,
    "avaliadorId" TEXT NOT NULL,
    "dataAgendada" TIMESTAMP(3) NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DevolutivaAgendamento_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "DevolutivaAgendamento" ADD CONSTRAINT "DevolutivaAgendamento_workshopId_fkey" FOREIGN KEY ("workshopId") REFERENCES "Workshop"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DevolutivaAgendamento" ADD CONSTRAINT "DevolutivaAgendamento_agendadorId_fkey" FOREIGN KEY ("agendadorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DevolutivaAgendamento" ADD CONSTRAINT "DevolutivaAgendamento_avaliadorId_fkey" FOREIGN KEY ("avaliadorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
