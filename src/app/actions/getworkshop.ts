"use server";

import { db } from "@/lib/prisma";

interface GetWorkshopParams {
  workshopId: string;
}

export const getWorkshop = async ({ workshopId }: GetWorkshopParams) => {
  try {
    const workshop = await db.workshop.findUnique({
      where: { id: workshopId },
      include: {
        capacitacao: true,
      },
    });

    if (!workshop) return null;

    return {
      id: workshop.id,
      nome: workshop.nome,
      capacitacao: workshop.capacitacao?.nome || "Desconhecida",
    };
  } catch (error) {
    console.error("Error fetching workshop:", error);
    throw error;
  }
};
