"use server";

import { db } from "@/lib/prisma";

interface GetWorkshopParams {
  workshopId: string;
}

const generateSlug = (text: string) => {
  return text
    .toString()
    .normalize('NFD') 
    .replace(/[\u0300-\u036f]/g, '') 
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '') 
    .replace(/\-\-+/g, '-'); 
};

export const getWorkshopWithSlug = async ({ workshopId }: GetWorkshopParams) => {
  try {
    const workshop = await db.workshop.findUnique({
      where: { id: workshopId },
      include: {
        capacitacao: {
          include: {
            formacao: true,
          },
        },
      },
    });

    if (!workshop || !workshop.capacitacao || !workshop.capacitacao.formacao) {
      return null;
    }

    const formacaoSlug = generateSlug(workshop.capacitacao.formacao.nome);
    const capacitacaoSlug = generateSlug(workshop.capacitacao.nome);

    const navigationPath = `/formacao/${formacaoSlug}/workshops/${capacitacaoSlug}`;

    return {
      id: workshop.id,
      nome: workshop.nome,
      capacitacao: workshop.capacitacao.nome,
      navigationPath: navigationPath,
    };
  } catch (error) {
    console.error("Error fetching workshop:", error);
    throw new Error("Não foi possível buscar os dados do workshop.");
  }
};