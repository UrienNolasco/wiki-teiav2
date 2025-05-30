import { Suspense } from "react";
// import Link from "next/link"; // Será usado quando listarmos os workshops
// import { getCapacitacaoById } from "@/app/actions/getCapacitacaoById"; // Placeholder para a futura action

export const revalidate = 0;

type CapacitacaoPageProps = {
  params: {
    formacaoSlug: string;
    capacitacaoId: string;
  };
};

// Placeholder para os dados da capacitação e seus workshops
// interface Workshop {
//   id: string;
//   nome: string;
//   // Outros campos relevantes do workshop
// }

// interface CapacitacaoData {
//   id: string;
//   nome: string;
//   // Outros campos relevantes da capacitação
//   workshops: Workshop[];
// }

// Componente que buscará e renderizará os dados da capacitação
// async function CapacitacaoDetails({ formacaoSlug, capacitacaoId }: { formacaoSlug: string, capacitacaoId: string }) {
//   // const capacitacao: CapacitacaoData | null = await getCapacitacaoById(capacitacaoId); // Chamar a action quando ela existir

//   // if (!capacitacao) {
//   //   return <div>Capacitação não encontrada.</div>;
//   // }

//   // return (
//   //   <div>
//   //     <h1>{capacitacao.nome}</h1>
//   //     <p>Formação: {formacaoSlug}</p>
//   //     <h2>Workshops:</h2>
//   //     <ul>
//   //       {capacitacao.workshops.map((workshop) => (
//   //         <li key={workshop.id}>
//   //           <Link href={`/formacao/${formacaoSlug}/capacitacao/${capacitacaoId}/workshop/${workshop.id}`}>
//   //             {workshop.nome}
//   //           </Link>
//   //         </li>
//   //       ))}
//   //     </ul>
//   //   </div>
//   // );

//   // Conteúdo temporário enquanto a action não é criada:
//   return (
//     <div>
//       <h1>Detalhes da Capacitação (ID: {capacitacaoId})</h1>
//       <p>Formação Slug: {formacaoSlug}</p>
//       <p>Lista de workshops aparecerá aqui.</p>
//       {/* Exemplo de link para um workshop (quando os dados estiverem disponíveis):
//       <Link href={`/formacao/${formacaoSlug}/capacitacao/${capacitacaoId}/workshop/WORKSHOP_ID_EXEMPLO`}>
//         Workshop Exemplo
//       </Link>
//       */}
//     </div>
//   );
// }

export default function CapacitacaoPage({ params }: CapacitacaoPageProps) {
  const { formacaoSlug, capacitacaoId } = params;

  return (
    <div className="container mx-auto animate-fade-in">
      <div className="p-8 space-y-8">
        {/* <Suspense fallback={<div>Carregando capacitação...</div>}>
          <CapacitacaoDetails formacaoSlug={formacaoSlug} capacitacaoId={capacitacaoId} />
        </Suspense> */}
        {/* Conteúdo temporário direto para evitar complexidade com Server Component e Suspense agora */}
        <h1>Detalhes da Capacitação (ID: {capacitacaoId})</h1>
        <p>Da Formação: {formacaoSlug}</p>
        <p>A lista de workshops e outros detalhes da capacitação aparecerão aqui assim que a busca de dados for implementada.</p>
        <p>Próximo passo será criar a action `getCapacitacaoById` e então atualizar esta página para usá-la.</p>
      </div>
    </div>
  );
}
