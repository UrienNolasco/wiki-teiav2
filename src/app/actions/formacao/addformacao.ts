"use server";

import { db } from "@/lib/prisma";

export interface CreateFormacaoDTO {
    nome: string;
    descricao: string;
    image_link: string;
}

export async function addFormacao(data: CreateFormacaoDTO) {
  const formacao = await db.formacao.create({
    data: {
      nome: data.nome,
      descricao: data.descricao,
      image_link: data.image_link,
    },
  });
  return formacao;
}