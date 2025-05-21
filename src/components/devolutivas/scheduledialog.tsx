import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import React from "react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

import { Professor,Workshop } from "./types";

interface ScheduleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workshop: Workshop | null;
  selectedDate: Date | undefined;
  setSelectedDate: (date: Date | undefined) => void;
  selectedProfessor: string;
  setSelectedProfessor: (id: string) => void;
  professores: Professor[];
  onSave: () => void;
}

const ScheduleDialog: React.FC<ScheduleDialogProps> = ({
  open,
  onOpenChange,
  workshop,
  selectedDate,
  setSelectedDate,
  selectedProfessor,
  setSelectedProfessor,
  professores,
  onSave,
}) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Agendar Devolutiva</DialogTitle>
        <DialogDescription>
          {workshop ? `Agende uma devolutiva para ${workshop.nome}` : "Agendar devolutiva"}
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="grid gap-2">
          <Label htmlFor="date">Data da Devolutiva</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !selectedDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate ? format(selectedDate, "PPP") : <span>Selecione uma data</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      locale={ptBR}
                    />
                  </PopoverContent>
          </Popover>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="professor">Professor</Label>
          <Select value={selectedProfessor} onValueChange={setSelectedProfessor}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione um professor" />
            </SelectTrigger>
            <SelectContent>
              {professores.map((professor) => (
                <SelectItem key={professor.id} value={professor.id}>
                  {professor.nome}
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
        <Button onClick={onSave} className="bg-purple-gradient">
          Agendar
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

export default ScheduleDialog;