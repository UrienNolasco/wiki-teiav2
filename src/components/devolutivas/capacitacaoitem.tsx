import { ChevronRight,Folder, FolderOpen } from "lucide-react";
import React from "react";

import { cn } from "@/lib/utils";

import { CapacitacaoFrontend, DevolutivaAgendamentoFrontend, WorkshopFrontend } from "./types";
import WorkshopItem from "./workshopitem";


interface CapacitacaoItemProps {
  capacitacao: CapacitacaoFrontend;
  expanded: boolean;
  toggleCapacitacao: (id: string) => void;
  getAgendamentoInfo: (workshop: WorkshopFrontend) => {
    temAgendamento: boolean;
    agendamento?: DevolutivaAgendamentoFrontend;
    podeAgendar: boolean;
    statusExibicao: 'agendada' | 'nenhum' | 'enviada';
    dataExibicao?: Date;
  };
  onSchedule: (workshop: WorkshopFrontend) => void;
  onUpload: (workshop: WorkshopFrontend) => void;
}

const CapacitacaoItem: React.FC<CapacitacaoItemProps> = ({
  capacitacao,
  expanded,
  toggleCapacitacao,
  getAgendamentoInfo,
  onSchedule,
  onUpload,
}) => (
  <div className="border-l border-dashed ml-2">
    <div
      className="flex items-center gap-2 p-2 cursor-pointer hover:bg-slate-50 pl-4"
      onClick={() => toggleCapacitacao(capacitacao.id)}
    >
      {expanded ? (
        <FolderOpen className="h-4 w-4 text-blue-500" />
      ) : (
        <Folder className="h-4 w-4 text-blue-500" />
      )}
      <span className="flex-1">{capacitacao.nome}</span>
      <ChevronRight
        className={cn(
          "h-4 w-4 transition-transform duration-200",
          expanded && "rotate-90"
        )}
      />
    </div>
    {expanded && (
      <div className="pl-8 py-2 space-y-2">
        {capacitacao.workshops.map((workshop) => (
          <WorkshopItem
            key={workshop.id}
            workshop={workshop}
            agendamentoInfo={getAgendamentoInfo(workshop)}
            onSchedule={onSchedule}
            onUpload={onUpload}
          />
        ))}
      </div>
    )}
  </div>
);

export default CapacitacaoItem;