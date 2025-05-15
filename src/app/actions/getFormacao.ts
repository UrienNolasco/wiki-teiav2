"use server";
import { db } from "@/lib/prisma";

export const getFormacoes = async (userId: string) => {
  try {
    const formacoes = await db.formacao.findMany({
      include: {
        capacitacoes: {
          include: {
            workshops: {
              include: {
                progressoWorkshop: {
                  where: {
                    usuarioId: userId,
                  },
                },
              },
            },
          },
        },
      },
    });

    return formacoes.map((formacao) => ({
      ...formacao,
      capacitacoes: formacao.capacitacoes.map((capacitacao) => {
        const totalWorkshops = capacitacao.workshops.length;
        const completedWorkshops = capacitacao.workshops.filter((workshop) =>
          workshop.progressoWorkshop.some((pw) => pw.done)
        ).length;

        return {
          ...capacitacao,
          totalWorkshops,
          completedWorkshops,
        };
      }),
    }));
  } catch (error) {
    console.error("Erro ao buscar formações:", error);
    return [];
  }
};
