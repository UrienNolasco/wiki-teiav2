"use client";

import { Clock } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";

type FormacaoContentProps = {
  formacao?: {
    nome: string;
    capacitacoes: {
      id: string;
      nome: string;
      totalWorkshops: number;
      completedWorkshops: number;
    }[];
  };
};

export default function FormacaoContent({ formacao }: FormacaoContentProps) {
  if (!formacao) {
    return <p>Formação não encontrada.</p>;
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const router = useRouter();

  const handleClick = (capacitacao: {
    id: string;
    nome: string;
    totalWorkshops: number;
    completedWorkshops: number;
  }) => {
    // Gerar formacaoSlug a partir de formacao.nome
    const formacaoSlug = formacao.nome.toLowerCase().replace(/\s+/g, '-');
    const capacitacaoId = capacitacao.id;

    // Construir a nova URL e navegar
    router.push(`/formacao/${formacaoSlug}/capacitacao/${capacitacaoId}`);
  };

  return (
    <div className="container mx-auto animate-fade-in">
    <div className="text-center mb-12">
      <h1 className="text-4xl font-bold mb-2">{formacao.nome}</h1>
      <p className="text-xl text-muted-foreground mb-6">Progresso das Capacitações</p>
      <Button className="bg-purple-gradient shadow-lg hover:opacity-90 text-lg py-6 px-8">
        Iniciar Próximo Workshop
      </Button>
    </div>

    <div className="grid grid-cols-1 gap-6">
      {formacao.capacitacoes.map((capacitacao) => (
        <Card key={capacitacao.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <h3 className="text-xl font-semibold">{capacitacao.nome}</h3>
              <div className="flex items-center text-muted-foreground">
                <span>Progresso:</span>
                <Clock className="mx-2 h-4 w-4" />
                <span>{capacitacao.completedWorkshops} / {capacitacao.totalWorkshops}</span>
              </div>
              <Button className="bg-purple-600 hover:bg-purple-700" onClick={() => handleClick(capacitacao)}>
                Acessar Capacitação
              </Button>
            </div>
          </CardContent>
          <CardFooter className="bg-gray-50 dark:bg-gray-800 p-4 border-t">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
              <div 
                className="bg-purple-gradient h-2.5 rounded-full" 
                style={{ width: `${capacitacao.totalWorkshops === 0 ? 0 : (capacitacao.completedWorkshops / capacitacao.totalWorkshops)* 100}%` }}
              ></div>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  </div>
  );
}
