// components/workshops/workshopscontent.tsx
"use client";

import { PlayCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

import { Button } from "./ui/button";
import { Progress } from "./ui/progress";


type WorkshopsContentProps = {
  capacitacao: {
    id: string;
    nome: string;
    link_video?: string | null;
    totalWorkshops: number;
    completedWorkshops: number;
    workshops: {
      id: string;
      nome: string;
      link_video?: string | null;
      progressoWorkshop: {
        done: boolean;
        truedone: boolean;
        startedAt?: Date | null;
        doneAt?: Date | null;
      }[];
    }[];
  };
  formacaoSlug: string;
  capacitacaoSlug: string;
};

export default function WorkshopsContent({ 
  capacitacao, 
  formacaoSlug, 
  capacitacaoSlug 
}: WorkshopsContentProps) {
  const router = useRouter();

  const progressPercentage = capacitacao.totalWorkshops === 0 
    ? 0 
    : (capacitacao.completedWorkshops / capacitacao.totalWorkshops) * 100;

  return (
    <div className="space-y-8">
      {/* Header da Capacitação */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">{capacitacao.nome}</h1>
        <p className="text-xl text-muted-foreground">
          {capacitacao.completedWorkshops} de {capacitacao.totalWorkshops} workshops concluídos
        </p>
        
        {/* Barra de Progresso */}
        <div className="max-w-2xl mx-auto">
          <Progress value={progressPercentage} className="h-3" />
        </div>

        {/* Vídeo da Capacitação (se houver) */}
        {capacitacao.link_video && (
          <div className="mt-6">
            <Button 
              size="lg" 
              className="bg-purple-gradient hover:opacity-90"
              onClick={() => window.open(capacitacao.link_video!, '_blank')}
            >
              <PlayCircle className="mr-2 h-5 w-5" />
              Assistir Vídeo de Introdução
            </Button>
          </div>
        )}
      </div>

      {/* Botão para acessar workshops */}
      <div className="flex justify-center">
        <Button
          size="lg"
          className="bg-purple-600 hover:bg-purple-700"
          onClick={() => router.push(`/formacao/${formacaoSlug}/workshops/${capacitacaoSlug}`)}
        >
          Acessar Workshops
        </Button>
      </div>

      {/* Botão de Voltar */}
      <div className="flex justify-center mt-8">
        <Button
          variant="outline"
          onClick={() => router.push(`/formacao/${formacaoSlug}`)}
        >
          Voltar para Formação
        </Button>
      </div>
    </div>
  );
}