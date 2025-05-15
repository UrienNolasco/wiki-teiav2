// app/actions/startWorkshop.ts
"use server";

import { db } from "@/lib/prisma";

interface StartWorkshopParams {
  usuarioId: string;
  workshopId: string;
}

export const startWorkshop = async ({
  usuarioId,
  workshopId,
}: StartWorkshopParams) => {
  try {
    await db.progressoWorkshop.upsert({
      where: {
        usuarioId_workshopId: { usuarioId, workshopId },
      },
      update: { 
        startedAt: new Date() 
      },
      create: { 
        usuarioId,
        workshopId,
        startedAt: new Date()
      },
    });
  } catch (error) {
    console.error("Erro ao iniciar workshop:", error);
    throw new Error("Erro ao iniciar workshop");
  }
};