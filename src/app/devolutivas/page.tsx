"use client"

import { format } from 'date-fns';
import { CalendarIcon, ChevronRight, FileCheck, FileText, Folder,FolderOpen, Upload } from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'react-toastify';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

// Mock data
const formacoes = [
  {
    id: 'f1',
    nome: 'Formação ABAP',
    capacitacoes: [
      {
        id: 'c1',
        nome: 'Capacitação Básica ABAP',
        workshops: [
          { id: 'w1', nome: 'Workshop 1 ABAP', status: null },
          { id: 'w2', nome: 'Workshop 2 ABAP', status: 'agendada' as const, data: new Date('2025-06-01') },
          { id: 'w3', nome: 'Workshop 3 ABAP', status: 'enviada' as const, data: new Date('2025-05-20') }
        ]
      },
      {
        id: 'c2',
        nome: 'Capacitação Avançada ABAP',
        workshops: [
          { id: 'w4', nome: 'Workshop 4 ABAP', status: null },
          { id: 'w5', nome: 'Workshop 5 ABAP', status: null }
        ]
      }
    ]
  },
  {
    id: 'f2',
    nome: 'Formação SD',
    capacitacoes: [
      {
        id: 'c3',
        nome: 'Capacitação SD',
        workshops: [
          { id: 'w6', nome: 'Workshop 1 SD', status: null },
          { id: 'w7', nome: 'Workshop 2 SD', status: 'agendada' as const, data: new Date('2025-06-10') }
        ]
      }
    ]
  },
  {
    id: 'f3',
    nome: 'Formação MM',
    capacitacoes: [
      {
        id: 'c4',
        nome: 'Capacitação MM',
        workshops: [
          { id: 'w8', nome: 'Workshop 1 MM', status: 'enviada' as const, data: new Date('2025-05-15') },
          { id: 'w9', nome: 'Workshop 2 MM', status: null }
        ]
      }
    ]
  }
];

const professores = [
  { id: 'p1', nome: 'Prof. Ana Silva' },
  { id: 'p2', nome: 'Prof. Carlos Santos' },
  { id: 'p3', nome: 'Prof. Maria Oliveira' },
  { id: 'p4', nome: 'Prof. João Pereira' }
];

interface Workshop {
  id: string;
  nome: string;
  status: 'agendada' | 'enviada' | null;
  data?: Date;
}

// interface Capacitacao {
//   id: string;
//   nome: string;
//   workshops: Workshop[];
// }

// interface Formacao {
//   id: string;
//   nome: string;
//   capacitacoes: Capacitacao[];
// }

const Devolutivas = () => {
  const [expandedFormacoes, setExpandedFormacoes] = useState<string[]>([]);
  const [expandedCapacitacoes, setExpandedCapacitacoes] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedProfessor, setSelectedProfessor] = useState<string>('');
  const [currentWorkshop, setCurrentWorkshop] = useState<Workshop | null>(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [fileSelected, setFileSelected] = useState<File | null>(null);
  
  // Local state to handle status changes
  const [workshopStatus, setWorkshopStatus] = useState<Record<string, { status: 'agendada' | 'enviada' | null, data?: Date }>>({});

  const toggleFormacao = (id: string) => {
    if (expandedFormacoes.includes(id)) {
      setExpandedFormacoes(expandedFormacoes.filter(formId => formId !== id));
    } else {
      setExpandedFormacoes([...expandedFormacoes, id]);
    }
  };

  const toggleCapacitacao = (id: string) => {
    if (expandedCapacitacoes.includes(id)) {
      setExpandedCapacitacoes(expandedCapacitacoes.filter(capId => capId !== id));
    } else {
      setExpandedCapacitacoes([...expandedCapacitacoes, id]);
    }
  };

  const handleScheduleDevolutiva = (workshop: Workshop) => {
    setCurrentWorkshop(workshop);
    setIsScheduleOpen(true);
    setSelectedDate(workshop.data);
    setSelectedProfessor(''); // Reset professor selection
  };

  const handleUploadDevolutiva = (workshop: Workshop) => {
    setCurrentWorkshop(workshop);
    setIsUploadOpen(true);
    setFileSelected(null); // Reset file selection
  };

  const saveSchedule = () => {
    if (!currentWorkshop || !selectedDate || !selectedProfessor) {
      toast.error("Por favor, selecione uma data e um professor.");
      return;
    }

    // Update workshop status
    setWorkshopStatus({
      ...workshopStatus,
      [currentWorkshop.id]: { status: 'agendada', data: selectedDate }
    });

    setIsScheduleOpen(false);
    toast.success("Devolutiva agendada com sucesso!");
  };

  const saveUpload = () => {
    if (!currentWorkshop || !fileSelected) {
      toast.error("Por favor, selecione um arquivo para enviar.");
      return;
    }

    // Update workshop status
    setWorkshopStatus({
      ...workshopStatus,
      [currentWorkshop.id]: { status: 'enviada', data: new Date() }
    });

    setIsUploadOpen(false);
    toast.success("Devolutiva enviada com sucesso!");
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setFileSelected(file);
      toast.info(`Arquivo selecionado: ${file.name}`);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFileSelected(file);
      toast.info(`Arquivo selecionado: ${file.name}`);
    }
  };

  // Helper to determine workshop status
  const getWorkshopStatus = (workshop: Workshop): { status: 'agendada' | 'enviada' | null, data?: Date } => {
    // Check first in our local state updates
    if (workshopStatus[workshop.id]) {
      return workshopStatus[workshop.id];
    }
    // Otherwise return the original status
    return { status: workshop.status, data: workshop.data };
  };

  return (
    <> 
      <div className="container mx-auto animate-fade-in">
        <div className="mb-8">
        <h1 className="text-3xl font-bold">Devolutivas para Avaliações</h1>
        <p className="text-muted-foreground">
          Gerencie as devolutivas para os workshops, agende e envie arquivos de feedback.
        </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold mb-4">Estrutura de Conteúdos</h2>
          
          <div className="space-y-2">
            {formacoes.map((formacao) => (
              <div key={formacao.id} className="border rounded-md">
                <div 
                  className="flex items-center gap-2 p-3 cursor-pointer hover:bg-slate-50"
                  onClick={() => toggleFormacao(formacao.id)}
                >
                  {expandedFormacoes.includes(formacao.id) ? 
                    <FolderOpen className="h-5 w-5 text-amber-500" /> : 
                    <Folder className="h-5 w-5 text-amber-500" />
                  }
                  <span className="font-medium flex-1">{formacao.nome}</span>
                  <ChevronRight 
                    className={cn(
                      "h-5 w-5 transition-transform duration-200",
                      expandedFormacoes.includes(formacao.id) && "rotate-90"
                    )} 
                  />
                </div>
                
                {expandedFormacoes.includes(formacao.id) && (
                  <div className="pl-6 pb-3">
                    {formacao.capacitacoes.map((capacitacao) => (
                      <div key={capacitacao.id} className="border-l border-dashed ml-2">
                        <div 
                          className="flex items-center gap-2 p-2 cursor-pointer hover:bg-slate-50 pl-4"
                          onClick={() => toggleCapacitacao(capacitacao.id)}
                        >
                          {expandedCapacitacoes.includes(capacitacao.id) ? 
                            <FolderOpen className="h-4 w-4 text-blue-500" /> : 
                            <Folder className="h-4 w-4 text-blue-500" />
                          }
                          <span className="flex-1">{capacitacao.nome}</span>
                          <ChevronRight 
                            className={cn(
                              "h-4 w-4 transition-transform duration-200",
                              expandedCapacitacoes.includes(capacitacao.id) && "rotate-90"
                            )} 
                          />
                        </div>
                        
                        {expandedCapacitacoes.includes(capacitacao.id) && (
                          <div className="pl-8 py-2 space-y-2">
                            {capacitacao.workshops.map((workshop) => {
                              const currentStatus = getWorkshopStatus(workshop);
                              return (
                                <div key={workshop.id} className="flex items-center gap-2 p-2 border rounded-md bg-white">
                                  <FileText className="h-4 w-4 text-gray-500" />
                                  <span className="flex-1 text-sm">{workshop.nome}</span>
                                  
                                  {currentStatus.status === 'agendada' && (
                                    <div className="flex items-center px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-xs">
                                      <CalendarIcon className="h-3 w-3 mr-1" />
                                      <span>Devolutiva agendada para {format(new Date(currentStatus.data!), 'dd/MM/yyyy')}</span>
                                    </div>
                                  )}
                                  
                                  {currentStatus.status === 'enviada' && (
                                    <div className="flex items-center px-2 py-1 bg-green-100 text-green-800 rounded-md text-xs">
                                      <FileCheck className="h-3 w-3 mr-1" />
                                      <span>Devolutiva enviada</span>
                                    </div>
                                  )}
                                  
                                  <div className="flex gap-1">
                                    <Button 
                                      size="sm" 
                                      variant={currentStatus.status === 'agendada' ? 'outline' : 'secondary'} 
                                      className="text-xs"
                                      onClick={() => handleScheduleDevolutiva(workshop)}
                                    >
                                      <CalendarIcon className="h-3 w-3 mr-1" />
                                      {currentStatus.status === 'agendada' ? 'Reagendar' : 'Agendar'}
                                    </Button>
                                    
                                    <Button 
                                      size="sm" 
                                      variant="default" 
                                      className="text-xs bg-purple-gradient"
                                      onClick={() => handleUploadDevolutiva(workshop)}
                                    >
                                      <Upload className="h-3 w-3 mr-1" />
                                      Enviar
                                    </Button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Schedule Dialog */}
      <Dialog open={isScheduleOpen} onOpenChange={setIsScheduleOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Agendar Devolutiva</DialogTitle>
            <DialogDescription>
              {currentWorkshop ? `Agende uma devolutiva para ${currentWorkshop.nome}` : 'Agendar devolutiva'}
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
                    {selectedDate ? format(selectedDate, 'PPP') : <span>Selecione uma data</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
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
                  {professores.map(professor => (
                    <SelectItem key={professor.id} value={professor.id}>
                      {professor.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsScheduleOpen(false)}>Cancelar</Button>
            <Button onClick={saveSchedule} className="bg-purple-gradient">Agendar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Upload Dialog */}
      <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Enviar Devolutiva</DialogTitle>
            <DialogDescription>
              {currentWorkshop ? `Envie a devolutiva para ${currentWorkshop.nome}` : 'Enviar devolutiva'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div 
              className={cn(
                "border-2 border-dashed rounded-lg p-8 text-center flex flex-col items-center justify-center transition-colors",
                isDragging ? "border-purple-500 bg-purple-50" : "border-gray-300",
                "cursor-pointer"
              )}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => document.getElementById('fileInput')?.click()}
            >
              <input
                type="file"
                id="fileInput"
                className="hidden"
                onChange={handleFileInput}
              />
              <Upload className="h-10 w-10 text-purple-500 mb-2" />
              <p className="text-sm font-medium mb-1">
                {fileSelected ? fileSelected.name : "Arraste e solte ou clique para selecionar um arquivo"}
              </p>
              <p className="text-xs text-muted-foreground">
                Suporta PDFs, documentos e imagens (até 10MB)
              </p>
            </div>
            
            {fileSelected && (
              <div className="bg-slate-50 p-3 rounded-md flex items-center">
                <FileCheck className="h-5 w-5 text-green-500 mr-2" />
                <div className="flex-1 overflow-hidden">
                  <p className="font-medium text-sm truncate">{fileSelected.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(fileSelected.size / 1024).toFixed(1)} KB
                  </p>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-red-500 h-8 hover:text-red-700"
                  onClick={(e) => {
                    e.stopPropagation();
                    setFileSelected(null);
                  }}
                >
                  Remover
                </Button>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUploadOpen(false)}>Cancelar</Button>
            <Button 
              onClick={saveUpload} 
              className="bg-purple-gradient"
              disabled={!fileSelected}
            >
              Enviar Arquivo
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </>
  );
};

export default Devolutivas;
