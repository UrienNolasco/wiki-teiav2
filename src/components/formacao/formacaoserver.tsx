import { getServerSession } from "next-auth/next";

import { getFormacaoBySlug } from "@/app/actions/getFormacao"; // Alterado para getFormacaoBySlug
import { authOptions } from "@/lib/auth";

import FormacaoContent from "./formacaocontent";

type FormacaoServerProps = {
  formacaoSlug: string; // Alterado de tipoFormacao para formacaoSlug
};

export default async function FormacaoServer({
  formacaoSlug, // Alterado de tipoFormacao para formacaoSlug
}: FormacaoServerProps) {
  // Obter a sessão do servidor
  const session = await getServerSession(authOptions); // Usando authOptions do NextAuth
  const userId = session?.user?.id;

  if (!userId) {
    return <p>Usuário não autenticado.</p>;
  }

  let formacao;
  try {
    // Chamando getFormacaoBySlug com formacaoSlug e userId
    formacao = await getFormacaoBySlug(formacaoSlug, userId);
  } catch (error) {
    console.error("Erro ao buscar formação:", error); // Mensagem de erro atualizada
    return <p>Erro ao carregar a formação.</p>; // Mensagem de erro atualizada
  }

  return <FormacaoContent formacao={formacao} />;
}
