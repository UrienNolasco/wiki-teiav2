import React from 'react';

import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';

import { DevolutivaParaAvaliacao } from './types';



interface ReprovarDevolutivaDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  devolutiva: DevolutivaParaAvaliacao | null;
  nota: string;
  setNota: (nota: string) => void;
  comentario: string;
  setComentario: (comentario: string) => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

export const ReprovarDevolutivaDialog: React.FC<ReprovarDevolutivaDialogProps> = ({
  isOpen,
  onOpenChange,
  devolutiva,
  nota,
  setNota,
  comentario,
  setComentario,
  onConfirm,
  isLoading,
}) => {
  if (!devolutiva) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reprovar Devolutiva</DialogTitle>
          <DialogDescription>
            Você está reprovando a devolutiva de {devolutiva.alunoNome}.
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
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>Cancelar</Button>
          <Button 
            onClick={onConfirm}
            className="bg-green-600 hover:bg-green-700"
            disabled={isLoading} // Desabilita durante o carregamento
          >
            {isLoading ? "Reprovando..." : "Confirmar Reprovação"}	
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};