import { Search } from "lucide-react";
import Image from 'next/image';

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";

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
  return ( 
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Usuários</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input placeholder="Buscar usuários..." className="pl-10" />
        </div>

        <div className="space-y-2 mt-4">
          {users.map((user) => (
            <div 
              key={user.id}
              className={`flex items-center p-3 rounded-md cursor-pointer transition-colors ${
                selectedUserId === user.id 
                  ? 'bg-pink-50 dark:bg-pink-900/20 border border-rosa-500' 
                  : 'hover:bg-gray-100 dark:hover:bg-gray-800'
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
