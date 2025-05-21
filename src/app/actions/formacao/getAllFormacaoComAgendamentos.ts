"use server"

import { db } from "@/lib/prisma";

export async function getAllFormacaoComAgendamentos() { // Nomeado diferente para clareza
  return await db.formacao.findMany({
    include: {
      capacitacoes: {
        include: {
          workshops: {
            include: {
              DevolutivaAgendamento: { 
                orderBy: { criadoEm: 'desc' },
                include: {
                  avaliador: { 
                    select: { id: true, name: true }
                  },
                  agendador: { 
                    select: { id: true, name: true }
                  }
                }
              },
              progressoWorkshop: {
                include: {
                  usuario: { select: {id: true, name: true }}
                }
              },
              devolutivas: {
                include: {
                  aluno: { select: { id: true, name: true }}
                }
              }
            },
          },
        },
      },
    },
  });
}