// app/formacao/[formacaoSlug]/workshops/[capacitacaoSlug]/page.tsx
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";

import { VideoCard } from "@/components/videocard";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { createSlug, getFormacaoNameFromSlug } from "@/lib/slug";

export const revalidate = 0;

interface WorkshopsPageProps {
  params: {
    formacaoSlug: string;
    capacitacaoSlug: string;
  };
}

export default async function WorkshopsPage({ params }: WorkshopsPageProps) {
  const session = await getServerSession(authOptions);
  const userId = session?.user.id;

  if (!userId) {
    return <p>Usuário não autenticado.</p>;
  }

  // Buscar a formação pelo slug
  const formacaoName = getFormacaoNameFromSlug(params.formacaoSlug);
  
  // Primeiro, vamos buscar a capacitação diretamente
  const capacitacoes = await db.capacitacao.findMany({
    where: {
      formacao: {
        nome: {
          equals: formacaoName,
          mode: 'insensitive'
        }
      }
    }
  });
  
  // Encontrar a capacitação específica pelo slug
  const capacitacao = capacitacoes.find(cap => {
    const capSlug = createSlug(cap.nome);
    return capSlug === params.capacitacaoSlug;
  });

  if (!capacitacao) {
    notFound();
  }

  // Agora buscar os workshops da capacitação específica
  const workshops = await db.workshop.findMany({
    where: {
      capacitacaoId: capacitacao.id
    },
    include: {
      progressoWorkshop: {
        where: {
          usuarioId: userId,
        },
      },
    },
    orderBy: {
      nome: "asc",
    },
  });
  console.log("Workshops encontrados:", workshops.length);
  console.log("Workshops:", workshops.map(w => ({ 
    id: w.id, 
    nome: w.nome, 
    capacitacaoId: w.capacitacaoId,
    link_video: w.link_video 
  })));

  // Formatar workshops com progresso
  const workshopsComProgresso = workshops.map((workshop) => ({
    ...workshop,
    done: workshop.progressoWorkshop.some((pw) => pw.done),
    startedAt: workshop.progressoWorkshop[0]?.startedAt || null,
  }));
  console.log("Workshops com progresso:", workshopsComProgresso.length);

  // Buscar informações da formação para exibir
  const formacao = await db.formacao.findUnique({
    where: { nome: formacaoName }
  });
  console.log("Formação final:", formacao?.nome);
  console.log("=== FIM DEBUG ===");

  return (
    <div className="container mx-auto animate-fade-in">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {capacitacao.nome}
          </h1>
          <p className="text-muted-foreground mt-2">
            {formacao?.nome}
          </p>
          {/* Debug temporário na UI */}
          <p className="text-xs text-gray-500 mt-4">
            Debug: {workshops.length} workshops encontrados
          </p>
        </div>
        
        <div className="space-y-6">
          {workshopsComProgresso.length === 0 ? (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded">
              <p className="text-yellow-800">Nenhum workshop encontrado para esta capacitação.</p>
              <p className="text-xs text-yellow-600 mt-2">
                Capacitação ID: {capacitacao.id}
              </p>
            </div>
          ) : (
            workshopsComProgresso.map((workshop) => (
              <VideoCard
                key={workshop.id}
                workshop={{
                  ...workshop,
                  link_video: workshop.link_video ?? "",
                  done: workshop.done,
                }}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}