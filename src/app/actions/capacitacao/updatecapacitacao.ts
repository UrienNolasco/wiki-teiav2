"use server";
import { db } from "@/lib/prisma";

export interface UpdateCapacitacaoDTO {
  id: string;
  nome?: string;
  formacaoId?: string;
}

export async function updateCapacitacao(data: UpdateCapacitacaoDTO) {
  // monta dinamicamente só os campos que vierem
  const updateData: {
    nome?: string;
    formacaoId?: string;
  } = {};

  if (data.nome !== undefined) updateData.nome = data.nome;
  if (data.formacaoId !== undefined) updateData.formacaoId = data.formacaoId;

  const capacitacao = await db.capacitacao.update({
    where: { id: data.id },
    data: updateData,
  });
  return capacitacao;
}