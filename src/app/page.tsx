import { BarChart2, BookOpen,  FileText } from "lucide-react";

import { ContinueWatching } from "@/components/homepage/continuewatching";
import { QuickAcessCard } from "@/components/homepage/quickacesscard";
import SearchBar from "@/components/searchbar";


export default function Home() {
  return (
    <div className="container mx-auto animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Bem-vindo(a) de volta!
          </h1>
          <p className="text-muted-foreground">
            Continue de onde parou no seu aprendizado
          </p>
        </div>
        <SearchBar />
      </div>

      {/* Continue Watching Section */}
      <ContinueWatching />

      {/* Quick Access Cards */}
      <h2 className="text-2xl font-semibold mb-4">Acesso Rápido</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <QuickAcessCard
          icon={BookOpen}
          title="Biblioteca de Conteúdos"
          subtitle="Acesse todos os conteúdos disponíveis"
          content="Explore as formações ABAP, SD e MM com todos os workshops disponíveis."
          path="/biblioteca"
          buttonText="Acessar Biblioteca"
        />
        <QuickAcessCard
          icon={BarChart2}
          title="Progresso de Aprendizado"
          subtitle="Acompanhe sua evolução nos cursos"
          content="Visualize seu progresso em todas as formações e capacitações."
          path="/progresso"
          buttonText="Ver Progresso"
        />
        <QuickAcessCard
          icon={FileText}
          title="Devolutivas para Avaliações"
          subtitle="Verifique seus resultados"
          content="Acesse as devolutivas de suas avaliações realizadas."
          path="/devolutivas"
          buttonText="Ver Devolutivas"
        />
      </div>
    </div>
  );
}
