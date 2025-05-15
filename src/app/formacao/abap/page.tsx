"use client";


import { Clock } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import React from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';

// Mock data para as diferentes formações
const formacoesData = {
  sd: {
    title: "Formação SD",
    capacitacoes: [
      { id: 1, title: "Capacitação de Negócios", progress: "1/14", total: 14 },
      { id: 2, title: "Capacitação Técnica", progress: "3/8", total: 8 },
      { id: 3, title: "Capacitação Avançada", progress: "0/10", total: 10 }
    ]
  },
  abap: {
    title: "Formação ABAP",
    capacitacoes: [
      { id: 1, title: "Fundamentos de ABAP", progress: "2/12", total: 12 },
      { id: 2, title: "ABAP OO", progress: "0/10", total: 10 },
      { id: 3, title: "ABAP para HANA", progress: "0/8", total: 8 },
      { id: 4, title: "ABAP Web", progress: "0/6", total: 6 }
    ]
  },
  mm: {
    title: "Formação MM",
    capacitacoes: [
      { id: 1, title: "Introdução ao MM", progress: "4/8", total: 8 },
      { id: 2, title: "Compras no SAP", progress: "1/10", total: 10 },
      { id: 3, title: "Gestão de Estoque", progress: "0/8", total: 8 },
      { id: 4, title: "Verificação de Faturas", progress: "0/6", total: 6 },
      { id: 5, title: "Avaliação de Fornecedores", progress: "0/8", total: 8 }
    ]
  }
};

const Formacao = () => {
  const { id } = useParams<{ id: string }>();
  const formacao = formacoesData[id as keyof typeof formacoesData];

  if (!formacao) {
    return (
        <div className="container mx-auto text-center py-12">
          <h1 className="text-3xl font-bold mb-4">Formação não encontrada</h1>
          <p className="mb-6">A formação que você está procurando não existe.</p>
          <Button asChild>
            <Link href="/biblioteca">Voltar para a Biblioteca</Link>
          </Button>
        </div>

    );
  }

  return (

      <div className="container mx-auto animate-fade-in">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-2">{formacao.title}</h1>
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
                  <h3 className="text-xl font-semibold">{capacitacao.title}</h3>
                  <div className="flex items-center text-muted-foreground">
                    <span>Progresso:</span>
                    <Clock className="mx-2 h-4 w-4" />
                    <span>{capacitacao.progress}</span>
                  </div>
                  <Button asChild className="bg-purple-600 hover:bg-purple-700">
                    <Link href={`/formacao/${id}/capacitacao/${capacitacao.id}`}>
                      Acessar Capacitação
                    </Link>
                  </Button>
                </div>
              </CardContent>
              <CardFooter className="bg-gray-50 dark:bg-gray-800 p-4 border-t">
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                  <div 
                    className="bg-purple-gradient h-2.5 rounded-full" 
                    style={{ width: `${parseInt(capacitacao.progress.split('/')[0]) / capacitacao.total * 100}%` }}
                  ></div>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

  );
};

export default Formacao;
