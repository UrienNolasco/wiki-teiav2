// Em: @/components/devolutivas/scheduledialog.tsx

import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import React from "react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

// Importe o tipo AvaliadorParaSelecao
import { AvaliadorParaSelecao,WorkshopFrontend } from "./types";

export interface ScheduleDialogProps { // ✅ Exportando a interface se ainda não estiver
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workshop: WorkshopFrontend | null;
  selectedDate: Date | undefined;
  setSelectedDate: (date: Date | undefined) => void;
  selectedProfessorId: string;
  setSelectedProfessorId: (id: string) => void;
  avaliadores: AvaliadorParaSelecao[]; // ✅ Alterado de 'professores: Professor[]'
  onSave: () => void; // Se saveSchedule for async, considere () => Promise<void>
}

const ScheduleDialog: React.FC<ScheduleDialogProps> = ({
  open,
  onOpenChange,
  workshop,
  selectedDate,
  setSelectedDate,
  selectedProfessorId,
  setSelectedProfessorId,
  avaliadores, // ✅ Alterado de 'professores'
  onSave,
}) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Agendar Devolutiva</DialogTitle>
        <DialogDescription>
          {workshop
            ? `Agende uma devolutiva para ${workshop.nome}`
            : "Agendar devolutiva"}
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="grid gap-2">
          <Label htmlFor="date">Data da Devolutiva</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn("w-full justify-start text-left font-normal")}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate ? (
                  format(selectedDate, "PPP", { locale: ptBR }) // Adicionado locale aqui também
                ) : (
                  <span>Selecione uma data</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 z-[1001]" align="start"> {/* Aumentei o z-index como sugestão, se o calendário estiver aparecendo atrás de algo */}
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                initialFocus
                locale={ptBR}
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="professor">Professor Avaliador</Label> {/* Nome do Label ajustado para clareza */}
          <Select
            value={selectedProfessorId}
            onValueChange={setSelectedProfessorId}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione um professor avaliador" />
            </SelectTrigger>
            <SelectContent>
              {avaliadores.map((avaliador) => ( // ✅ Alterado de 'professores.map((professor)...'
                <SelectItem key={avaliador.id} value={avaliador.id}>
                  {avaliador.name || "Nome não disponível"} {/* ✅ Usando avaliador.name e fallback */}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={() => onOpenChange(false)}>
          Cancelar
        </Button>
        <Button onClick={onSave} className="bg-purple-gradient"> {/* Considere desabilitar se onSave for async e estiver em progresso */}
          Agendar
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

export default ScheduleDialog;