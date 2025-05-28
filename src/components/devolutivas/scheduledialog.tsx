import { format, getHours, getMinutes, isValid, setHours, setMinutes, startOfDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon, ChevronDown } from "lucide-react"; // Added ChevronDown
import React from "react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox"; // Added Checkbox
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

import { AvaliadorParaSelecao, IUser, WorkshopFrontend } from "./types";

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
  // Props for optional participants
  allUsersForSelection: IUser[]; 
  selectedOptionalParticipants: IUser[];
  onSelectedOptionalParticipantsChange: React.Dispatch<React.SetStateAction<IUser[]>>; // Or (users: IUser[]) => void if you prefer
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
  allUsersForSelection, // New prop
  selectedOptionalParticipants, // New prop
  onSelectedOptionalParticipantsChange, // New prop
}) => {
  const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
  const minutes = Array.from({ length: 60 / 5 }, (_, i) => (i * 5).toString().padStart(2, '0'));

  const handleDaySelect = (day: Date | undefined) => {
    if (!day) {
      setSelectedDate(undefined);
      return;
    }
    const currentHour = selectedDate && isValid(selectedDate) ? getHours(selectedDate) : 9;
    const currentMinute = selectedDate && isValid(selectedDate) ? getMinutes(selectedDate) : 0;

    let newFullDate = setHours(startOfDay(day), currentHour);
    newFullDate = setMinutes(newFullDate, currentMinute);
    setSelectedDate(newFullDate);
  };

  const handleTimeChange = (part: "hour" | "minute", value: string) => {
    const numericValue = parseInt(value, 10);
    if (isNaN(numericValue)) return;

    const baseDate = selectedDate ? new Date(selectedDate.getTime()) : new Date();
    let newFullDate: Date;
    if (part === "hour") {
      newFullDate = setHours(baseDate, numericValue);
      if (!selectedDate) {
        newFullDate = setMinutes(newFullDate, 0);
      }
    } else {
      newFullDate = setMinutes(baseDate, numericValue);
      if (!selectedDate) {
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

  // Handler for selecting/deselecting an optional participant
  const handleOptionalParticipantToggle = (participant: IUser) => {
    onSelectedOptionalParticipantsChange(prevSelected => {
      const isAlreadySelected = prevSelected.find(p => p.id === participant.id);
      if (isAlreadySelected) {
        return prevSelected.filter(p => p.id !== participant.id);
      } else {
        return [...prevSelected, participant];
      }
    });
  };

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
                  selected={selectedDate}
                  onSelect={handleDaySelect}
                  initialFocus
                  locale={ptBR}
                  disabled={(date) => date < startOfDay(new Date())}
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

          {/* Seletor de Professor (Avaliador) */}
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

          {/* Seletor de Participantes Opcionais (Multi-select) */}
          <div className="grid gap-2">
            <Label htmlFor="participant-select-trigger">Participantes Opcionais</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="participant-select-trigger"
                  variant="outline"
                  className="w-full justify-start font-normal"
                >
                  {selectedOptionalParticipants.length > 0
                    ? `${selectedOptionalParticipants.length} selecionado(s): ${selectedOptionalParticipants.map(p=>p.name?.split(' ')[0] || p.email).slice(0,2).join(', ')}${selectedOptionalParticipants.length > 2 ? '...' : ''}`
                    : "Selecione participantes"}
                  <ChevronDown className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                 {/* You can add a search/filter input here if needed for long lists */}
                <div className="max-h-60 overflow-y-auto p-1">
                  {allUsersForSelection && allUsersForSelection.length > 0 ? (
                    allUsersForSelection.map((user) => (
                      <div
                        key={user.id}
                        className="flex items-center space-x-2 p-2 hover:bg-accent rounded-md cursor-pointer"
                        onClick={() => handleOptionalParticipantToggle(user)} // Make whole item clickable
                      >
                        <Checkbox
                          id={`opt-participant-${user.id}`}
                          checked={selectedOptionalParticipants.some(p => p.id === user.id)}
                          onCheckedChange={() => handleOptionalParticipantToggle(user)} // Keep individual checkbox action too
                        />
                        <Label
                          htmlFor={`opt-participant-${user.id}`}
                          className="font-normal flex-1 cursor-pointer"
                        >
                          {user.name || user.email || "Usuário sem nome"}
                        </Label>
                      </div>
                    ))
                  ) : (
                    <p className="p-2 text-sm text-muted-foreground text-center">Nenhum usuário disponível.</p>
                  )}
                </div>
              </PopoverContent>
            </Popover>
          </div>

        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            onClick={onSave}
            className="bg-purple-gradient" // Ensure this class is defined in your CSS
            disabled={!selectedDate || !isValid(selectedDate) || !selectedProfessorId}
          >
            Agendar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ScheduleDialog;