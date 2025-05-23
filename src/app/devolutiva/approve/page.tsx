"use client"

import { format } from 'date-fns';
import { AlertCircle, CheckCircle, ExternalLink, FileSpreadsheet,FileText, FileVideo, XCircle } from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'react-toastify';

import { FilterBar } from '@/components/filterbar';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';

// Tipos baseados no schema Prisma
type TipoUsuario = 'Aluno' | 'Avaliador' | 'Administrador' | 'Instrutor';
type TipoDevolutiva = 'PDF' | 'PPTX' | 'VIDEO';
type StatusDevolutiva = 'Enviado' | 'Aguardando' | 'Aprovado' | 'Revisão' | 'Reprovado';

interface User {
  id: string;
  name: string | null;
  email: string;
  tipo: TipoUsuario | null;
}

interface Workshop {
  id: string;
  nome: string;
}

interface DevolutivaAgendamento {
  id: string;
  workshopId: string;
  avaliadorId: string;
  dataAgendada: Date;
  workshop: Workshop;
}

interface Devolutiva {
  id: string;
  workshopId: string;
  alunoId: string;
  tipo: TipoDevolutiva;
  arquivo_url: string;
  status: StatusDevolutiva;
  duracao_video?: number;
  workshop: Workshop;
  aluno: User;
}

// Interface para os dados combinados que serão exibidos na tabela
interface DevolutivaParaAvaliacao {
  id: string;
  workshopId: string;
  alunoId: string;
  alunoNome: string;
  workshopNome: string;
  tipo: TipoDevolutiva;
  arquivo_url: string;
  status: StatusDevolutiva;
  dataAgendada: Date;
  devolutivaId: string;
}

// Componente para mostrar o ícone correto baseado no tipo de arquivo
const TipoDevolutivaIcon: React.FC<{ tipo: TipoDevolutiva }> = ({ tipo }) => {
  switch (tipo) {
    case 'PDF':
      return <FileText className="h-4 w-4 text-red-500" />;
    case 'PPTX':
      return <FileSpreadsheet className="h-4 w-4 text-blue-500" />;
    case 'VIDEO':
      return <FileVideo className="h-4 w-4 text-green-500" />;
    default:
      return <FileText className="h-4 w-4" />;
  }
};

// Mock data para simular dados do backend
const mockCurrentUser: User = {
  id: 'avaliador-1',
  name: 'Carlos Avaliador',
  email: 'carlos@exemplo.com',
  tipo: 'Avaliador'
};

const mockAgendamentos: DevolutivaAgendamento[] = [
  {
    id: 'agenda-1',
    workshopId: 'workshop-1',
    avaliadorId: 'avaliador-1',
    dataAgendada: new Date('2025-05-25T10:00:00'),
    workshop: { id: 'workshop-1', nome: 'Workshop React Básico' }
  },
  {
    id: 'agenda-2',
    workshopId: 'workshop-2',
    avaliadorId: 'avaliador-1',
    dataAgendada: new Date('2025-05-26T14:00:00'),
    workshop: { id: 'workshop-2', nome: 'Workshop React Avançado' }
  },
  {
    id: 'agenda-3',
    workshopId: 'workshop-3',
    avaliadorId: 'avaliador-1',
    dataAgendada: new Date('2025-05-27T09:00:00'),
    workshop: { id: 'workshop-3', nome: 'Workshop TypeScript' }
  }
];

const mockDevolutivas: Devolutiva[] = [
  {
    id: 'dev-1',
    workshopId: 'workshop-1',
    alunoId: 'aluno-1',
    tipo: 'PDF',
    arquivo_url: 'https://exemplo.com/devolutiva1.pdf',
    status: 'Enviado',
    workshop: { id: 'workshop-1', nome: 'Workshop React Básico' },
    aluno: { id: 'aluno-1', name: 'João Silva', email: 'joao@exemplo.com', tipo: 'Aluno' }
  },
  {
    id: 'dev-2',
    workshopId: 'workshop-2',
    alunoId: 'aluno-2',
    tipo: 'VIDEO',
    arquivo_url: 'https://exemplo.com/devolutiva2.mp4',
    status: 'Enviado',
    duracao_video: 300, // 5 minutos
    workshop: { id: 'workshop-2', nome: 'Workshop React Avançado' },
    aluno: { id: 'aluno-2', name: 'Maria Oliveira', email: 'maria@exemplo.com', tipo: 'Aluno' }
  },
  {
    id: 'dev-3',
    workshopId: 'workshop-1',
    alunoId: 'aluno-3',
    tipo: 'PPTX',
    arquivo_url: 'https://exemplo.com/devolutiva3.pptx',
    status: 'Aguardando',
    workshop: { id: 'workshop-1', nome: 'Workshop React Básico' },
    aluno: { id: 'aluno-3', name: 'Pedro Santos', email: 'pedro@exemplo.com', tipo: 'Aluno' }
  },
  {
    id: 'dev-4',
    workshopId: 'workshop-3',
    alunoId: 'aluno-4',
    tipo: 'PDF',
    arquivo_url: 'https://exemplo.com/devolutiva4.pdf',
    status: 'Enviado',
    workshop: { id: 'workshop-3', nome: 'Workshop TypeScript' },
    aluno: { id: 'aluno-4', name: 'Ana Souza', email: 'ana@exemplo.com', tipo: 'Aluno' }
  }
];

const AprovacaoDevolutivas: React.FC = () => {
  const [selectedDevolutiva, setSelectedDevolutiva] = useState<DevolutivaParaAvaliacao | null>(null);
  const [isApproving, setIsApproving] = useState(false);
  const [isReturning, setIsReturning] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [comentario, setComentario] = useState('');
  const [nota, setNota] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<StatusDevolutiva | 'Todas'>('Todas');

  // Função para combinar os dados de agendamentos e devolutivas
  const getDevolutivasParaAvaliacao = (): DevolutivaParaAvaliacao[] => {
    const result: DevolutivaParaAvaliacao[] = [];
    
    // Filtrar agendamentos do avaliador atual
    const agendamentosDoAvaliador = mockAgendamentos.filter(
      agendamento => agendamento.avaliadorId === mockCurrentUser.id
    );
    
    // Para cada agendamento, buscar devolutivas relacionadas com status "Enviado" ou "Aguardando"
    agendamentosDoAvaliador.forEach(agendamento => {
      const devolutivasDoWorkshop = mockDevolutivas.filter(
        devolutiva => 
          devolutiva.workshopId === agendamento.workshopId && 
          (devolutiva.status === 'Enviado' || devolutiva.status === 'Aguardando')
      );
      
      // Transformar as devolutivas no formato para exibição
      devolutivasDoWorkshop.forEach(devolutiva => {
        result.push({
          id: `${agendamento.id}-${devolutiva.id}`,
          workshopId: devolutiva.workshopId,
          alunoId: devolutiva.alunoId,
          alunoNome: devolutiva.aluno.name || 'Nome não disponível',
          workshopNome: devolutiva.workshop.nome,
          tipo: devolutiva.tipo,
          arquivo_url: devolutiva.arquivo_url,
          status: devolutiva.status,
          dataAgendada: agendamento.dataAgendada,
          devolutivaId: devolutiva.id
        });
      });
    });
    
    return result;
  };

  const devolutivasParaAvaliacao = getDevolutivasParaAvaliacao();

  // Filtragem por termo de busca e status
  const filteredDevolutivas = devolutivasParaAvaliacao.filter(devolutiva => {
    const matchesSearch = 
      devolutiva.alunoNome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      devolutiva.workshopNome.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'Todas' || devolutiva.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

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

  const handleConfirmApprove = () => {
    if (!selectedDevolutiva) return;
    
    // Simula a chamada API para aprovar a devolutiva
    console.log('Aprovando devolutiva:', {
      devolutivaId: selectedDevolutiva.devolutivaId,
      avaliadorId: mockCurrentUser.id,
      nota: parseFloat(nota),
      comentario
    });
    
    // Em uma implementação real, aqui seria feita uma chamada API para atualizar o status da devolutiva e criar uma avaliação
    
    toast.success(`Devolutiva de ${selectedDevolutiva.alunoNome} aprovada com sucesso!`);
    setIsApproving(false);
    setSelectedDevolutiva(null);
  };

  const handleConfirmReturn = () => {
    if (!selectedDevolutiva || !comentario.trim()) {
      toast.error('Por favor, forneça um comentário sobre o motivo da devolução.');
      return;
    }
    
    // Simula a chamada API para devolver a devolutiva para revisão
    console.log('Devolvendo devolutiva para revisão:', {
      devolutivaId: selectedDevolutiva.devolutivaId,
      avaliadorId: mockCurrentUser.id,
      nota: nota ? parseFloat(nota) : 0,
      comentario
    });
    
    // Em uma implementação real, aqui seria feita uma chamada API para atualizar o status da devolutiva para Revisão e criar uma avaliação
    
    toast.success(`Devolutiva de ${selectedDevolutiva.alunoNome} devolvida para revisão!`);
    setIsReturning(false);
    setSelectedDevolutiva(null);
  };

  const handleConfirmReject = () => {
    if (!selectedDevolutiva || !comentario.trim()) {
      toast.error('Por favor, forneça um comentário sobre o motivo da reprovação.');
      return;
    }
    
    // Simula a chamada API para reprovar a devolutiva
    console.log('Reprovando devolutiva:', {
      devolutivaId: selectedDevolutiva.devolutivaId,
      avaliadorId: mockCurrentUser.id,
      nota: nota ? parseFloat(nota) : 0,
      comentario
    });
    
    // Em uma implementação real, aqui seria feita uma chamada API para atualizar o status da devolutiva para Reprovado e criar uma avaliação
    
    toast.success(`Devolutiva de ${selectedDevolutiva.alunoNome} reprovada!`);
    setIsRejecting(false);
    setSelectedDevolutiva(null);
  };

  const closeAllDialogs = () => {
    setIsApproving(false);
    setIsReturning(false);
    setIsRejecting(false);
    setSelectedDevolutiva(null);
    setComentario('');
    setNota('');
  };

  return (
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <h1 className="text-2xl font-bold mb-4 md:mb-0">Aprovação de Devolutivas</h1>
          <div className="w-full md:w-64">
            <FilterBar 
              searchValue={searchTerm} 
              onSearchChange={(value: string) => setSearchTerm(value)} 
              searchPlaceholder="Buscar por aluno ou workshop..." 
            />
          </div>
        </div>

        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle>Filtros</CardTitle>
            <CardDescription>Filtre as devolutivas por status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Button 
                variant={filterStatus === 'Todas' ? 'default' : 'outline'} 
                onClick={() => setFilterStatus('Todas')}
              >
                Todas
              </Button>
              <Button 
                variant={filterStatus === 'Enviado' ? 'default' : 'outline'} 
                onClick={() => setFilterStatus('Enviado')}
              >
                Enviadas
              </Button>
              <Button 
                variant={filterStatus === 'Aguardando' ? 'default' : 'outline'} 
                onClick={() => setFilterStatus('Aguardando')}
              >
                Aguardando
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Devolutivas Pendentes</CardTitle>
            <CardDescription>
              Lista de devolutivas agendadas para sua avaliação
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredDevolutivas.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-muted-foreground">Nenhuma devolutiva pendente para avaliação.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Aluno</TableHead>
                      <TableHead>Workshop</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Data Agendada</TableHead>
                      <TableHead className="text-left">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDevolutivas.map((devolutiva) => (
                      <TableRow key={devolutiva.id}>
                        <TableCell className="font-medium">{devolutiva.alunoNome}</TableCell>
                        <TableCell>{devolutiva.workshopNome}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <TipoDevolutivaIcon tipo={devolutiva.tipo} />
                            <span>{devolutiva.tipo}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            {devolutiva.status === 'Enviado' && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                Enviado
                              </span>
                            )}
                            {devolutiva.status === 'Aguardando' && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                Aguardando
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{format(devolutiva.dataAgendada, 'dd/MM/yyyy HH:mm')}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => window.open(devolutiva.arquivo_url, '_blank')}
                            >
                              <ExternalLink className="h-4 w-4 mr-1" /> 
                              Ver
                            </Button>
                            <Button
                              size="sm"
                              variant="default"
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() => handleAprovarClick(devolutiva)}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Aprovar
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-yellow-500 text-yellow-600 hover:bg-yellow-50"
                              onClick={() => handleDevolverClick(devolutiva)}
                            >
                              <AlertCircle className="h-4 w-4 mr-1" />
                              Devolver
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-red-500 text-red-600 hover:bg-red-50"
                              onClick={() => handleReprovarClick(devolutiva)}
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Reprovar
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between border-t pt-4">
            <div className="text-sm text-muted-foreground">
              Total de devolutivas pendentes: {filteredDevolutivas.length}
            </div>
          </CardFooter>
        </Card>

        {/* Dialog para Aprovar Devolutiva */}
        <Dialog open={isApproving} onOpenChange={() => closeAllDialogs()}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Aprovar Devolutiva</DialogTitle>
              <DialogDescription>
                Você está aprovando a devolutiva de {selectedDevolutiva?.alunoNome} para o workshop {selectedDevolutiva?.workshopNome}.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="nota" className="text-right">
                  Nota:
                </label>
                <input
                  id="nota"
                  type="number"
                  step="0.1"
                  min="0"
                  max="10"
                  value={nota}
                  onChange={(e) => setNota(e.target.value)}
                  className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="comentario" className="text-right">
                  Comentário:
                </label>
                <Textarea
                  id="comentario"
                  placeholder="Comentário opcional"
                  value={comentario}
                  onChange={(e) => setComentario(e.target.value)}
                  className="col-span-3"
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={closeAllDialogs}>Cancelar</Button>
              <Button 
                onClick={handleConfirmApprove}
                className="bg-green-600 hover:bg-green-700"
              >
                Confirmar Aprovação
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialog para Devolver Devolutiva */}
        <Dialog open={isReturning} onOpenChange={() => closeAllDialogs()}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Devolver para Revisão</DialogTitle>
              <DialogDescription>
                Você está devolvendo a devolutiva de {selectedDevolutiva?.alunoNome} para revisão.
                Por favor, forneça um feedback detalhado sobre o que precisa ser melhorado.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="nota-devolucao" className="text-right">
                  Nota:
                </label>
                <input
                  id="nota-devolucao"
                  type="number"
                  step="0.1"
                  min="0"
                  max="10"
                  value={nota}
                  onChange={(e) => setNota(e.target.value)}
                  className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="comentario-devolucao" className="text-right">
                  Feedback: *
                </label>
                <Textarea
                  id="comentario-devolucao"
                  placeholder="Explique o que precisa ser melhorado"
                  value={comentario}
                  onChange={(e) => setComentario(e.target.value)}
                  className="col-span-3"
                  required
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={closeAllDialogs}>Cancelar</Button>
              <Button 
                onClick={handleConfirmReturn}
                className="bg-yellow-600 hover:bg-yellow-700"
                disabled={!comentario.trim()}
              >
                Devolver para Revisão
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialog para Reprovar Devolutiva */}
        <Dialog open={isRejecting} onOpenChange={() => closeAllDialogs()}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Reprovar Devolutiva</DialogTitle>
              <DialogDescription>
                Você está reprovando a devolutiva de {selectedDevolutiva?.alunoNome}.
                Por favor, forneça o motivo da reprovação.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="nota-reprovacao" className="text-right">
                  Nota:
                </label>
                <input
                  id="nota-reprovacao"
                  type="number"
                  step="0.1"
                  min="0"
                  max="10"
                  value={nota}
                  onChange={(e) => setNota(e.target.value)}
                  className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="comentario-reprovacao" className="text-right">
                  Justificativa: *
                </label>
                <Textarea
                  id="comentario-reprovacao"
                  placeholder="Explique o motivo da reprovação"
                  value={comentario}
                  onChange={(e) => setComentario(e.target.value)}
                  className="col-span-3"
                  required
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={closeAllDialogs}>Cancelar</Button>
              <Button 
                variant="destructive"
                onClick={handleConfirmReject}
                disabled={!comentario.trim()}
              >
                Confirmar Reprovação
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
  );
};

export default AprovacaoDevolutivas;
