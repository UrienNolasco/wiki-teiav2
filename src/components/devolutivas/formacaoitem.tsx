import { ChevronRight,Folder, FolderOpen } from "lucide-react";
import React from "react";

import { cn } from "@/lib/utils";

import CapacitacaoItem from "./capacitacaoitem";
import { CapacitacaoFrontend, DevolutivaAgendamentoFrontend, FormacaoFrontend, WorkshopFrontend } from "./types";


interface FormacaoItemProps {
  formacao: FormacaoFrontend;
  expanded: boolean;
  expandedCapacitacoes: string[];
  toggleFormacao: (id: string) => void;
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

const FormacaoItem: React.FC<FormacaoItemProps> = ({
  formacao,
  expanded,
  expandedCapacitacoes,
  toggleFormacao,
  toggleCapacitacao,
  getAgendamentoInfo,
  onSchedule,
  onUpload,
}) => (
  <div className="border rounded-md">
    <div
      className="flex items-center gap-2 p-3 cursor-pointer hover:bg-slate-50"
      onClick={() => toggleFormacao(formacao.id)}
    >
      {expanded ? (
        <FolderOpen className="h-5 w-5 text-amber-500" />
      ) : (
        <Folder className="h-5 w-5 text-amber-500" />
      )}
      <span className="font-medium flex-1">{formacao.nome}</span>
      <ChevronRight
        className={cn(
          "h-5 w-5 transition-transform duration-200",
          expanded && "rotate-90"
        )}
      />
    </div>
    {expanded && (
      <div className="pl-6 pb-3">
        {formacao.capacitacoes.map((capacitacao: CapacitacaoFrontend) => (
          <CapacitacaoItem
            key={capacitacao.id}
            capacitacao={capacitacao}
            expanded={expandedCapacitacoes.includes(capacitacao.id)}
            toggleCapacitacao={toggleCapacitacao}
            getAgendamentoInfo={getAgendamentoInfo}
            onSchedule={onSchedule}
            onUpload={onUpload}
          />
        ))}
      </div>
    )}
  </div>
);

export default FormacaoItem;