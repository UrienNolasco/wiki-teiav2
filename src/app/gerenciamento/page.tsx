"use client";

import { TipoUsuario } from "@prisma/client";
import { Check, Search, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { getUsers } from "../actions/getUsers";
import { updateCategory } from "../actions/updatecategory";

// Interface atualizada com tipo de usuário
interface IUser {
  id: string;
  name?: string | null;
  email: string;
  image?: string | null;
  tipo: TipoUsuario | null;
  
}

const Gerenciamento: React.FC = () => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | TipoUsuario>("all");
  const [userRoles, setUserRoles] = useState<Record<string, TipoUsuario>>({});
  const [roleChanged, setRoleChanged] = useState<Record<string, boolean>>({});
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getUsers();
  
        setUsers(data); 
  
        const initial: Record<string, TipoUsuario> = {};
        data.forEach((u) => {
          if (u.tipo !== null) {
            initial[u.id] = u.tipo;
          }
        });
        setUserRoles(initial);
      } catch (err) {
        console.error(err);
        toast.error("Erro ao buscar usuários");
      }
    };
    fetchUsers();
  }, []);
  

  const handleRoleChange = (userId: string, role: TipoUsuario) => {
    setUserRoles((prev) => ({ ...prev, [userId]: role }));
    setRoleChanged((prev) => ({ ...prev, [userId]: true }));
  };

  const saveChanges = async (userId: string) => {
    try {
      await updateCategory({ userId, category: userRoles[userId] });
      toast.success("Função atualizada com sucesso!");
      setRoleChanged((prev) => ({ ...prev, [userId]: false }));
    } catch (err) {
      console.error(err);
      toast.error("Erro ao atualizar função");
    }
  };

  const cancelChanges = (userId: string) => {
    const original = users.find((u) => u.id === userId)?.tipo;
    if (original) {
      setUserRoles((prev) => ({ ...prev, [userId]: original }));
    }
    setRoleChanged((prev) => ({ ...prev, [userId]: false }));
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole =
      roleFilter === "all" || userRoles[user.id] === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="container mx-auto animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Gerenciamento de Funções</h1>
        <p className="text-muted-foreground">
          Configure as funções dos usuários na plataforma
        </p>
      </div>

      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar usuários..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select
              onValueChange={(v: "all" | TipoUsuario) =>
                setRoleFilter(v)
              }
              value={roleFilter}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrar por função" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as funções</SelectItem>
                {Object.values(TipoUsuario).map((role) => (
                  <SelectItem key={role} value={role}>
                    {role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px]">Usuário</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Função</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <TableRow
                  key={user.id}
                  className={
                    selectedUser === user.id
                      ? "bg-purple-50 dark:bg-purple-900/20"
                      : ""
                  }
                >
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Select
                      value={userRoles[user.id]}
                      onValueChange={(role: TipoUsuario) =>
                        handleRoleChange(user.id, role)
                      }
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(TipoUsuario).map((role) => (
                          <SelectItem key={role} value={role}>
                            {role}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-right">
                    {roleChanged[user.id] ? (
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex items-center"
                          onClick={() => saveChanges(user.id)}
                        >
                          <Check className="h-4 w-4 mr-1 text-green-600" />
                          Salvar
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex items-center"
                          onClick={() => cancelChanges(user.id)}
                        >
                          <X className="h-4 w-4 mr-1 text-red-600" />
                          Cancelar
                        </Button>
                      </div>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          setSelectedUser(
                            selectedUser === user.id ? null : user.id
                          )
                        }
                      >
                        {selectedUser === user.id ? "Fechar" : "Editar"}
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8">
                  Nenhum usuário encontrado com os filtros atuais.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Gerenciamento;
