// src/app/actions/getCapacitacaoById.ts
"use server";

import { db } from "@/lib/prisma";

export const getCapacitacaoById = async (capacitacaoId: string, userId: string) => {
  if (!userId) {
    // Ou lança um erro, ou retorna dados limitados se fizer sentido.
    // Por agora, vamos assumir que userId é sempre necessário.
    console.error("UserId não fornecido para getCapacitacaoById");
    return null;
  }

  try {
    const capacitacao = await db.capacitacao.findUnique({
      where: { id: capacitacaoId },
      include: {
        formacao: true, // Para ter informações da formação pai, como o nome/slug
        workshops: {
          orderBy: { nome: "asc" }, // Ou outra ordenação desejada
          include: {
            progressoWorkshop: {
              where: { usuarioId: userId },
              select: {
                done: true,
                startedAt: true,
                doneAt: true,
                truedone: true, // Incluindo todos os campos de progresso relevantes
                truedoneAt: true,
              },
            },
            // Não vamos incluir 'devolutivas' aqui para manter a query focada,
            // a menos que seja estritamente necessário para a página de capacitação.
          },
        },
      },
    });

    if (!capacitacao) {
      return null;
    }

    // Mapear os workshops para simplificar a estrutura do progresso
    const workshopsComProgresso = capacitacao.workshops.map(ws => {
      const progresso = ws.progressoWorkshop.length > 0 ? ws.progressoWorkshop[0] : null;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { progressoWorkshop, ...workshopData } = ws; // Remove o array progressoWorkshop
      return {
        ...workshopData,
        progresso, // Adiciona o objeto de progresso simplificado
      };
    });

    return {
      ...capacitacao,
      workshops: workshopsComProgresso,
    };

  } catch (error) {
    console.error(`Erro ao buscar capacitação (ID: ${capacitacaoId}):`, error);
    // Considere logar o erro em um sistema de monitoramento em produção
    return null; // Ou throw error dependendo da estratégia de tratamento de erro
  }
};
