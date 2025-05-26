"use server";

import { StatusDevolutiva as PrismaStatusDevolutiva } from '@prisma/client'; // Importa o enum do Prisma
import { getServerSession } from 'next-auth';

import { authOptions } from '@/lib/auth';
import { db } from '@/lib/prisma';



interface AvaliarDevolutivaParams {
  devolutivaId: string;
  novoStatus: PrismaStatusDevolutiva; // Usar o enum do Prisma aqui
  nota: number;
  comentario?: string | null;
}

export async function avaliarDevolutivaAction(params: AvaliarDevolutivaParams): Promise<{
  success: boolean;
  data?: { devolutivaId: string; novoStatus: PrismaStatusDevolutiva };
  error?: string;
}> {
  try {
        const session = await getServerSession(authOptions);
        const avaliadorId = session?.user?.id;

    if (!avaliadorId) {
      return { success: false, error: "Usuário não autenticado ou ID não encontrado." };
    }

    const { devolutivaId, novoStatus, nota, comentario } = params;

    // Validação básica da nota (exemplo)
    if (nota < 0 || nota > 10) {
      return { success: false, error: "Nota inválida. Deve ser entre 0 e 10." };
    }

    // ATENÇÃO: Verifique se o 'novoStatus' é válido e existe no seu enum Prisma `StatusDevolutiva`
    // Ex: Se você está passando 'Reprovado' e ele não existe no enum, vai dar erro.
    // Garanta que seu enum Prisma StatusDevolutiva inclua todos os status necessários:
    // Enviado, Aguardando, Aprovado, Revisao, Reprovado

    const result = await db.$transaction(async (tx) => {
      const devolutivaAtualizada = await tx.devolutiva.update({
        where: { id: devolutivaId },
        data: { status: novoStatus },
      });

      if (!devolutivaAtualizada) {
        throw new Error("Devolutiva não encontrada ou não pôde ser atualizada.");
      }

      // 2. Cria o registro de avaliação
      await tx.avaliacao.create({
        data: {
          devolutivaId: devolutivaId,
          avaliadorId: avaliadorId,
          nota: nota, // Prisma espera Decimal, o JS number é compatível
          comentario: comentario,
        },
      });

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
    console.error("Erro ao avaliar devolutiva:", error);
    return { success: false, error: "Ocorreu um erro desconhecido ao processar a avaliação." };
  }
}