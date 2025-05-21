import React from "react";

import FormacaoItem from "./formacaoitem";
import { Formacao, Workshop } from "./types";

interface EstruturaDeConteudosProps {
  formacoes: Formacao[];
  expandedFormacoes: string[];
  expandedCapacitacoes: string[];
  toggleFormacao: (id: string) => void;
  toggleCapacitacao: (id: string) => void;
  getWorkshopStatus: (workshop: Workshop) => { status: 'agendada' | 'enviada' | null, data?: Date };
  onSchedule: (workshop: Workshop) => void;
  onUpload: (workshop: Workshop) => void;
}

const EstruturaDeConteudos: React.FC<EstruturaDeConteudosProps> = ({
  formacoes,
  expandedFormacoes,
  expandedCapacitacoes,
  toggleFormacao,
  toggleCapacitacao,
  getWorkshopStatus,
  onSchedule,
  onUpload,
}) => (
  <div className="space-y-2">
    {formacoes.map((formacao) => (
      <FormacaoItem
        key={formacao.id}
        formacao={formacao}
        expanded={expandedFormacoes.includes(formacao.id)}
        expandedCapacitacoes={expandedCapacitacoes}
        toggleFormacao={toggleFormacao}
        toggleCapacitacao={toggleCapacitacao}
        getWorkshopStatus={getWorkshopStatus}
        onSchedule={onSchedule}
        onUpload={onUpload}
      />
    ))}
  </div>
);

export default EstruturaDeConteudos;