"use server";

import { StatusDevolutiva } from '@prisma/client';
import { getServerSession } from 'next-auth';

import { DevolutivaParaAvaliacao } from '@/components/devolutivas/types';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/prisma';



export async function getDevolutivasParaAvaliacaoAction(): Promise<{
  success: boolean;
  data?: DevolutivaParaAvaliacao[];
  error?: string;
}> {
  try {
    const session = await getServerSession(authOptions);
    const avaliadorId = session?.user?.id;

    if (!avaliadorId) {
      return { success: false, error: "Usuário não autenticado ou ID não encontrado." };
    }

    // Buscar agendamentos do avaliador que possuem devolutivas associadas
    // E essas devolutivas estão com status 'Aguardando' (ou outro status inicial relevante)
    const agendamentosComDevolutivas = await db.devolutivaAgendamento.findMany({
      where: {
        avaliadorId: avaliadorId,
        devolutivas: {
          some: {
            // Adicione outros status se necessário, ex: StatusDevolutiva.Revisao
            // Se 'Enviado' for um status no seu enum e for relevante:
            // status: { in: [StatusDevolutiva.Aguardando, StatusDevolutiva.Enviado] } 
            status: StatusDevolutiva.Aguardando, // Conforme schema atual.
          },
        },
      },
      include: {
        workshop: {
          select: {
            id: true,
            nome: true,
          },
        },
        devolutivas: {
          where: {
            // status: { in: [StatusDevolutiva.Aguardando, StatusDevolutiva.Enviado] }
            status: StatusDevolutiva.Aguardando,
          },
          include: {
            aluno: {
              select: {
                id: true,
                name: true,
              },
            },
          },
          orderBy: {
            // Você pode querer ordenar as devolutivas, ex: por data de envio se tiver
            // id: 'asc', // ou outro campo relevante
          }
        },
      },
      orderBy: {
        dataAgendada: 'asc',
      },
    });

    const devolutivasFormatadas: DevolutivaParaAvaliacao[] = [];

    agendamentosComDevolutivas.forEach(agendamento => {
      agendamento.devolutivas.forEach(devolutiva => {
        if (devolutiva.aluno && agendamento.workshop) { // Garante que dados essenciais existem
          devolutivasFormatadas.push({
            id: `${agendamento.id}-${devolutiva.id}`, // ID combinado para a chave da tabela no frontend
            devolutivaId: devolutiva.id,
            workshopId: agendamento.workshopId,
            alunoId: devolutiva.alunoId,
            alunoNome: devolutiva.aluno.name || 'Aluno Desconhecido',
            workshopNome: agendamento.workshop.nome,
            tipo: devolutiva.tipo,
            arquivo_url: devolutiva.arquivo_url,
            status: devolutiva.status as StatusDevolutiva, // Cast para o tipo do frontend
            dataAgendada: agendamento.dataAgendada,
          });
        }
      });
    });

    return { success: true, data: devolutivasFormatadas };

  } catch (error) {
    console.error("Erro ao buscar devolutivas para avaliação:", error);
    if (error instanceof Error) {
        return { success: false, error: error.message };
    }
    return { success: false, error: "Ocorreu um erro desconhecido." };
  }
}