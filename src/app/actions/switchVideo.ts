"use server";

import { db } from "@/lib/prisma";

interface SwitchVideoParams {
  usuarioId: string;
  workshopId: string;
  done: boolean;
}

export const switchVideo = async ({
  usuarioId,
  workshopId,
  done,
}: SwitchVideoParams) => {
  try {
    await db.progressoWorkshop.upsert({
      where: {
        usuarioId_workshopId: { usuarioId, workshopId },
      },
      update: { done, doneAt: done ? new Date() : null },
      create: {
        usuarioId,
        workshopId,
        done,
        doneAt: done ? new Date() : null,
      },
    });
  } catch (error) {
    console.error("Erro ao atualizar vídeo:", error);
  }
};
