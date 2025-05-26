"use server";

import { StatusDevolutiva as PrismaStatusDevolutiva } from '@prisma/client';
import { getServerSession } from 'next-auth';

// Assegure-se que estes caminhos estão corretos para seu projeto
import { authOptions } from '@/lib/auth'; 
import { db } from '@/lib/prisma'; 

interface AvaliarDevolutivaParams {
  devolutivaId: string;
  novoStatus: PrismaStatusDevolutiva;
  nota: number;
  comentario?: string | null;
}

export async function avaliarDevolutivaAction(params: AvaliarDevolutivaParams): Promise<{
  success: boolean;
  data?: { devolutivaId: string; novoStatus: PrismaStatusDevolutiva };
  error?: string; // Mensagem de erro para o frontend
}> {
  try {
    const session = await getServerSession(authOptions);
    const avaliadorId = session?.user?.id;

    if (!avaliadorId) {
      // Este erro será tratado pelo chamador da action
      return { success: false, error: "Usuário não autenticado ou ID não encontrado." };
    }

    const { devolutivaId, novoStatus, nota, comentario } = params;

    if (nota < 0 || nota > 10) {
      // Este erro será tratado pelo chamador da action
      return { success: false, error: "Nota inválida. Deve ser entre 0 e 10." };
    }

    const result = await db.$transaction(async (tx) => {
      // 1. Atualiza o status da devolutiva
      const devolutivaAtualizada = await tx.devolutiva.update({
        where: { id: devolutivaId },
        data: { status: novoStatus },
        select: { 
            id: true, 
            status: true, 
            alunoId: true,
            workshopId: true 
        }
      });

      if (!devolutivaAtualizada) {
        // Este erro será capturado pelo catch da transação e depois pelo catch externo
        throw new Error("Devolutiva não encontrada ou não pôde ser atualizada.");
      }

      // 2. Cria o registro de avaliação
      await tx.avaliacao.create({
        data: {
          devolutivaId: devolutivaId,
          avaliadorId: avaliadorId,
          nota: nota,
          comentario: comentario,
        },
      });

      // 3. Se a devolutiva foi aprovada, atualiza o ProgressoWorkshop
      if (novoStatus === PrismaStatusDevolutiva.Aprovado) {
        await tx.progressoWorkshop.updateMany({ // progressoAtualizado não é mais atribuído
          where: {
            usuarioId: devolutivaAtualizada.alunoId,
            workshopId: devolutivaAtualizada.workshopId,
          },
          data: {
            truedone: true,
            truedoneAt: new Date(),
          },
        });
      }

      return devolutivaAtualizada;
    });

    return { 
      success: true, 
      data: { 
        devolutivaId: result.id, 
        novoStatus: result.status
      } 
    };

  } catch (error) {
    console.error("Erro detalhado ao avaliar devolutiva (Action):", error); // Log detalhado no servidor
    return { success: false };
  }
}