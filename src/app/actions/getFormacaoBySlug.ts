// actions/get-formacoes.ts
"use server";
import { db } from "@/lib/prisma";

export const getFormacaoBySlug = async (slug: string, userId: string) => {
  try {
    return await db.formacao.findUnique({
      where: { nome: slug }, // Modificado aqui
      include: {
        capacitacoes: {
          include: {
            workshops: {
              include: {
                devolutivas: {
                  where: {
                    alunoId: userId,
                  },
                },
              },
            },
          },
        },
      },
    });
  } catch (error) {
    console.error("Erro ao buscar formação:", error);
    return null;
  }
};
