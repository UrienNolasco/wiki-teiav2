"use server";

import { db } from "@/lib/prisma";

interface AddRatingParams {
  usuarioId: string;
  workshopId: string;
  rating: number;
  feedback?: string;
}

export const addRating = async ({
  usuarioId,
  workshopId,
  rating,
  feedback,
}: AddRatingParams) => {
  try {
    // Validar rating
    if (rating < 0 || rating > 5) {
      throw new Error("Rating inválido");
    }

    return await db.avaliacaoWorkshop.upsert({
      where: {
        usuarioId_workshopId: {
          usuarioId,
          workshopId,
        },
      },
      create: {
        usuarioId,
        workshopId,
        rating,
        feedback,
      },
      update: {
        rating,
        feedback,
      },
    });
  } catch (error) {
    console.error("Error adding rating:", error);
    throw error; // Importante relançar o erro para capturar no componente
  }
};
