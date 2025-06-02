// app/actions/getFormacaoBySlug.ts
"use server"

import { FormacaoWithProgresso } from "@/components/devolutivas/types";
import { db } from "@/lib/prisma";
import { getFormacaoNameFromSlug } from "@/lib/slug";

export async function getFormacaoBySlug(slug: string, userId: string): Promise<FormacaoWithProgresso | null> {
  const formacaoName = getFormacaoNameFromSlug(slug);
  
  const formacao = await db.formacao.findFirst({
    where: {
      nome: {
        equals: formacaoName,
        mode: 'insensitive'
      }
    },
    include: {
      capacitacoes: {
        include: {
          workshops: {
            include: {
              progressoWorkshop: {
                where: {
                  usuarioId: userId
                }
              }
            }
          }
        }
      }
    }
  });

  if (!formacao) {
    return null;
  }

  // Calcular progresso das capacitações
  const capacitacoesComProgresso = formacao.capacitacoes.map(capacitacao => {
    const totalWorkshops = capacitacao.workshops.length;
    const completedWorkshops = capacitacao.workshops.filter(
      workshop => workshop.progressoWorkshop.some(p => p.done)
    ).length;

    return {
      ...capacitacao,
      totalWorkshops,
      completedWorkshops
    };
  });

  return {
    ...formacao,
    capacitacoes: capacitacoesComProgresso
  };
}