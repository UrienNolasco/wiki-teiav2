"use client";

import { BookOpen, ChevronRight, Clock, Play } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { getWorkshopWithSlug } from "@/app/actions/workshop/getworkshopwithslug";
import { useLastWorkshopStore } from "@/stores/progressStore";

import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardTitle } from "../ui/card";


export function ContinueWatching() {
  const { lastWorkshopId, lastViewedAt } = useLastWorkshopStore();
  const router = useRouter();
  const [workshopName, setWorkshopName] = useState<string | null>(null);
  const [capacitacao, setCapacitacao] = useState<string | null>(null);
  const [navigationPath, setNavigationPath] = useState<string | null>(null);


useEffect(() => {
    if (lastWorkshopId) {
      getWorkshopWithSlug({ workshopId: lastWorkshopId }).then((data) => {
        if (data) {
          setWorkshopName(data.nome);
          setCapacitacao(data.capacitacao);
          setNavigationPath(data.navigationPath); 
        }
      });
    }
  }, [lastWorkshopId]);

  const handleAcessarConteudo = () => {
    if (navigationPath) {
      router.push(navigationPath);
    } else {
      router.push("/biblioteca"); 
    }
  };

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-semibold mb-4">
        {workshopName ? "Continue Assistindo" : "Bem-vindo(a)!"}
      </h2>

      <Card className="overflow-hidden shadow-lg">
        <div className="relative aspect-video bg-gray-200 dark:bg-gray-800">
          {workshopName ? (
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
                src="/abstratos-blur-hotel-interior.jpg"
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
          {workshopName ? (
            <div className="flex justify-between items-center flex-wrap gap-4">
              <div>
                <CardTitle className="text-lg">{workshopName}</CardTitle>
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
                  {capacitacao}
                </div>
              </div>

              <Button onClick={handleAcessarConteudo}>
                <Play className="h-4 w-4 mr-2" />
                Acessar ultimo conteúdo
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
