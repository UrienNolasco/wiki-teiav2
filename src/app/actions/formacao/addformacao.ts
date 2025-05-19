"use server";

import { db } from "@/lib/prisma";

export interface CreateFormacaoDTO {
    nome: string;
}

export async function addFormacao(data: CreateFormacaoDTO) {
  const formacao = await db.formacao.create({
    data: {
      nome: data.nome,
    },
  });
  return formacao;
}