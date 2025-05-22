// Em: @/components/devolutivas/scheduledialog.tsx

import { format, getHours, getMinutes, setHours, setMinutes } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon } from "lucide-react"; // Usando lucide-react como no seu ScheduleDialog original
import React, { useState } from "react"; // Importar useState se precisar de estado local no Popover

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
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"; // Importar ScrollArea
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

import { AvaliadorParaSelecao, WorkshopFrontend } from "./types";

export interface ScheduleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workshop: WorkshopFrontend | null;
  selectedDate: Date | undefined;
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
  // Estado local para o Popover, para que não feche ao clicar nos botões de hora/minuto
  const [isDateTimePopoverOpen, setIsDateTimePopoverOpen] = useState(false);

  const hours = Array.from({ length: 24 }, (_, i) => i); // Números paragetHours()
  const minutes = Array.from({ length: 12 }, (_, i) => i * 5); // 0, 5, 10... 55 para getMinutes()

  const handleDateCalendarSelect = (date: Date | undefined) => {
    if (!date) {
      setSelectedDate(undefined);
      return;
    }
    // Ao selecionar um dia no calendário, mantenha a hora/minuto existentes
    // ou defina um padrão se não houver hora/minuto (ex: 9:00).
    const currentHour = selectedDate ? getHours(selectedDate) : 9; // Padrão 9h
    const currentMinute = selectedDate ? getMinutes(selectedDate) : 0; // Padrão :00

    let newSelectedDate = setHours(date, currentHour);
    newSelectedDate = setMinutes(newSelectedDate, currentMinute);
    setSelectedDate(newSelectedDate);
    // Não fechar o popover aqui, o usuário ainda vai escolher hora/minuto.
    // setIsDateTimePopoverOpen(false); // Removido para manter o popover aberto
  };

  const handleTimeChange = (type: "hour" | "minute", value: string) => {
    const numericValue = parseInt(value, 10);
    let baseDate = selectedDate || new Date(); // Se não houver data, usa hoje como base

    if (type === "hour") {
      baseDate = setHours(baseDate, numericValue);
      // Se selectedDate era undefined, e só a hora foi mudada, os minutos podem ser 0.
      if (!selectedDate) baseDate = setMinutes(baseDate, 0);
    } else if (type === "minute") {
      // Se selectedDate era undefined, e só o minuto foi mudado, a hora pode ser a atual.
      if (!selectedDate) baseDate = setHours(baseDate, getHours(new Date()));
      baseDate = setMinutes(baseDate, numericValue);
    }
    setSelectedDate(baseDate);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md md:max-w-lg lg:max-w-xl"> {/* Ajuste o tamanho conforme necessário */}
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
            <Label htmlFor="date-time-picker-button">Data e Hora da Devolutiva</Label>
            <Popover open={isDateTimePopoverOpen} onOpenChange={setIsDateTimePopoverOpen}>
              <PopoverTrigger asChild>
                <Button
                  id="date-time-picker-button"
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !selectedDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? (
                    format(selectedDate, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })
                  ) : (
                    <span>Selecione data e hora</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 z-[1001]">
                {/* Layout flexível para telas sm e maiores */}
                <div className="sm:flex">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={handleDateCalendarSelect}
                    initialFocus
                    locale={ptBR}
                    disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))}
                  />
                  {/* Div para seletores de tempo, com layout similar ao exemplo */}
                  <div className="flex flex-col sm:flex-row sm:h-[290px] divide-y sm:divide-y-0 sm:divide-x border-t sm:border-t-0 sm:border-l">
                    <ScrollArea className="h-[120px] sm:h-full sm:w-auto"> {/* Altura ajustada para mobile */}
                      <div className="flex sm:flex-col p-1.5 sm:p-2 gap-1 sm:gap-0">
                        {hours.map((hour) => (
                          <Button
                            key={`h-${hour}`}
                            size="sm" // Tamanho um pouco maior que icon para caber 2 dígitos
                            variant={
                              selectedDate && getHours(selectedDate) === hour
                                ? "default"
                                : "ghost"
                            }
                            className="w-full shrink-0 aspect-square sm:aspect-auto" // Ajuste de aspecto
                            onClick={() => {
                              handleTimeChange("hour", hour.toString());
                            }}
                          >
                            {hour.toString().padStart(2, '0')}
                          </Button>
                        ))}
                      </div>
                      <ScrollBar orientation="horizontal" className="sm:hidden" />
                    </ScrollArea>
                    <ScrollArea className="h-[120px] sm:h-full sm:w-auto"> {/* Altura ajustada para mobile */}
                      <div className="flex sm:flex-col p-1.5 sm:p-2 gap-1 sm:gap-0">
                        {minutes.map((minute) => (
                          <Button
                            key={`m-${minute}`}
                            size="sm"
                            variant={
                              selectedDate && getMinutes(selectedDate) === minute
                                ? "default"
                                : "ghost"
                            }
                            className="w-full shrink-0 aspect-square sm:aspect-auto" // Ajuste de aspecto
                            onClick={() => {
                              handleTimeChange("minute", minute.toString());
                            }}
                          >
                            {minute.toString().padStart(2, "0")}
                          </Button>
                        ))}
                      </div>
                      <ScrollBar orientation="horizontal" className="sm:hidden" />
                    </ScrollArea>
                  </div>
                </div>
                {/* Botão para confirmar a seleção de data/hora e fechar o popover */}
                <div className="p-2 border-t text-right">
                    <Button size="sm" onClick={() => setIsDateTimePopoverOpen(false)}>Confirmar Hora</Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="professor">Professor Avaliador</Label>
            <Select
              value={selectedProfessorId}
              onValueChange={setSelectedProfessorId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um professor avaliador" />
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
            disabled={!selectedDate || !selectedProfessorId}
          >
            Agendar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ScheduleDialog;