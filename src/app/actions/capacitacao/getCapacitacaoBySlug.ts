// app/actions/getCapacitacaoBySlug.ts
"use server"

import { db } from "@/lib/prisma";
import { createSlug, getFormacaoNameFromSlug } from "@/lib/slug";

export async function getCapacitacaoBySlug(
  formacaoSlug: string,
  capacitacaoSlug: string,
  userId: string
) {
  const formacaoName = getFormacaoNameFromSlug(formacaoSlug);
  
  // Primeiro, encontrar a formação
  const formacao = await db.formacao.findUnique({
    where: { nome: formacaoName },
    include: {
      capacitacoes: {
        include: {
          workshops: {
            include: {
              progressoWorkshop: {
                where: { usuarioId: userId } // Corrigido: usuarioId ao invés de userId
              }
            }
          }
        }
      }
    }
  });

  if (!formacao) return null;

  // Encontrar a capacitação específica pelo nome (convertendo o slug)
  const capacitacao = formacao.capacitacoes.find(cap => {
    const capSlug = createSlug(cap.nome);
    return capSlug === capacitacaoSlug;
  });

  if (!capacitacao) return null;

  // Calcular progresso dos workshops
  const totalWorkshops = capacitacao.workshops.length;
  const completedWorkshops = capacitacao.workshops.filter(
    workshop => workshop.progressoWorkshop.some(p => p.done)
  ).length;

  return {
    ...capacitacao,
    totalWorkshops,
    completedWorkshops
  };
}