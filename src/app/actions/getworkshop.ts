// src/app/actions/getworkshop.ts
"use server";

import { db } from "@/lib/prisma";

interface GetWorkshopDetailsParams {
  workshopId: string;
  userId: string; // Adicionado userId
}

export const getWorkshopDetails = async ({ workshopId, userId }: GetWorkshopDetailsParams) => {
  if (!userId) {
    console.error("UserId não fornecido para getWorkshopDetails");
    return null;
  }

  try {
    const workshop = await db.workshop.findUnique({
      where: { id: workshopId },
      include: {
        capacitacao: {
          select: {
            nome: true,
            id: true,
            formacao: { // Para obter o formacaoSlug
              select: {
                nome: true, // Usaremos o nome da formação para gerar o slug na página do workshop, se necessário
              }
            }
          }
        },
        progressoWorkshop: {
          where: { usuarioId: userId },
          select: {
            done: true,
            startedAt: true,
            doneAt: true,
            truedone: true,
            truedoneAt: true,
          },
        },
        // Não vamos incluir 'devolutivas' aqui por padrão,
        // a menos que seja necessário para a visualização principal do workshop.
      },
    });

    if (!workshop) {
      return null;
    }

    const progresso = workshop.progressoWorkshop.length > 0 ? workshop.progressoWorkshop[0] : null;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { progressoWorkshop, ...workshopData } = workshop;

    return {
      ...workshopData,
      link_video: workshop.link_video, // Garantir que link_video seja incluído
      progresso,
      // Simplificando o nome da capacitação e formação para fácil acesso no frontend
      nomeCapacitacao: workshop.capacitacao?.nome || "Desconhecida",
      idCapacitacao: workshop.capacitacao?.id,
      nomeFormacao: workshop.capacitacao?.formacao?.nome || "Desconhecida",
    };

  } catch (error) {
    console.error(`Erro ao buscar detalhes do workshop (ID: ${workshopId}):`, error);
    // Considere logar o erro em um sistema de monitoramento em produção
    return null; // Ou throw error
  }
};
