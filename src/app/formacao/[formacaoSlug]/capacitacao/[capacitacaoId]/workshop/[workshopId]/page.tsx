import { Suspense } from "react";
// import { getworkshop } from "@/app/actions/getworkshop"; // Placeholder para a action

export const revalidate = 0;

type WorkshopPageProps = {
  params: {
    formacaoSlug: string;
    capacitacaoId: string;
    workshopId: string;
  };
};

// Placeholder para os dados do workshop
// interface WorkshopData {
//   id: string;
//   nome: string;
//   link_video: string | null;
//   // Outros campos relevantes do workshop
// }

// Componente que buscará e renderizará os dados do workshop
// async function WorkshopDetails({ workshopId }: { workshopId: string }) {
//   // const workshop: WorkshopData | null = await getworkshop(workshopId); // Chamar a action quando ela estiver pronta/adaptada

//   // if (!workshop) {
//   //   return <div>Workshop não encontrado.</div>;
//   // }

//   // return (
//   //   <div>
//   //     <h1>{workshop.nome}</h1>
//   //     {workshop.link_video && (
//   //       <video controls src={workshop.link_video}>
//   //         Seu navegador não suporta o elemento de vídeo.
//   //       </video>
//   //     )}
//   //     {/* Outros componentes e informações do workshop aqui */}
//   //   </div>
//   // );

//   // Conteúdo temporário:
//   return (
//     <div>
//       <h1>Detalhes do Workshop (ID: {workshopId})</h1>
//       <p>Renderização do vídeo e outros conteúdos do workshop virão aqui.</p>
//     </div>
//   );
// }

export default function WorkshopPage({ params }: WorkshopPageProps) {
  const { formacaoSlug, capacitacaoId, workshopId } = params;

  return (
    <div className="container mx-auto animate-fade-in">
      <div className="p-8 space-y-8">
        {/* <Suspense fallback={<div>Carregando workshop...</div>}>
          <WorkshopDetails workshopId={workshopId} />
        </Suspense> */}
        {/* Conteúdo temporário direto */}
        <h1>Workshop ID: {workshopId}</h1>
        <p>Capacitação ID: {capacitacaoId}</p>
        <p>Formação Slug: {formacaoSlug}</p>
        <p>O conteúdo específico deste workshop (vídeo, descrição, etc.) será carregado e exibido aqui assim que a busca de dados for implementada com a action `getworkshop`.</p>
      </div>
    </div>
  );
}
