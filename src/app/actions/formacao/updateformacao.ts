"use server";

import { db } from "@/lib/prisma";

export interface UpdateFormacaoDTO {
    id: string;
    nome: string;
  }

export async function updateFormacao(data: UpdateFormacaoDTO) {
  const formacao = await db.formacao.update({
    where: { id: data.id },
    data: {
      nome: data.nome,
    },
  });
  return formacao;
}