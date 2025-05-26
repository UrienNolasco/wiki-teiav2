import React from 'react';

import { FilterBar } from '@/components/filterbar'; 

interface DevolutivasPageHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export const DevolutivasPageHeader: React.FC<DevolutivasPageHeaderProps> = ({ searchTerm, onSearchChange }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
      <h1 className="text-2xl font-bold mb-4 md:mb-0">Aprovação de Devolutivas</h1>
      <div className="w-full md:w-64">
        <FilterBar 
          searchValue={searchTerm} 
          onSearchChange={onSearchChange} 
          searchPlaceholder="Buscar por aluno ou workshop..." 
        />
      </div>
    </div>
  );
};