import { format } from "date-fns";
import { CalendarIcon, FileCheck, FileText, Upload } from "lucide-react";
import React from "react";

import { Button } from "@/components/ui/button";

import { AgendamentoInfo, WorkshopFrontend } from "./types"; 
interface WorkshopItemProps {
  workshop: WorkshopFrontend;
  agendamentoInfo: AgendamentoInfo; 
  onSchedule: (workshop: WorkshopFrontend) => void;
  onUpload: (workshop: WorkshopFrontend) => void;
}

const WorkshopItem: React.FC<WorkshopItemProps> = ({
  workshop,
  agendamentoInfo, 
  onSchedule,
  onUpload,
}) => (
  <div className="flex items-center gap-2 p-2 border rounded-md bg-white">
    <FileText className="h-4 w-4 text-gray-500" />
    <span className="flex-1 text-sm">{workshop.nome}</span>

    {agendamentoInfo.statusExibicao === "enviada" && agendamentoInfo.dataExibicao && (
      <div className="flex items-center px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-xs">
        <CalendarIcon className="h-3 w-3 mr-1" />
        <span>Devolutiva agendada para {format(new Date(agendamentoInfo.dataExibicao), "dd/MM/yyyy")}</span>
      </div>
    )}

    {agendamentoInfo.statusExibicao === "agendada" && ( 
      <div className="flex items-center px-2 py-1 bg-green-100 text-green-800 rounded-md text-xs">
        <FileCheck className="h-3 w-3 mr-1" />
        <span>Devolutiva enviada</span>
        {agendamentoInfo.dataExibicao && ` em ${format(new Date(agendamentoInfo.dataExibicao), "dd/MM/yyyy")}`}
      </div>
    )}

    <div className="flex gap-1">
      <Button
        size="sm"
        variant={agendamentoInfo.statusExibicao === "agendada" ? "outline" : "secondary"}
        className="text-xs"
        onClick={() => onSchedule(workshop)}
      >
        <CalendarIcon className="h-3 w-3 mr-1" />
        {agendamentoInfo.statusExibicao === "agendada" ? "Reagendar" : "Agendar"}
      </Button>
      <Button
        size="sm"
        variant="default"
        className="text-xs bg-purple-gradient"
        onClick={() => onUpload(workshop)}
        // Desabilite o botão de Enviar se não houver agendamento, ou se já foi enviado, etc.
        disabled={agendamentoInfo.statusExibicao !== "agendada"} // Exemplo: só pode enviar se estiver agendada
      >
        <Upload className="h-3 w-3 mr-1" />
        Enviar
      </Button>
    </div>
  </div>
);

export default WorkshopItem;