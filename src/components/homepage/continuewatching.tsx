"use client";

import { BookOpen, ChevronRight, Clock, Play } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react"; // Importar useSession
import { useEffect, useState } from "react";

import { getWorkshopDetails } from "@/app/actions/getworkshop"; // Alterado para getWorkshopDetails
import { useLastWorkshopStore } from "@/stores/progressStore";

import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardTitle } from "../ui/card";

// A routeMap não será mais usada da mesma forma, mas podemos manter a lógica de fallback
// const routeMap: { [key: string]: string } = {
//   "Capacitação de Negócios": "/formacao/sd/workshops/negocios",
//   "Capacitação de Configurações": "/formacao/sd/workshops/config",
//   "Capacitação ABAP": "/formacao/abap/workshops",
// };

interface WorkshopData {
  nome: string | null;
  capacitacaoNome: string | null; // Nome da capacitação
  capacitacaoId: string | null;   // ID da capacitação
  formacaoNome: string | null;    // Nome da formação (para slug)
}

export function ContinueWatching() {
  const { lastWorkshopId, lastViewedAt } = useLastWorkshopStore();
  const router = useRouter();
  const { data: session } = useSession(); // Obter a sessão
  const [workshopData, setWorkshopData] = useState<WorkshopData>({
    nome: null,
    capacitacaoNome: null,
    capacitacaoId: null,
    formacaoNome: null,
  });

  useEffect(() => {
    if (lastWorkshopId && session?.user?.id) { // Verificar se userId está disponível
      getWorkshopDetails({ workshopId: lastWorkshopId, userId: session.user.id }).then(
        (data) => {
          if (data) {
            setWorkshopData({
              nome: data.nome,
              capacitacaoNome: data.nomeCapacitacao, // Usar nomeCapacitacao retornado pela action
              capacitacaoId: data.idCapacitacao,     // Usar idCapacitacao retornado pela action
              formacaoNome: data.nomeFormacao,       // Usar nomeFormacao retornado pela action
            });
          }
        }
      );
    }
  }, [lastWorkshopId, session]); // Adicionar session como dependência

  const handleAcessarConteudo = () => {
    if (workshopData.formacaoNome && workshopData.capacitacaoId && lastWorkshopId) {
      const formacaoSlug = workshopData.formacaoNome.toLowerCase().replace(/\s+/g, '-');
      router.push(`/formacao/${formacaoSlug}/capacitacao/${workshopData.capacitacaoId}/workshop/${lastWorkshopId}`);
    } else {
      // Fallback se os dados não estiverem completos
      router.push("/biblioteca");
    }
  };

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-semibold mb-4">
        {workshopData.nome ? "Continue Assistindo" : "Bem-vindo(a)!"}
      </h2>

      <Card className="overflow-hidden shadow-lg">
        <div className="relative aspect-video bg-gray-200 dark:bg-gray-800">
          {workshopData.nome ? (
            <>
              <div className="absolute inset-0 flex flex-col justify-center items-center">
                <div
                  onClick={handleAcessarConteudo}
                  className="w-16 h-16 rounded-full bg-purple-gradient flex items-center justify-center cursor-pointer hover:scale-105 transition-transform"
                >
                  <ChevronRight className="h-8 w-8 text-white ml-1" />
                </div>
              </div>
              <Image
                src="/abstratos-blur-hotel-interior.jpg" // Considerar usar uma imagem do workshop/formação se disponível
                alt="Thumbnail do último vídeo assistido"
                fill
                className="object-cover opacity-60"
              />
            </>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-gray-400 dark:text-gray-500 text-sm">
              Sua jornada de aprendizagem está apenas começando!
            </div>
          )}
        </div>

        <CardContent className="p-4">
          {workshopData.nome ? (
            <div className="flex justify-between items-center flex-wrap gap-4">
              <div>
                <CardTitle className="text-lg">{workshopData.nome}</CardTitle>
                <CardDescription className="flex items-center mt-1 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4 mr-1" />
                  Último acesso:{" "}
                  {lastViewedAt
                    ? new Date(lastViewedAt).toLocaleDateString("pt-BR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })
                    : "N/A"}
                </CardDescription>

                <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full bg-pink-100/50 dark:bg-pink-900/20 text-pink-600 dark:text-pink-300 text-sm">
                  <BookOpen className="h-4 w-4 mr-2" />
                  {workshopData.capacitacaoNome} {/* Exibir nome da capacitação */}
                </div>
              </div>

              <Button onClick={handleAcessarConteudo}>
                <Play className="h-4 w-4 mr-2" />
                Continuar
              </Button>
            </div>
          ) : (
            <div className="text-center text-sm text-muted-foreground py-6">
              Explore nossos conteúdos formativos para começar sua trilha!
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
