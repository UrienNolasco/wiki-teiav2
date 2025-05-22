"use client";

import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify'; 

import EstruturaDeConteudos from '@/components/devolutivas/estruturadeconteudo'; 
import ScheduleDialog from '@/components/devolutivas/scheduledialog';         
import {
  AvaliadorParaSelecao,
  DevolutivaAgendamentoFrontend,
  FormacaoFrontend,
  RawCapacitacao,
  RawDevolutivaAgendamento,
  RawFormacao,
  RawWorkshop,
  WorkshopFrontend
} from '@/components/devolutivas/types';
import UploadDialog from '@/components/devolutivas/uploaddialog';

import { agendarNovaDevolutiva } from '../actions/agendarNovaDevolutiva';
import { getAllFormacaoComAgendamentos } from '../actions/formacao/getAllFormacaoComAgendamentos';
import { getAvaliadores } from '../actions/getAvaliadores';
import { updateDevolutivaAgendada } from '../actions/updateDevolutivaAgendada';


const Devolutivas: React.FC = () => {
  const [formacoes, setFormacoes] = useState<FormacaoFrontend[]>([]);
  const [avaliadores, setAvaliadores] = useState<AvaliadorParaSelecao[]>([]);
  const [expandedFormacoes, setExpandedFormacoes] = useState<string[]>([]);
  const [expandedCapacitacoes, setExpandedCapacitacoes] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedProfessorId, setSelectedProfessorId] = useState<string>("");
  const [currentWorkshop, setCurrentWorkshop] = useState<WorkshopFrontend | null>(null);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false); // Adicionado para controlar o UploadDialog
  const [isDragging, setIsDragging] = useState(false);
  const [fileSelected, setFileSelected] = useState<File | null>(null);
  const [editingDevolutivaId, setEditingDevolutivaId] = useState<string | null>(null);
  // const [currentDevolutivaId, setCurrentDevolutivaId] = useState<string | null>(null); // Se necessário para upload

  const { data: session } = useSession();
  const idDoUsuarioLogado = session?.user?.id;

  const parseFetchedFormacoes = (data: RawFormacao[]): FormacaoFrontend[] => {
    return data.map((f:RawFormacao) => ({
      ...f,
      capacitacoes: f.capacitacoes.map((c: RawCapacitacao) => ({
        ...c,
        workshops: c.workshops.map((w: RawWorkshop) => ({
          ...w,
          devolutivasAgendadas: w.devolutivasAgendadas?.map((da: RawDevolutivaAgendamento) => ({
            ...da,
            dataAgendada: new Date(da.dataAgendada),
            criadoEm: new Date(da.criadoEm),
          })) || [],
        })),
      })),
    }));
  };

  const fetchData = async () => {
    try {
      const [formacoesData, avaliadoresData] = await Promise.all([
        getAllFormacaoComAgendamentos(),
        getAvaliadores(),
      ]);
      console.log("DADOS BRUTOS DO BACKEND (formacoesData):" ,formacoesData);
      setFormacoes(parseFetchedFormacoes(formacoesData as RawFormacao[]));
      setAvaliadores(avaliadoresData as AvaliadorParaSelecao[]);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      toast.error("Falha ao carregar dados da página.");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getAgendamentoInfoParaWorkshop = (workshop: WorkshopFrontend): {
    temAgendamento: boolean;
    agendamento?: DevolutivaAgendamentoFrontend;
    podeAgendar: boolean;
    statusExibicao: 'agendada' | 'nenhum';
    dataExibicao?: Date;
  } => {
    const agendamentoMaisRecente = workshop.DevolutivaAgendamento && workshop.DevolutivaAgendamento.length > 0
      ? [...workshop.DevolutivaAgendamento].sort((a, b) => b.criadoEm.getTime() - a.criadoEm.getTime())[0]
      : undefined;

    if (agendamentoMaisRecente) {
        return {
            temAgendamento: true,
            agendamento: agendamentoMaisRecente,
            podeAgendar: false,
            statusExibicao: 'agendada',
            dataExibicao: agendamentoMaisRecente.dataAgendada,
        };
    }
    return {
      temAgendamento: false,
      agendamento: undefined,
      podeAgendar: true, 
      statusExibicao: 'nenhum',
      dataExibicao: undefined,
    };
  };

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

  const handleScheduleDevolutiva = (workshop: WorkshopFrontend) => {
    setCurrentWorkshop(workshop);
    const infoAgendamento = getAgendamentoInfoParaWorkshop(workshop);
    if(infoAgendamento.temAgendamento && infoAgendamento.agendamento){
    setSelectedDate(new Date(infoAgendamento.agendamento.dataAgendada)); // Certifique-se que é um objeto Date
    setSelectedProfessorId(infoAgendamento.agendamento.avaliadorId);
    setEditingDevolutivaId(infoAgendamento.agendamento.id);
    }else {
      setSelectedDate(undefined);
      setSelectedProfessorId("");
      setEditingDevolutivaId(null);
    }
    setIsScheduleOpen(true);
  };

  const handleUploadDevolutiva = (workshop: WorkshopFrontend) => {
    const infoAgendamento = getAgendamentoInfoParaWorkshop(workshop);
    if (infoAgendamento.temAgendamento) {
        setCurrentWorkshop(workshop); 
        setIsUploadOpen(true);
        setFileSelected(null);
        toast.info("Funcionalidade de upload de arquivo a ser implementada ou conectada.");
    } else {
        toast.warn("Agende uma devolutiva primeiro para este workshop antes de enviar um arquivo.");
    }
  };

  const saveSchedule = async () => {
    if (!currentWorkshop || !selectedDate || !selectedProfessorId || !idDoUsuarioLogado) {
      toast.error("Workshop, data, professor ou usuário não autenticado são inválidos.");
      return;
    }
  
    try {
      if (editingDevolutivaId) {
        // Atualizar agendamento existente
        await updateDevolutivaAgendada({
          devolutivaAgendamentoId: editingDevolutivaId,
          dataAgendada: selectedDate,
          avaliadorId: selectedProfessorId,
        });
        toast.success("Devolutiva reagendada com sucesso!");
      } else {
        // Criar novo agendamento
        await agendarNovaDevolutiva({
          workshopId: currentWorkshop.id,
          avaliadorId: selectedProfessorId,
          dataAgendada: selectedDate,
          agendadorId: idDoUsuarioLogado,
        });
        toast.success("Devolutiva agendada com sucesso!");
      }
      setIsScheduleOpen(false);
      setEditingDevolutivaId(null); // Limpa o ID de edição após salvar
      fetchData(); // Recarrega os dados para refletir a mudança
    } catch (error) { // Especificar 'any' ou um tipo de erro mais específico
      toast.error("Falha ao salvar agendamento da devolutiva.");
      console.error("Erro ao salvar agendamento:", error);
    }
  };

  const saveUpload = async () => { // Tornada async para futuras chamadas de API
    if (!currentWorkshop || !fileSelected) {
      toast.error("Por favor, selecione um workshop e um arquivo para enviar.");
      return;
    }
    toast.info(`Simulação de envio do arquivo: ${fileSelected.name} para o workshop ${currentWorkshop.nome}. Lógica a implementar.`);
    setIsUploadOpen(false);
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
    setIsDragging(true); // Mantenha true enquanto arrasta sobre
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
            getAgendamentoInfo={getAgendamentoInfoParaWorkshop}
            onSchedule={handleScheduleDevolutiva}
            onUpload={handleUploadDevolutiva}
          />
        </div>
      </div>
      <ScheduleDialog
        open={isScheduleOpen}
        onOpenChange={setIsScheduleOpen}
        workshop={currentWorkshop} // WorkshopFrontend | null
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        selectedProfessorId={selectedProfessorId} // Passando o ID
        setSelectedProfessorId={setSelectedProfessorId} // Passando a função de set para o ID
        avaliadores={avaliadores} 
        onSave={saveSchedule}
      />
      <UploadDialog
        open={isUploadOpen}
        onOpenChange={setIsUploadOpen}
        workshop={currentWorkshop} // WorkshopFrontend | null
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