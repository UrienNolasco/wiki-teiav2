import Link from "next/link";
import { getServerSession } from "next-auth/next";
import { Clock, CheckCircle, PlayCircle } from "lucide-react"; // Ícones para progresso

import { getCapacitacaoById } from "@/app/actions/getCapacitacaoById"; // Action criada anteriormente
import { authOptions } from "@/lib/auth"; // Suas opções de autenticação
import { Badge } from "@/components/ui/badge"; // Se quiser usar badges para status
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"; // Para melhor layout
import { Button } from "@/components/ui/button"; // Para os links de workshop

export const revalidate = 0;

type CapacitacaoPageProps = {
  params: {
    formacaoSlug: string;
    capacitacaoId: string;
  };
};

// Componente interno para lidar com a lógica assíncrona e renderização
async function CapacitacaoDetails({ formacaoSlug, capacitacaoId }: { formacaoSlug: string, capacitacaoId: string }) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  if (!userId) {
    return <p className="text-red-500">Usuário não autenticado. Faça login para ver esta capacitação.</p>;
  }

  const capacitacao = await getCapacitacaoById(capacitacaoId, userId);

  if (!capacitacao) {
    return <p className="text-red-500">Capacitação não encontrada ou erro ao carregar dados.</p>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-3xl font-bold">{capacitacao.nome}</CardTitle>
        <CardDescription>
          Da formação: <Link href={`/formacao/${formacaoSlug}`} className="text-blue-500 hover:underline">{capacitacao.formacao.nome}</Link>
        </CardDescription>
        {/* Adicionar mais detalhes da capacitação se necessário, como descrição, vídeo principal, etc. */}
      </CardHeader>
      <CardContent>
        <h2 className="text-2xl font-semibold mb-4 mt-6">Workshops</h2>
        {capacitacao.workshops && capacitacao.workshops.length > 0 ? (
          <div className="space-y-4">
            {capacitacao.workshops.map((workshop) => (
              <Card key={workshop.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex-grow">
                    <h3 className="text-xl font-semibold mb-1">{workshop.nome}</h3>
                    {/* Adicionar descrição do workshop se disponível */}
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-2 sm:mb-0">
                    {workshop.progresso?.truedone ? (
                      <Badge variant="default" className="bg-green-500 text-white">
                        <CheckCircle className="mr-1 h-4 w-4" /> Concluído
                      </Badge>
                    ) : workshop.progresso?.startedAt ? (
                      <Badge variant="outline" className="border-yellow-500 text-yellow-600">
                        <PlayCircle className="mr-1 h-4 w-4" /> Em Andamento
                      </Badge>
                    ) : (
                      <Badge variant="outline">
                        <Clock className="mr-1 h-4 w-4" /> Pendente
                      </Badge>
                    )}
                  </div>
                  <Button asChild size="sm">
                    <Link href={`/formacao/${formacaoSlug}/capacitacao/${capacitacaoId}/workshop/${workshop.id}`}>
                      Acessar Workshop
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p>Nenhum workshop encontrado para esta capacitação.</p>
        )}
      </CardContent>
    </Card>
  );
}

export default function CapacitacaoPage({ params }: CapacitacaoPageProps) {
  const { formacaoSlug, capacitacaoId } = params;

  return (
    <div className="container mx-auto animate-fade-in py-8">
      {/* Suspense é ideal aqui se CapacitacaoDetails for um Server Component separado e mais pesado */}
      {/* Mas como está integrado, o await já cuida do carregamento no servidor */}
      <CapacitacaoDetails formacaoSlug={formacaoSlug} capacitacaoId={capacitacaoId} />
    </div>
  );
}
