import { format } from 'date-fns';
import { AlertCircle, CheckCircle, ExternalLink } from 'lucide-react';
import React from 'react';

import { Button } from '@/components/ui/button';
import { TableCell, TableRow } from '@/components/ui/table';

import { TipoDevolutivaIcon } from './tipodevolutivaicon';
import { DevolutivaParaAvaliacao } from './types';

interface DevolutivaTableRowProps {
  devolutiva: DevolutivaParaAvaliacao;
  onAprovar: (devolutiva: DevolutivaParaAvaliacao) => void;
  onDevolver: (devolutiva: DevolutivaParaAvaliacao) => void;
}

export const DevolutivaTableRow: React.FC<DevolutivaTableRowProps> = ({
  devolutiva,
  onAprovar,
  onDevolver,
}) => {
  return (
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
          {devolutiva.status === 'Aprovado' && (
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
            onClick={() => onAprovar(devolutiva)}
          >
            <CheckCircle className="h-4 w-4 mr-1" />
            Aprovar
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="border-yellow-500 text-yellow-600 hover:bg-yellow-50"
            onClick={() => onDevolver(devolutiva)}
          >
            <AlertCircle className="h-4 w-4 mr-1" />
            Devolver
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};