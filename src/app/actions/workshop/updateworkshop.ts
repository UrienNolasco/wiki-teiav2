"use server"

import { db } from "@/lib/prisma";

export interface UpdateWorkshopDTO {
  id: string;
  nome?: string;
  capacitacaoId?: string;
  link_video?: string;
}

export async function updateWorkshop(data: UpdateWorkshopDTO) {
  // Monta dinamicamente só os campos que vierem
  const updateData: {
    nome?: string;
    capacitacaoId?: string;
    link_video?: string;
  } = {};

  if (data.nome !== undefined)          updateData.nome          = data.nome;
  if (data.capacitacaoId !== undefined) updateData.capacitacaoId = data.capacitacaoId;
  if (data.link_video !== undefined)    updateData.link_video    = data.link_video;

  const workshop = await db.workshop.update({
    where: { id: data.id },
    data: updateData,
  });
  return workshop;
}