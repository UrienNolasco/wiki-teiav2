import { Suspense } from "react";

import FormacaoServer from "@/components/formacao/formacaoserver"; // Verifique se o caminho está correto após a refatoração do FormacaoServer

export const revalidate = 0; // Ou outra estratégia de revalidação se necessário

type FormacaoPageProps = {
  params: {
    formacaoSlug: string;
  };
};

// Esta função pode ser usada para gerar params estáticos em tempo de build se desejado, mas não é estritamente necessária para rotas dinâmicas.
// export async function generateStaticParams() {
//   // Aqui você poderia buscar todos os slugs de formação do seu DB
//   // Exemplo: const formacoes = await db.formacao.findMany({ select: { nome: true } });
//   // return formacoes.map((f) => ({ formacaoSlug: f.nome.toLowerCase().replace(/\s+/g, '-') }));
//   return []; // Retornando vazio por enquanto ou implemente a busca real
// }

export default function FormacaoPage({ params }: FormacaoPageProps) {
  const { formacaoSlug } = params;

  // O FormacaoServer agora espera formacaoSlug
  // O FormacaoServer é um Server Component, então ele pode buscar dados diretamente.
  return (
    <div className="container mx-auto animate-fade-in">
      <div className="p-8 space-y-8 ">
        <Suspense fallback={<div>Carregando formação...</div>}>
          <FormacaoServer formacaoSlug={formacaoSlug} />
        </Suspense>
      </div>
    </div>
  );
}
