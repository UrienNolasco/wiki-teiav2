"use server";

import { revalidatePath } from "next/cache";

import { db } from "@/lib/prisma";

interface AgendarDevolutivaParams {
    workshopId: string;
    avaliadorId: string; // ID do professor selecionado
    dataAgendada: Date;
    agendadorId: string; // ID do usuário que está fazendo o agendamento (logado)
  }
  
  export async function agendarNovaDevolutiva({
    workshopId,
    avaliadorId,  
    dataAgendada,
    agendadorId, // Este ID virá da sua lógica de autenticação
  }: AgendarDevolutivaParams) {
    if (!agendadorId) {
      throw new Error("Usuário não autenticado para realizar o agendamento.");
    }
  
    try {
      const novaDevolutivaAgendada = await db.devolutivaAgendamento.create({
        data: {
          workshopId,
          avaliadorId,
          agendadorId,
          dataAgendada,
        },
      });
      revalidatePath("/devolutivas"); // Ajuste o caminho conforme necessário
      return novaDevolutivaAgendada;
    } catch (error) {
      console.error("Erro ao agendar devolutiva:", error);
      throw new Error("Não foi possível agendar a devolutiva.");
    }
  }