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
  IUser,
  RawCapacitacao,
  RawDevolutivaAgendamento,
  RawFormacao,
  RawWorkshop,
  WorkshopFrontend
} from '@/components/devolutivas/types';
import UploadDialog from '@/components/devolutivas/uploaddialog';

import { agendarNovaDevolutiva } from '../actions/agendarNovaDevolutiva';
import { createTeamsMeeting } from '../actions/createTeamsMeeting';
import { getAllFormacaoComAgendamentos } from '../actions/formacao/getAllFormacaoComAgendamentos';
import { getAvaliadores } from '../actions/getAvaliadores';
import { getUsers } from '../actions/getUsers';
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
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [fileSelected, setFileSelected] = useState<File | null>(null);
  const [editingDevolutivaId, setEditingDevolutivaId] = useState<string | null>(null);
  const [selectedAgendamentoIdForUpload, setSelectedAgendamentoIdForUpload] = useState<string>("");
  
  // Renamed state for all users and added state for selected optional participants
  const [allAvailableUsers, setAllAvailableUsers] = useState<IUser[]>([]); 
  const [selectedOptionalParticipants, setSelectedOptionalParticipants] = useState<IUser[]>([]);

  const { data: session } = useSession();
  const idDoUsuarioLogado = session?.user?.id;
  const emailDoUsuarioLogado = session?.user?.email;
  const nomeDoUsuarioLogado = session?.user?.name;

  const parseFetchedFormacoes = (data: RawFormacao[]): FormacaoFrontend[] => {
    return data.map((f: RawFormacao) => ({
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
      const [formacoesData, avaliadoresData, usersData] = await Promise.all([
        getAllFormacaoComAgendamentos(),
        getAvaliadores(),
        getUsers(),
      ]);
      setFormacoes(parseFetchedFormacoes(formacoesData as RawFormacao[]));
      setAvaliadores(avaliadoresData as AvaliadorParaSelecao[]);
      setAllAvailableUsers(usersData as IUser[]); // Populate the new state for all users
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
    if (infoAgendamento.temAgendamento && infoAgendamento.agendamento) {
      setSelectedDate(new Date(infoAgendamento.agendamento.dataAgendada));
      setSelectedProfessorId(infoAgendamento.agendamento.avaliadorId);
      setEditingDevolutivaId(infoAgendamento.agendamento.id);
      // TODO: If editing, you might want to load existing optional participants here
      // For now, we reset it similar to new scheduling.
      setSelectedOptionalParticipants([]); 
    } else {
      setSelectedDate(undefined);
      setSelectedProfessorId("");
      setEditingDevolutivaId(null);
      setSelectedOptionalParticipants([]); // Reset for new schedule
    }
    setIsScheduleOpen(true);
  };

  const handleUploadDevolutiva = (workshop: WorkshopFrontend) => {
    const infoAgendamento = getAgendamentoInfoParaWorkshop(workshop);

    if (infoAgendamento.temAgendamento && infoAgendamento.agendamento) {
      setCurrentWorkshop(workshop);
      setSelectedAgendamentoIdForUpload(infoAgendamento.agendamento.id);
      setIsUploadOpen(true);
      setFileSelected(null);
    } else {
      toast.warn("Agende uma devolutiva primeiro para este workshop antes de enviar um arquivo.");
      setSelectedAgendamentoIdForUpload("");
    }
  };

  const saveSchedule = async () => {
    if (!currentWorkshop || !selectedDate || !selectedProfessorId || !idDoUsuarioLogado) {
      toast.error("Workshop, data, professor ou usuário não autenticado são inválidos.");
      return;
    }

    let operacaoBemSucedida = false;
    let devolutivaAgendadaId: string | undefined;

    try {
      if (editingDevolutivaId) {
        const devolutivaAtualizada = await updateDevolutivaAgendada({
          devolutivaAgendamentoId: editingDevolutivaId,
          dataAgendada: selectedDate,
          avaliadorId: selectedProfessorId,
        });
        devolutivaAgendadaId = devolutivaAtualizada.id;
        toast.success("Devolutiva reagendada com sucesso!");
        operacaoBemSucedida = true;
      } else {
        const novaDevolutiva = await agendarNovaDevolutiva({
          workshopId: currentWorkshop.id,
          avaliadorId: selectedProfessorId,
          dataAgendada: selectedDate,
          agendadorId: idDoUsuarioLogado,
        });
        devolutivaAgendadaId = novaDevolutiva.id;
        toast.success("Devolutiva agendada com sucesso!");
        operacaoBemSucedida = true;

        if (operacaoBemSucedida && devolutivaAgendadaId) {
          const avaliadorSelecionado = avaliadores.find(a => a.id === selectedProfessorId);

          if (!avaliadorSelecionado || !avaliadorSelecionado.email) {
            toast.warn("Email do avaliador não encontrado. Reunião do Teams não foi criada.");
          } else if (!emailDoUsuarioLogado) {
            toast.warn("Email do aluno (usuário logado) não encontrado. Reunião do Teams não foi criada.");
          } else {
            const duracaoReuniaoHoras = 1;
            const startTime = selectedDate;
            const endTime = new Date(startTime.getTime() + duracaoReuniaoHoras * 60 * 60 * 1000);

            const startTimeISO = startTime.toISOString();
            const endTimeISO = endTime.toISOString();
            const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || "America/Sao_Paulo";

            const attendees = [
              {
                emailAddress: { address: avaliadorSelecionado.email, name: avaliadorSelecionado.name || avaliadorSelecionado.email },
                type: "required" as const,
              },
              {
                emailAddress: { address: emailDoUsuarioLogado, name: nomeDoUsuarioLogado || emailDoUsuarioLogado },
                type: "required" as const,
              },
              // Add selected optional participants
              ...selectedOptionalParticipants.map(user => {
                if (!user.email) {
                  console.warn(`Participante opcional ${user.name || user.id} não possui e-mail e será ignorado.`);
                  return null; 
                }
                return {
                  emailAddress: { address: user.email, name: user.name || user.email },
                  type: "optional" as const,
                };
              }).filter(Boolean) as { emailAddress: { address: string; name: string; }; type: "optional" | "required"; }[], // Filter out nulls and assert type
            ];

            toast.info("Agendando reunião no Microsoft Teams...");
            const teamsResponse = await createTeamsMeeting({
              subject: `Devolutiva: ${currentWorkshop.nome} com ${avaliadorSelecionado.name || 'Avaliador'}`,
              startTimeISO: startTimeISO,
              endTimeISO: endTimeISO,
              attendees: attendees,
              timeZone: userTimeZone,
              bodyContent: `Esta é uma reunião de devolutiva para o workshop "${currentWorkshop.nome}", agendada através da plataforma.`,
            });

            if (teamsResponse.errorMessage) {
              toast.error(`Falha ao criar reunião no Teams: ${teamsResponse.errorMessage}`);
            } else {
              toast.success(`Reunião no Teams criada! Verifique seu calendário.`);
            }
          }
        }
      }
      setIsScheduleOpen(false);
      setEditingDevolutivaId(null);
      fetchData(); 
    } catch (error) { 
      console.error("Erro ao salvar agendamento:", error);
      toast.error("Erro ao salvar agendamento. Verifique o console para mais detalhes.");
    }
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
        workshop={currentWorkshop}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        selectedProfessorId={selectedProfessorId}
        setSelectedProfessorId={setSelectedProfessorId}
        avaliadores={avaliadores}
        onSave={saveSchedule}
        // Pass props for optional participants
        allUsersForSelection={allAvailableUsers} 
        selectedOptionalParticipants={selectedOptionalParticipants}
        onSelectedOptionalParticipantsChange={setSelectedOptionalParticipants}
      />
      <UploadDialog
        open={isUploadOpen}
        onOpenChange={setIsUploadOpen}
        workshop={currentWorkshop}
        alunoId={idDoUsuarioLogado || ""}
        isDragging={isDragging}
        devolutivaAgendamentoId={selectedAgendamentoIdForUpload}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onFileInput={handleFileInput}
        fileSelected={fileSelected}
        setFileSelected={setFileSelected}
      />
    </>
  );
};

export default Devolutivas;