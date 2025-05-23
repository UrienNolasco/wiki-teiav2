"use server";

import { StatusDevolutiva,TipoDevolutiva } from "@prisma/client"; // StatusDevolutiva não é usado ativamente aqui, mas pode ser útil
import { put } from "@vercel/blob";
import { revalidatePath } from "next/cache";

import { db } from "@/lib/prisma";

// Interface para a Devolutiva (mantida para tipagem de retorno)
export interface DevolutivaPrisma {
  id: string;
  workshopId: string;
  alunoId: string;
  tipo: TipoDevolutiva;
  arquivo_url: string;
  status: StatusDevolutiva;
  devolutivaAgendamentoId?: string | null;
}

// Resultado da submissão simplificado
export interface SubmeterDevolutivaResult {
  success: boolean;
  message: string;
  devolutiva?: DevolutivaPrisma;
  errorDetails?: string | { // Mensagem de erro geral ou erros de campo simples
    fieldErrors?: Record<string, string>;
    generalError?: string; // Adicionado para erros não específicos de campo
  };
}

export async function submeterNovaDevolutivaAction(
  prevState: SubmeterDevolutivaResult | null, // Estado anterior de useActionState
  formData: FormData
): Promise<SubmeterDevolutivaResult> {
  const workshopId = formData.get("workshopId") as string | null;
  const alunoId = formData.get("alunoId") as string | null;
  const arquivo = formData.get("arquivo") as File | null;
  const devolutivaAgendamentoId = formData.get("devolutivaAgendamentoId") as string | null;

  // Validações básicas
  if (!workshopId) {
    return { success: false, message: "ID do Workshop é obrigatório.", errorDetails: { fieldErrors: { workshopId: "Workshop é obrigatório." }}};
  }
  if (!alunoId) {
    return { success: false, message: "ID do Aluno é obrigatório.", errorDetails: { fieldErrors: { alunoId: "Aluno é obrigatório." }}};
  }
  if (!devolutivaAgendamentoId) {
    return { success: false, message: "Agendamento é obrigatório.", errorDetails: { fieldErrors: { devolutivaAgendamentoId: "Agendamento é obrigatório." }}};
  }
  if (!arquivo || arquivo.size === 0) {
    return { success: false, message: "Nenhum arquivo foi enviado ou o arquivo está vazio.", errorDetails: { fieldErrors: { arquivo: "Arquivo é obrigatório."}} };
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    console.error("ERRO FATAL: BLOB_READ_WRITE_TOKEN não está configurado.");
    return { success: false, message: "Erro de configuração do servidor.", errorDetails: { generalError: "Serviço de armazenamento indisponível."}};
  }

  const MAX_FILE_SIZE_MB = 200;
  if (arquivo.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
    return { success: false, message: `Arquivo muito grande. O limite é ${MAX_FILE_SIZE_MB}MB.`, errorDetails: { fieldErrors: { arquivo: `Tamanho máximo ${MAX_FILE_SIZE_MB}MB excedido.`}} };
  }

  const nomeArquivoOriginal = arquivo.name;
  const extensao = nomeArquivoOriginal.slice(nomeArquivoOriginal.lastIndexOf(".") + 1).toLowerCase(); // Convertido para minúsculas para consistência
  let tipoParaPrisma: TipoDevolutiva;

  switch (extensao) {
    case 'pdf': tipoParaPrisma = TipoDevolutiva.PDF; break;
    case 'pptx': tipoParaPrisma = TipoDevolutiva.PPTX; break;
    case 'mp4': case 'mov': case 'avi': case 'wmv': tipoParaPrisma = TipoDevolutiva.VIDEO; break;
    default:
      return {
        success: false,
        message: `Tipo de arquivo .${extensao} não é suportado. Permitidos: PDF, PPTX, formatos de vídeo.`,
        errorDetails: { fieldErrors: { arquivo: `Extensão .${extensao} não suportada.`}}
      };
  }

  try {
    // Opcional: Validação da existência do agendamento (se crítico)
    // const agendamentoExistente = await db.devolutivaAgendamento.findUnique({
    //   where: { id: devolutivaAgendamentoId },
    // });
    // if (!agendamentoExistente) {
    //   return { success: false, message: "O agendamento selecionado não foi encontrado.", errorDetails: { generalError: "Agendamento inválido." } };
    // }

    const pathname = `devolutivas/${workshopId}/${alunoId}/${Date.now()}-${nomeArquivoOriginal.replace(/\s+/g, '_')}`;
    const blob = await put(pathname, arquivo, {
      access: 'public',
      contentType: arquivo.type,
    });

    const novaDevolutivaData = {
      workshopId,
      alunoId,
      tipo: tipoParaPrisma,
      arquivo_url: blob.url,
      devolutivaAgendamentoId: devolutivaAgendamentoId,
      // status usará o default 'Aguardando' definido no schema do Prisma
    };

    const novaDevolutiva = await db.devolutiva.create({
      data: novaDevolutivaData,
    });

    // Revalidar paths para atualizar caches do Next.js
    // Se o toast persistente for causado por um refetch que mostra "nova devolutiva",
    // a lógica de exibição desse toast na página principal precisa ser ajustada.
    revalidatePath(`/workshops/${workshopId}`);
    revalidatePath("/devolutivas"); // Potencialmente relevante para o toast se a lista de devolutivas for atualizada

    return {
      success: true,
      message: "Devolutiva enviada com sucesso!",
      devolutiva: novaDevolutiva as DevolutivaPrisma, // Cast para garantir a tipagem correta
    };

  } catch (error: unknown) {
    console.error("Erro detalhado ao submeter devolutiva:", error);

    let userFriendlyMessage = "Não foi possível submeter a devolutiva devido a um erro no servidor. Tente novamente.";
    const fieldErrors: Record<string, string> | undefined = undefined;

    // Tratamento de erro simplificado
    // Pode-se adicionar verificações mais específicas se necessário, mas mantendo simples
    if (error instanceof Error) {
        // Exemplo: erro de constraint única (P2002 no Prisma)
        if (error.message.includes("Unique constraint failed")) {
            userFriendlyMessage = "Erro: Já existe uma devolutiva com algumas dessas informações ou para este agendamento.";
            // Poderia tentar identificar o campo, mas para simplificar:
            // fieldErrors = { form: "Dados duplicados." };
        } else if (error.message.length < 100) { // Evitar mensagens de erro muito longas/técnicas
            // userFriendlyMessage = error.message; // Cuidado ao expor mensagens de erro diretamente
        }
    }
    
    // Não há tentativa de rollback do blob aqui para simplificar.
    // Em caso de falha no DB após o upload do blob, o arquivo no blob pode ficar órfão.
    // console.warn(`Upload para o Blob pode ter ocorrido (${(error as any)?.blobUrlUploaded}), mas DB falhou. Considere limpeza manual.`);


    return {
      success: false,
      message: userFriendlyMessage,
      errorDetails: fieldErrors ? { fieldErrors } : { generalError: userFriendlyMessage },
    };
  }
}