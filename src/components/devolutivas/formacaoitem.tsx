import { ChevronRight,Folder, FolderOpen } from "lucide-react";
import React from "react";

import { cn } from "@/lib/utils";

import CapacitacaoItem from "./capacitacaoitem";
import { Formacao, Workshop } from "./types";

interface FormacaoItemProps {
  formacao: Formacao;
  expanded: boolean;
  expandedCapacitacoes: string[];
  toggleFormacao: (id: string) => void;
  toggleCapacitacao: (id: string) => void;
  getWorkshopStatus: (workshop: Workshop) => { status: 'agendada' | 'enviada' | null, data?: Date };
  onSchedule: (workshop: Workshop) => void;
  onUpload: (workshop: Workshop) => void;
}

const FormacaoItem: React.FC<FormacaoItemProps> = ({
  formacao,
  expanded,
  expandedCapacitacoes,
  toggleFormacao,
  toggleCapacitacao,
  getWorkshopStatus,
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
        {formacao.capacitacoes.map((capacitacao) => (
          <CapacitacaoItem
            key={capacitacao.id}
            capacitacao={capacitacao}
            expanded={expandedCapacitacoes.includes(capacitacao.id)}
            toggleCapacitacao={toggleCapacitacao}
            getWorkshopStatus={getWorkshopStatus}
            onSchedule={onSchedule}
            onUpload={onUpload}
          />
        ))}
      </div>
    )}
  </div>
);

export default FormacaoItem;