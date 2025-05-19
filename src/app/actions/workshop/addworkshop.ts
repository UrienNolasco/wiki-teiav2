"use server";

import { db } from "@/lib/prisma";

export interface CreateWorkshopDTO {
    nome: string;
    capacitacaoId: string;
    link_video?: string;
  }

  export async function addWorkshop(data: CreateWorkshopDTO) {
    const workshop = await db.workshop.create({
      data: {
        nome: data.nome,
        capacitacaoId: data.capacitacaoId,
        link_video: data.link_video,
      },
    });
    return workshop;
  }