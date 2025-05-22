"use server";

import { revalidatePath } from "next/cache";

import { db } from "@/lib/prisma";
interface UpdateDevolutivaParams {
  devolutivaAgendamentoId: string;
  dataAgendada: Date;
  avaliadorId: string;

}

export async function updateDevolutivaAgendada({
  devolutivaAgendamentoId,
  dataAgendada,
  avaliadorId,
}: UpdateDevolutivaParams) {
  if (!devolutivaAgendamentoId) {
    throw new Error("ID do agendamento da devolutiva é necessário para atualização.");
  }

  try {
    const devolutivaAtualizada = await db.devolutivaAgendamento.update({
      where: { id: devolutivaAgendamentoId },
      data: {
        dataAgendada,
        avaliadorId,
        
      },
    });
    revalidatePath("/devolutivas"); 
    return devolutivaAtualizada;
  } catch (error) {
    console.error("Erro ao atualizar agendamento da devolutiva:", error);
    throw new Error("Não foi possível atualizar o agendamento da devolutiva.");
  }
}