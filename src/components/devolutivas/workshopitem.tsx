import { format } from "date-fns";
import { CalendarIcon, FileCheck, FileText, Upload } from "lucide-react";
import React from "react";

import { Button } from "@/components/ui/button";

import { Workshop } from "./types";

interface WorkshopItemProps {
  workshop: Workshop;
  status: { status: 'agendada' | 'enviada' | null; data?: Date };
  onSchedule: (workshop: Workshop) => void;
  onUpload: (workshop: Workshop) => void;
}

const WorkshopItem: React.FC<WorkshopItemProps> = ({
  workshop,
  status,
  onSchedule,
  onUpload,
}) => (
  <div className="flex items-center gap-2 p-2 border rounded-md bg-white">
    <FileText className="h-4 w-4 text-gray-500" />
    <span className="flex-1 text-sm">{workshop.nome}</span>
    {status.status === "agendada" && status.data && (
      <div className="flex items-center px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-xs">
        <CalendarIcon className="h-3 w-3 mr-1" />
        <span>Devolutiva agendada para {format(new Date(status.data), "dd/MM/yyyy")}</span>
      </div>
    )}
    {status.status === "enviada" && (
      <div className="flex items-center px-2 py-1 bg-green-100 text-green-800 rounded-md text-xs">
        <FileCheck className="h-3 w-3 mr-1" />
        <span>Devolutiva enviada</span>
      </div>
    )}
    <div className="flex gap-1">
      <Button
        size="sm"
        variant={status.status === "agendada" ? "outline" : "secondary"}
        className="text-xs"
        onClick={() => onSchedule(workshop)}
      >
        <CalendarIcon className="h-3 w-3 mr-1" />
        {status.status === "agendada" ? "Reagendar" : "Agendar"}
      </Button>
      <Button
        size="sm"
        variant="default"
        className="text-xs bg-purple-gradient"
        onClick={() => onUpload(workshop)}
      >
        <Upload className="h-3 w-3 mr-1" />
        Enviar
      </Button>
    </div>
  </div>
);

export default WorkshopItem;