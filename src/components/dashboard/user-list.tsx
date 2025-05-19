import Image from 'next/image';
import { useMemo, useState } from 'react';

import { FilterBar } from "../filterbar";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

interface IUser {
  id: string;
  name?: string | null;
  email: string;
  image?: string | null;
}

interface UserListProps {
  users: IUser[];
  onSelect: (user: IUser) => void;
  selectedUserId?: string;
}

const UserList = ({ users, onSelect, selectedUserId }: UserListProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredUsers = useMemo(() => {
    return users.filter((user) =>
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

  
  return ( 
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Usuários</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
        <FilterBar
            searchValue={searchTerm}
            onSearchChange={setSearchTerm}
            searchPlaceholder="Buscar usuários..."
          />
        </div>

        <div className="space-y-2 mt-4">
          {filteredUsers.map((user) => (
            <div
              key={user.id}
              className={`flex items-center p-3 rounded-md cursor-pointer transition-colors ${
                selectedUserId === user.id
                  ? "bg-pink-50 dark:bg-pink-900/20 border border-rosa-500"
                  : "hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
              onClick={() => onSelect(user)}
            >
              <Image 
                src={user.image || "/placeholder.png"} // ou use Avatar do Radix se quiser manter
                alt={user.name || user.email} 
                className="w-10 h-10 rounded-full mr-3"
                width={40}
                height={40}
              />
              <div>
                <p className="font-medium">{user.name || "Sem nome"}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default UserList;
