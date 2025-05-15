"use server";
import { db } from "@/lib/prisma";

// Interface para os parâmetros de entrada
interface getProgressoCapacitacaoProps {
  userId: string;
  nomeCapacitacao: string;
}

interface WorkshopProgresso {
  id: string;
  nome: string;
  startedAt: Date | null;
  done: boolean;
  doneAt: Date | null;
  truedone: boolean;
  truedoneAt: Date | null;
}

interface ProgressoCapacitacao {
  totalWorkshops: number;
  concluidos: number;
  progresso: number;
  workshops: WorkshopProgresso[];
}

export const getProgressoCapacitacao = async ({
  userId,
  nomeCapacitacao,
}: getProgressoCapacitacaoProps): Promise<ProgressoCapacitacao> => {
  const capacitacao = await db.capacitacao.findFirst({
    where: { nome: nomeCapacitacao },
    include: {
      workshops: {
        include: {
          progressoWorkshop: {
            where: { usuarioId: userId },
          },
        },
        orderBy: {
          nome: "asc",
        },
      },
    },
  });

  if (!capacitacao) {
    return {
      totalWorkshops: 0,
      concluidos: 0,
      progresso: 0,
      workshops: [],
    };
  }

  const workshopsComProgresso = capacitacao.workshops.map((workshop) => ({
    id: workshop.id,
    nome: workshop.nome,
    startedAt: workshop.progressoWorkshop[0]?.startedAt || null,
    done: workshop.progressoWorkshop[0]?.done || false,
    doneAt: workshop.progressoWorkshop[0]?.doneAt || null,
    truedone: workshop.progressoWorkshop[0]?.truedone || false,
    truedoneAt: workshop.progressoWorkshop[0]?.truedoneAt || null,
  }));

  const totalWorkshops = workshopsComProgresso.length;
  const concluidos = workshopsComProgresso.filter((w) => w.done).length;

  const progresso =
    totalWorkshops > 0 ? Math.round((concluidos / totalWorkshops) * 100) : 0;

  return {
    totalWorkshops,
    concluidos,
    progresso,
    workshops: workshopsComProgresso,
  };
};
