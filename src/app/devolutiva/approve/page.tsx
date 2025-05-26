"use client";

import { StatusDevolutiva as PrismaStatusDevolutiva, StatusDevolutiva } from '@prisma/client'; // Importa o enum do Prisma
import React, { useEffect, useMemo,useState } from 'react';
import { toast } from 'react-toastify';

import { avaliarDevolutivaAction } from '@/app/actions/avaliar-devolutiva';
import { getDevolutivasParaAvaliacaoAction } from '@/app/actions/get-devolutivas';
import { DevolutivasPageHeader } from '@/components/devolutivas/approveheader';
import { AprovarDevolutivaDialog } from '@/components/devolutivas/aprovardevolutiva';
import { DevolutivasTable } from '@/components/devolutivas/devolutivatable';
import { DevolverDevolutivaDialog } from '@/components/devolutivas/devolverdevolutiva';
import { ReprovarDevolutivaDialog } from '@/components/devolutivas/reprovardevolutiva';
import { StatusFiltersCard } from '@/components/devolutivas/statusfiltercard';
import { DevolutivaParaAvaliacao } from '@/components/devolutivas/types';


const AprovacaoDevolutivasPage: React.FC = () => {
  const [devolutivas, setDevolutivas] = useState<DevolutivaParaAvaliacao[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingAction, setIsLoadingAction] = useState(false); // Para feedback nas ações dos dialogs

  const [selectedDevolutiva, setSelectedDevolutiva] = useState<DevolutivaParaAvaliacao | null>(null);
  const [isApproving, setIsApproving] = useState(false);
  const [isReturning, setIsReturning] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  
  const [comentario, setComentario] = useState('');
  const [nota, setNota] = useState<string>('');
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<StatusDevolutiva | 'Todas'>('Todas');

  const carregarDevolutivas = async () => {
    setIsLoading(true);
    const result = await getDevolutivasParaAvaliacaoAction();
    if (result.success && result.data) {
      setDevolutivas(result.data);
    } else {
      toast.error(result.error || "Falha ao carregar devolutivas.");
      setDevolutivas([]);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    carregarDevolutivas();
  }, []);

  const filteredDevolutivas = useMemo(() => {
    return devolutivas.filter(devolutiva => {
      const matchesSearch = 
        devolutiva.alunoNome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        devolutiva.workshopNome.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = filterStatus === 'Todas' || devolutiva.status === filterStatus;
      
      return matchesSearch && matchesStatus;
    });
  }, [devolutivas, searchTerm, filterStatus]);

  const closeAllDialogs = () => {
    setIsApproving(false);
    setIsReturning(false);
    setIsRejecting(false);
    setSelectedDevolutiva(null);
    setComentario('');
    setNota('');
  };

  const handleAprovarClick = (devolutiva: DevolutivaParaAvaliacao) => {
    setSelectedDevolutiva(devolutiva);
    setNota('10.0');
    setComentario('');
    setIsApproving(true);
  };

  const handleDevolverClick = (devolutiva: DevolutivaParaAvaliacao) => {
    setSelectedDevolutiva(devolutiva);
    setNota('');
    setComentario('');
    setIsReturning(true);
  };

  const handleReprovarClick = (devolutiva: DevolutivaParaAvaliacao) => {
    setSelectedDevolutiva(devolutiva);
    setNota('0.0');
    setComentario('');
    setIsRejecting(true);
  };

  const handleConfirmApprove = async () => {
    if (!selectedDevolutiva) return;
    
    setIsLoadingAction(true);
    const result = await avaliarDevolutivaAction({
      devolutivaId: selectedDevolutiva.devolutivaId,
      novoStatus: PrismaStatusDevolutiva.Aprovado,
      nota: parseFloat(nota),
      comentario: comentario,
    });
    setIsLoadingAction(false);

    if (result.success) {
      toast.success(`Devolutiva de ${selectedDevolutiva.alunoNome} aprovada com sucesso!`);
      await carregarDevolutivas();
      closeAllDialogs();
    } else {
      toast.error(result.error || "Falha ao aprovar devolutiva.");
    }
  };

  const handleConfirmReturn = async () => {
    if (!selectedDevolutiva || !comentario.trim()) {
      toast.error('Por favor, forneça um comentário sobre o motivo da devolução.');
      return;
    }
    
    setIsLoadingAction(true);
    const result = await avaliarDevolutivaAction({
      devolutivaId: selectedDevolutiva.devolutivaId,
      novoStatus: PrismaStatusDevolutiva.Revisão,
      nota: nota ? parseFloat(nota) : 0,
      comentario: comentario,
    });
    setIsLoadingAction(false);

    if (result.success) {
      toast.info(`Devolutiva de ${selectedDevolutiva.alunoNome} devolvida para revisão!`);
      await carregarDevolutivas();
      closeAllDialogs();
    } else {
      toast.error(result.error || "Falha ao devolver devolutiva para revisão.");
    }
  };

  const handleConfirmReject = async () => {
    if (!selectedDevolutiva || !comentario.trim()) {
      toast.error('Por favor, forneça um comentário sobre o motivo da reprovação.');
      return;
    }

    // Garanta que PrismaStatusDevolutiva.Reprovado exista no seu enum!
    if (!(PrismaStatusDevolutiva.Reprovado)) {
        toast.error("Configuração de status 'Reprovado' ausente no sistema.");
        console.error("Enum PrismaStatusDevolutiva não contém 'Reprovado'. Verifique seu schema.prisma e rode 'npx prisma generate'.");
        return;
    }
    
    setIsLoadingAction(true);
    const result = await avaliarDevolutivaAction({
      devolutivaId: selectedDevolutiva.devolutivaId,
      novoStatus: PrismaStatusDevolutiva.Reprovado,
      nota: nota ? parseFloat(nota) : 0,
      comentario: comentario,
    });
    setIsLoadingAction(false);

    if (result.success) {
      toast.error(`Devolutiva de ${selectedDevolutiva.alunoNome} reprovada!`);
      await carregarDevolutivas();
      closeAllDialogs();
    } else {
      toast.error(result.error || "Falha ao reprovar devolutiva.");
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6 flex justify-center items-center min-h-screen">
        <p className="text-xl">Carregando devolutivas...</p>
        {/* Poderia adicionar um componente de Spinner aqui */}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <DevolutivasPageHeader 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      <StatusFiltersCard 
        currentFilter={filterStatus}
        onFilterChange={setFilterStatus}
      />

      <DevolutivasTable
        devolutivas={filteredDevolutivas}
        onAprovar={handleAprovarClick}
        onDevolver={handleDevolverClick}
        onReprovar={handleReprovarClick}
      />

      {selectedDevolutiva && (
        <>
          <AprovarDevolutivaDialog
            isOpen={isApproving}
            onOpenChange={(open) => { if (!open) closeAllDialogs(); else setIsApproving(true);}}
            devolutiva={selectedDevolutiva}
            nota={nota}
            setNota={setNota}
            comentario={comentario}
            setComentario={setComentario}
            onConfirm={handleConfirmApprove}
            isLoading={isLoadingAction}
          />

          <DevolverDevolutivaDialog
            isOpen={isReturning}
            onOpenChange={(open) => { if (!open) closeAllDialogs(); else setIsReturning(true);}}
            devolutiva={selectedDevolutiva}
            nota={nota}
            setNota={setNota}
            comentario={comentario}
            setComentario={setComentario}
            onConfirm={handleConfirmReturn}
            isLoading={isLoadingAction}
          />

          <ReprovarDevolutivaDialog
            isOpen={isRejecting}
            onOpenChange={(open) => { if (!open) closeAllDialogs(); else setIsRejecting(true);}}
            devolutiva={selectedDevolutiva}
            nota={nota}
            setNota={setNota}
            comentario={comentario}
            setComentario={setComentario}
            onConfirm={handleConfirmReject}
            isLoading={isLoadingAction}
          />
        </>
      )}
    </div>
  );
};

export default AprovacaoDevolutivasPage;