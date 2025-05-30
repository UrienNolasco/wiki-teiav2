import { CheckCircle, Clock,PlayCircle } from "lucide-react"; // Ícones
import Link from "next/link";
import { getServerSession } from "next-auth/next";

import { getWorkshopDetails } from "@/app/actions/getworkshop"; // Action ajustada anteriormente
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter,CardHeader, CardTitle } from "@/components/ui/card";
import { authOptions } from "@/lib/auth";

export const revalidate = 0;

type WorkshopPageProps = {
  params: {
    formacaoSlug: string;
    capacitacaoId: string;
    workshopId: string;
  };
};

// Componente interno para a lógica assíncrona e renderização
async function WorkshopDetailsComponent({ formacaoSlug, capacitacaoId, workshopId }: WorkshopPageProps['params']) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  if (!userId) {
    return <p className="text-red-500">Usuário não autenticado. Faça login para ver este workshop.</p>;
  }

  const workshop = await getWorkshopDetails({ workshopId, userId });

  if (!workshop) {
    return <p className="text-red-500">Workshop não encontrado ou erro ao carregar dados.</p>;
  }

  // workshop.nomeCapacitacao e workshop.nomeFormacao vêm da action getWorkshopDetails
  const nomeCapacitacao = workshop.nomeCapacitacao;
  const nomeFormacao = workshop.nomeFormacao;
  const idCapacitacao = workshop.idCapacitacao;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-3xl font-bold">{workshop.nome}</CardTitle>
        <CardDescription>
          Da capacitação: <Link href={`/formacao/${formacaoSlug}/capacitacao/${idCapacitacao}`} className="text-blue-500 hover:underline">{nomeCapacitacao}</Link>
          <br />
          Da formação: <Link href={`/formacao/${formacaoSlug}`} className="text-blue-500 hover:underline">{nomeFormacao}</Link>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {workshop.link_video ? (
          <div>
            <h2 className="text-2xl font-semibold mb-2">Vídeo do Workshop</h2>
            <div className="aspect-video rounded-lg overflow-hidden shadow-lg">
              {/* Idealmente, usar um componente de player de vídeo mais robusto se disponível */}
              {/* Mas um iframe ou tag video simples funciona para começar */}
              {workshop.link_video.includes("youtube.com") || workshop.link_video.includes("youtu.be") ? (
                <iframe
                  width="100%"
                  height="100%"
                  src={workshop.link_video.replace("watch?v=", "embed/")} // Exemplo de conversão para link de embed do YouTube
                  title={workshop.nome}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="border-0"
                ></iframe>
              ) : (
                <video controls src={workshop.link_video} className="w-full h-full bg-black">
                  Seu navegador não suporta o elemento de vídeo.
                  <a href={workshop.link_video} target="_blank" rel="noopener noreferrer">Assista o vídeo aqui</a>
                </video>
              )}
            </div>
          </div>
        ) : (
          <p className="text-muted-foreground">Nenhum vídeo disponível para este workshop.</p>
        )}

        <div>
          <h2 className="text-2xl font-semibold mb-2">Seu Progresso</h2>
          {workshop.progresso?.truedone ? (
            <Badge variant="default" className="bg-green-500 text-white text-lg p-2">
              <CheckCircle className="mr-2 h-5 w-5" /> Concluído
            </Badge>
          ) : workshop.progresso?.startedAt ? (
            <Badge variant="outline" className="border-yellow-500 text-yellow-600 text-lg p-2">
              <PlayCircle className="mr-2 h-5 w-5" /> Em Andamento
            </Badge>
          ) : (
            <Badge variant="outline" className="text-lg p-2">
              <Clock className="mr-2 h-5 w-5" /> Pendente
            </Badge>
          )}
          {/* Adicionar mais detalhes do progresso se necessário, como datas */}
        </div>

        {/* Adicionar aqui outros conteúdos do workshop: descrição detalhada, materiais, etc. */}
        {/* Exemplo:
        <div>
          <h2 className="text-2xl font-semibold mb-2">Descrição</h2>
          <p>{workshop.descricao || "Nenhuma descrição disponível."}</p>
        </div>
        */}

      </CardContent>
      <CardFooter>
        {/* Botões para marcar como concluído, ir para o próximo, etc., podem ser adicionados aqui */}
        <Button variant="outline" onClick={() => window.history.back()}>Voltar para Capacitação</Button>
      </CardFooter>
    </Card>
  );
}


export default function WorkshopPage({ params }: WorkshopPageProps) {
  // Os params já são do tipo correto devido à tipagem da função
  return (
    <div className="container mx-auto animate-fade-in py-8">
      <WorkshopDetailsComponent {...params} />
    </div>
  );
}
