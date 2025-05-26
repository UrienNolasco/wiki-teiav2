import { StatusDevolutiva } from '@prisma/client';
import React from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';



interface StatusFiltersCardProps {
  currentFilter: StatusDevolutiva | 'Todas';
  onFilterChange: (status: StatusDevolutiva | 'Todas') => void;
}

const statuses: (StatusDevolutiva | 'Todas')[] = ['Todas', 'Aguardando'];
const statusLabels: Record<StatusDevolutiva | 'Todas', string> = {
  'Todas': 'Todas',
  'Enviado': 'Enviada',
  'Reprovado': 'Reprovadas', 
  'Aguardando': 'Aguardando',
  'Aprovado': 'Aprovadas', 
  'Revisão': 'Em Revisão', 
}


export const StatusFiltersCard: React.FC<StatusFiltersCardProps> = ({ currentFilter, onFilterChange }) => {
  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <CardTitle>Filtros</CardTitle>
        <CardDescription>Filtre as devolutivas por status</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {statuses.map(status => (
            <Button 
              key={status}
              variant={currentFilter === status ? 'default' : 'outline'} 
              onClick={() => onFilterChange(status)}
            >
              {statusLabels[status]}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};