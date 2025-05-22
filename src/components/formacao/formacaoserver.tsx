import { getServerSession } from "next-auth/next";

import { getFormacoes } from "@/app/actions/getFormacao";
import { authOptions } from "@/lib/auth";

import FormacaoContent from "./formacaocontent";



type FormacaoServerProps = {
  tipoFormacao: "Formação ABAP" | "Formação SD" | "Formação MM";
};

export default async function FormacaoServer({
  tipoFormacao,
}: FormacaoServerProps) {
  // Obter a sessão do servidor
  const session = await getServerSession(authOptions); // Usando authOptions do NextAuth
  const userId = session?.user?.id;

  if (!userId) {
    return <p>Usuário não autenticado.</p>;
  }

  let formacoes;
  try {
    formacoes = await getFormacoes(userId); // Passando o userId como argumento
  } catch (error) {
    console.error("Erro ao buscar formações:", error);
    return <p>Erro ao carregar as formações.</p>;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const formacao = formacoes?.find((f: any) => f.nome === tipoFormacao);

  return <FormacaoContent formacao={formacao} />;
}
