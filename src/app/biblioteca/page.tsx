import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import SearchBar from "@/components/searchbar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";

const formacoes = [
  {
    id: "abap",
    title: "Formação ABAP",
    description: "Aprenda a desenvolver em ABAP para SAP",
    image:
      "/abap.jpg",
    modules: 4,
    workshops: 18,
  },
  {
    id: "sd",
    title: "Formação SD",
    description: "Aprenda sobre o módulo Sales and Distribution do SAP",
    image:
      "/sd.jpg",
    modules: 3,
    workshops: 14,
  },
  {
    id: "mm",
    title: "Formação MM",
    description: "Aprenda sobre o módulo Materials Management do SAP",
    image:
      "/mm.jpg",
    modules: 5,
    workshops: 20,
  },
];

const Biblioteca = () => {
  return (
    <div className="container mx-auto animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Biblioteca de Conteúdos
          </h1>
          <p className="text-muted-foreground">
            Escolha uma formação para começar seu aprendizado
          </p>
        </div>
        <SearchBar />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {formacoes.map((formacao) => (
          <Card
            key={formacao.id}
            className="overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="relative h-48">
              <Image
                src={formacao.image}
                alt={formacao.title}
                className="w-full h-full object-fill"
                width={500}
                height={500}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                <h3 className="text-white text-xl font-bold">
                  {formacao.title}
                </h3>
              </div>
            </div>
            <CardContent className="pt-4">
              <CardDescription className="mb-2">
                {formacao.description}
              </CardDescription>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>{formacao.modules} capacitações</span>
                <span>{formacao.workshops} workshops</span>
              </div>
            </CardContent>
            <CardFooter className="pt-0">
              <Button
                asChild
                className="w-full bg-purple-gradient hover:opacity-90"
              >
                <Link href={`/formacao/${formacao.id}`}>
                  Acessar Formação <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Biblioteca;
