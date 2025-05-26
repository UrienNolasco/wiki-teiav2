import React from 'react';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';

import { DevolutivaTableRow } from './devolutivatablerow';
import { DevolutivaParaAvaliacao } from './types';




interface DevolutivasTableProps {
  devolutivas: DevolutivaParaAvaliacao[];
  onAprovar: (devolutiva: DevolutivaParaAvaliacao) => void;
  onDevolver: (devolutiva: DevolutivaParaAvaliacao) => void;
  onReprovar: (devolutiva: DevolutivaParaAvaliacao) => void;
}

export const DevolutivasTable: React.FC<DevolutivasTableProps> = ({
  devolutivas,
  onAprovar,
  onDevolver,
  onReprovar,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Devolutivas Pendentes</CardTitle>
        <CardDescription>
          Lista de devolutivas agendadas para sua avaliação
        </CardDescription>
      </CardHeader>
      <CardContent>
        {devolutivas.length === 0 ? (
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
                {devolutivas.map((devolutiva) => (
                  <DevolutivaTableRow
                    key={devolutiva.id}
                    devolutiva={devolutiva}
                    onAprovar={onAprovar}
                    onDevolver={onDevolver}
                    onReprovar={onReprovar}
                  />
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4">
        <div className="text-sm text-muted-foreground">
          Total de devolutivas pendentes: {devolutivas.length}
        </div>
      </CardFooter>
    </Card>
  );
};