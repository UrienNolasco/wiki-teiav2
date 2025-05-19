"use server"

import { db } from "@/lib/prisma";

export interface CreateCapacitacaoDTO {
  nome: string;
  formacaoId: string;
}


export async function addCapacitacao(data: CreateCapacitacaoDTO) {
  const capacitacao = await db.capacitacao.create({
    data: {
      nome: data.nome,
      formacaoId: data.formacaoId,
    },
  });
  return capacitacao;
}