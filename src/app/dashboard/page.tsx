"use client"

import React, { useEffect, useState } from 'react';

import CapacitacaoSelector from '@/components/dashboard/capacitacao-list';
import WorkshopProgressTable from '@/components/dashboard/progress-table';
import UserList from '@/components/dashboard/user-list';
import { 
  Card, 
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";

import { getCapacitacao } from '../actions/getCapacitacao';
import { getProgressoCapacitacao } from '../actions/getprogressocapacitacao';
import { getUsers } from '../actions/getUsers';

interface ProgressoCapacitacao {
  totalWorkshops: number;
  concluidos: number;
  progresso: number;
  workshops: Array<{
    id: string;
    nome: string;
    startedAt: Date | null;
    done: boolean;
    doneAt: Date | null;
    truedone: boolean;
    truedoneAt: Date | null;
  }>;
}

interface IUser {
  id: string;
  name?: string | null;
  email: string;
  image?: string | null;
}

interface ICapacitacao {
  id: string;
  nome: string;
  link_video: string | null;
  formacaoId: string;
  done: boolean;
}

const Progresso = () => {
  const [filterStatus] = useState<string | null>(null);
  const [sortBy] = useState<string | null>(null);

  const [selectedCapacitacao, setSelectedCapacitacao] = useState<string>("");
  const [progressoUsuario, setProgressoUsuario] =
    useState<ProgressoCapacitacao | null>(null);
  const [users, setUsers] = useState<IUser[]>([]);
  const [capacitacao, setCapacitacao] = useState<ICapacitacao[]>([]);
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);

  const handleUserSelect = (user: IUser) => {
    setSelectedUser(user);
  };

  const handleBuscarProgresso = async () => {
    if (selectedUser && selectedCapacitacao) {
      try {
        const progresso = await getProgressoCapacitacao({
          userId: selectedUser.id,
          nomeCapacitacao: selectedCapacitacao,
        });
        setProgressoUsuario(progresso);

      } catch (error) {
        console.error("Erro ao buscar progresso:", error);
      }
    }
    console.log("Selected User:", selectedUser);
    console.log("Selected Capacitacao:", selectedCapacitacao);
    console.log("Progresso do usuário:", progressoUsuario);
  };

  useEffect(() => {
    const fetchUsers = async () => {
      const data = await getUsers();
      setUsers(data);
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchCapacitacao = async () => {
      const capacitacao = await getCapacitacao();
      setCapacitacao(capacitacao);
    };
    fetchCapacitacao();
  }, []);


  
  return (
      <div className="container mx-auto animate-fade-in">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Dashboard de Progresso</h1>
          <p className="text-muted-foreground">Acompanhe o progresso dos usuários nas capacitações</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Lado Esquerdo - Seleção de Usuários e Capacitações */}
          <div className="lg:w-1/3 space-y-6">
          <UserList onSelect={handleUserSelect} users={users} selectedUserId={selectedUser?.id} />

            {/* Busca Capacitação */}
            <CapacitacaoSelector
  capacitacoes={capacitacao}
  selectedCapacitacaoId={selectedCapacitacao}
  onSelect={setSelectedCapacitacao}
  onBuscar={handleBuscarProgresso}
/>
          </div>

          {/* Lado Direito - Tabela de Progresso */}
          <div className="lg:w-2/3">
  <Card>
    <CardHeader className="flex items-center justify-between">
      <CardTitle className="text-lg">Progresso dos Workshops</CardTitle>
      {/* filtros e botões como antes */}
    </CardHeader>
    <CardContent>
  {progressoUsuario ? (
    <WorkshopProgressTable
      workshops={progressoUsuario.workshops}
      filterStatus={filterStatus}
      sortBy={sortBy}
    />


  ) : (
    <p className="text-muted-foreground">Selecione um usuário e uma capacitação para ver o progresso.</p>
  )}

    </CardContent>
  </Card>
</div>
        </div>
      </div>
  );
};

export default Progresso;
