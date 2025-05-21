"use server";

import { db } from "@/lib/prisma";

export interface UpdateFormacaoDTO {
    id: string;
    nome: string;
    descricao: string;
    image_link: string;
  }

export async function updateFormacao(data: UpdateFormacaoDTO) {
  const formacao = await db.formacao.update({
    where: { id: data.id },
    data: {
      nome: data.nome,
      descricao: data.descricao,
      image_link: data.image_link,
    },
  });
  return formacao;
}