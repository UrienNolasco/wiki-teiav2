
import React from "react";

import FormacaoItem from "./formacaoitem";
import { DevolutivaAgendamentoFrontend, FormacaoFrontend, WorkshopFrontend,  } from "./types";

interface EstruturaDeConteudosProps {
  formacoes: FormacaoFrontend[];
  expandedFormacoes: string[];
  expandedCapacitacoes: string[];
  toggleFormacao: (id: string) => void;
  toggleCapacitacao: (id: string) => void;
  getAgendamentoInfo: (workshop: WorkshopFrontend) => {
    temAgendamento: boolean;
    agendamento?: DevolutivaAgendamentoFrontend;
    podeAgendar: boolean;
    statusExibicao: 'agendada' | 'nenhum' | 'outro_status_se_houver'; // Ajuste conforme sua lógica
    dataExibicao?: Date;
  };
  onSchedule: (workshop: WorkshopFrontend) => void;
  onUpload: (workshop: WorkshopFrontend) => void;
}

const EstruturaDeConteudos: React.FC<EstruturaDeConteudosProps> = ({
  formacoes,
  expandedFormacoes,
  expandedCapacitacoes,
  toggleFormacao,
  toggleCapacitacao,
  getAgendamentoInfo,
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
        getAgendamentoInfo={getAgendamentoInfo}
        onSchedule={onSchedule}
        onUpload={onUpload}
      />
    ))}
  </div>
);

export default EstruturaDeConteudos;