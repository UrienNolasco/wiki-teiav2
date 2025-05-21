"use client"

import React, { useState } from 'react';
import { toast } from 'react-toastify';

import EstruturaDeConteudos from '@/components/devolutivas/estruturadeconteudo';
import ScheduleDialog from '@/components/devolutivas/scheduledialog';
import UploadDialog from '@/components/devolutivas/uploaddialog';

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

const Devolutivas: React.FC = () => {
  const [expandedFormacoes, setExpandedFormacoes] = useState<string[]>([]);
  const [expandedCapacitacoes, setExpandedCapacitacoes] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedProfessor, setSelectedProfessor] = useState<string>("");
  const [currentWorkshop, setCurrentWorkshop] = useState<Workshop | null>(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [fileSelected, setFileSelected] = useState<File | null>(null);
  const [workshopStatus, setWorkshopStatus] = useState<Record<string, { status: 'agendada' | 'enviada' | null, data?: Date }>>({});

  const toggleFormacao = (id: string) => {
    setExpandedFormacoes((prev) =>
      prev.includes(id) ? prev.filter((fid) => fid !== id) : [...prev, id]
    );
  };

  const toggleCapacitacao = (id: string) => {
    setExpandedCapacitacoes((prev) =>
      prev.includes(id) ? prev.filter((cid) => cid !== id) : [...prev, id]
    );
  };

  const handleScheduleDevolutiva = (workshop: Workshop) => {
    setCurrentWorkshop(workshop);
    setIsScheduleOpen(true);
    setSelectedDate(workshop.data);
    setSelectedProfessor("");
  };

  const handleUploadDevolutiva = (workshop: Workshop) => {
    setCurrentWorkshop(workshop);
    setIsUploadOpen(true);
    setFileSelected(null);
  };

  const saveSchedule = () => {
    if (!currentWorkshop || !selectedDate || !selectedProfessor) {
      toast.error("Por favor, selecione uma data e um professor.");
      return;
    }
    setWorkshopStatus({
      ...workshopStatus,
      [currentWorkshop.id]: { status: "agendada", data: selectedDate },
    });
    setIsScheduleOpen(false);
    toast.success("Devolutiva agendada com sucesso!");
  };

  const saveUpload = () => {
    if (!currentWorkshop || !fileSelected) {
      toast.error("Por favor, selecione um arquivo para enviar.");
      return;
    }
    setWorkshopStatus({
      ...workshopStatus,
      [currentWorkshop.id]: { status: "enviada", data: new Date() },
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

  const getWorkshopStatus = (workshop: Workshop) => {
    if (workshopStatus[workshop.id]) {
      return workshopStatus[workshop.id];
    }
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
          <EstruturaDeConteudos
            formacoes={formacoes}
            expandedFormacoes={expandedFormacoes}
            expandedCapacitacoes={expandedCapacitacoes}
            toggleFormacao={toggleFormacao}
            toggleCapacitacao={toggleCapacitacao}
            getWorkshopStatus={getWorkshopStatus}
            onSchedule={handleScheduleDevolutiva}
            onUpload={handleUploadDevolutiva}
          />
        </div>
      </div>
      <ScheduleDialog
        open={isScheduleOpen}
        onOpenChange={setIsScheduleOpen}
        workshop={currentWorkshop}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        selectedProfessor={selectedProfessor}
        setSelectedProfessor={setSelectedProfessor}
        professores={professores}
        onSave={saveSchedule}
      />
      <UploadDialog
        open={isUploadOpen}
        onOpenChange={setIsUploadOpen}
        workshop={currentWorkshop}
        isDragging={isDragging}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onFileInput={handleFileInput}
        fileSelected={fileSelected}
        setFileSelected={setFileSelected}
        onSave={saveUpload}
      />
    </>
  );
};

export default Devolutivas;