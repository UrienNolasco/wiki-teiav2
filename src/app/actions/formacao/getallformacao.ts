"use server"

import { db } from "@/lib/prisma";

export async function getAllFormacao() {
  const formacoes = await db.formacao.findMany({
    include: {
      capacitacoes: {
        include: {
          workshops: true
        }
      }
    }
  });

  // Adicionar contagem de workshops total
  return formacoes.map(formacao => {
    const totalWorkshops = formacao.capacitacoes.reduce(
      (acc, cap) => acc + cap.workshops.length, 
      0
    );

    return {
      ...formacao,
      totalWorkshops,
      totalCapacitacoes: formacao.capacitacoes.length
    };
  });
}