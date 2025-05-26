import { TipoDevolutiva } from '@prisma/client';
import { FileSpreadsheet, FileText, FileVideo } from 'lucide-react';
import React from 'react';



interface TipoDevolutivaIconProps {
  tipo: TipoDevolutiva;
}

export const TipoDevolutivaIcon: React.FC<TipoDevolutivaIconProps> = ({ tipo }) => {
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