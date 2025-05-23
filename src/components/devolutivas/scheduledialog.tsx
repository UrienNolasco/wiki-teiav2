// Em: @/components/devolutivas/scheduledialog.tsx

import { format, getHours, getMinutes, isValid, setHours, setMinutes, startOfDay } from "date-fns"; // Funções adicionais
import { ptBR } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import React from "react"; // Não precisa de useState aqui se todo o controle é via props

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

// import { toast } from "react-toastify"; // Removido se não usar toast aqui dentro
import { AvaliadorParaSelecao, WorkshopFrontend } from "./types";

export interface ScheduleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workshop: WorkshopFrontend | null;
  selectedDate: Date | undefined; // Este Date conterá dia, mês, ano, hora e minuto
  setSelectedDate: (date: Date | undefined) => void;
  selectedProfessorId: string;
  setSelectedProfessorId: (id: string) => void;
  avaliadores: AvaliadorParaSelecao[];
  onSave: () => void;
}

const ScheduleDialog: React.FC<ScheduleDialogProps> = ({
  open,
  onOpenChange,
  workshop,
  selectedDate,
  setSelectedDate,
  selectedProfessorId,
  setSelectedProfessorId,
  avaliadores,
  onSave,
}) => {
  const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
  const minutes = Array.from({ length: 60 / 5 }, (_, i) => (i * 5).toString().padStart(2, '0')); // 00, 05 ... 55

  // Chamado quando um dia é selecionado no Calendário
  const handleDaySelect = (day: Date | undefined) => {
    if (!day) {
      setSelectedDate(undefined); // Limpa a data e hora
      return;
    }
    // Pega o dia, mês, ano do calendário
    // Mantém a hora e minuto de selectedDate (se já definidos), ou usa um padrão.
    const currentHour = selectedDate && isValid(selectedDate) ? getHours(selectedDate) : 9; // Padrão 9h
    const currentMinute = selectedDate && isValid(selectedDate) ? getMinutes(selectedDate) : 0; // Padrão :00

    let newFullDate = setHours(startOfDay(day), currentHour); // startOfDay para garantir que a hora do 'day' não interfira
    newFullDate = setMinutes(newFullDate, currentMinute);
    setSelectedDate(newFullDate);
  };

  // Chamado quando a hora ou minuto é alterado nos Selects
  const handleTimeChange = (part: "hour" | "minute", value: string) => {
    const numericValue = parseInt(value, 10);
    if (isNaN(numericValue)) return;

    // Usa a data selecionada no calendário como base, ou o dia atual se nenhuma data foi escolhida ainda.
    const baseDate = selectedDate ? new Date(selectedDate.getTime()) : new Date();
    // Se não havia data selecionada e o usuário mexeu na hora/minuto,
    // é importante que baseDate seja um dia válido (ex: hoje ao meio-dia).
    // A lógica abaixo atualiza ou define a parte da hora/minuto.

    let newFullDate: Date;
    if (part === "hour") {
      newFullDate = setHours(baseDate, numericValue);
      if (!selectedDate) { // Se era a primeira interação e foi pela hora, zera os minutos
        newFullDate = setMinutes(newFullDate, 0);
      }
    } else { // part === "minute"
      newFullDate = setMinutes(baseDate, numericValue);
      if (!selectedDate) { // Se era a primeira interação e foi pelo minuto, usa a hora atual
         newFullDate = setHours(newFullDate, getHours(new Date()));
      }
    }
    setSelectedDate(newFullDate);
  };

  const displayDate = selectedDate && isValid(selectedDate)
    ? format(selectedDate, "PPP", { locale: ptBR })
    : "Selecione uma data";

  const selectedHourValue = selectedDate && isValid(selectedDate) ? getHours(selectedDate).toString().padStart(2, '0') : "";
  const selectedMinuteValue = selectedDate && isValid(selectedDate) ? getMinutes(selectedDate).toString().padStart(2, '0') : "";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Agendar Devolutiva</DialogTitle>
          <DialogDescription>
            {workshop
              ? `Agende uma devolutiva para ${workshop.nome}`
              : "Agendar devolutiva"}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {/* Seletor de Data */}
          <div className="grid gap-2">
            <Label htmlFor="date-picker-trigger">Data</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date-picker-trigger"
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !selectedDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  <span>{displayDate}</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 z-[1001]" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate} // Passa o selectedDate completo
                  onSelect={handleDaySelect} // Atualiza selectedDate mantendo/definindo hora
                  initialFocus
                  locale={ptBR}
                  disabled={(date) => date < startOfDay(new Date())} // Desabilita dias passados
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Seletor de Horário */}
          <div className="grid gap-2">
            <Label>Horário</Label>
            <div className="flex items-center gap-2">
              <Select
                value={selectedHourValue}
                onValueChange={(value) => handleTimeChange("hour", value)}
              >
                <SelectTrigger id="hour-select" className="flex-1">
                  <SelectValue placeholder="Hora" />
                </SelectTrigger>
                <SelectContent>
                  {hours.map((hour) => (
                    <SelectItem key={`h-${hour}`} value={hour}>
                      {hour}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <span className="text-muted-foreground">:</span>
              <Select
                value={selectedMinuteValue}
                onValueChange={(value) => handleTimeChange("minute", value)}
              >
                <SelectTrigger id="minute-select" className="flex-1">
                  <SelectValue placeholder="Min" />
                </SelectTrigger>
                <SelectContent>
                  {minutes.map((minute) => (
                    <SelectItem key={`m-${minute}`} value={minute}>
                      {minute}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Seletor de Professor (sem alterações na estrutura) */}
          <div className="grid gap-2">
            <Label htmlFor="professor-select">Professor Avaliador</Label>
            <Select
              value={selectedProfessorId}
              onValueChange={setSelectedProfessorId}
            >
              <SelectTrigger id="professor-select">
                <SelectValue placeholder="Selecione um professor" />
              </SelectTrigger>
              <SelectContent>
                {avaliadores.map((avaliador) => (
                  <SelectItem key={avaliador.id} value={avaliador.id}>
                    {avaliador.name || "Nome não disponível"}
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
          <Button
            onClick={onSave}
            className="bg-purple-gradient"
            disabled={!selectedDate || !isValid(selectedDate) || !selectedProfessorId} // Salvar só se data válida e professor selecionado
          >
            Agendar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ScheduleDialog;