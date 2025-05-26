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



interface AprovarDevolutivaDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  devolutiva: DevolutivaParaAvaliacao | null;
  nota: string;
  setNota: (nota: string) => void;
  comentario: string;
  setComentario: (comentario: string) => void;
  isLoading?: boolean;
  onConfirm: () => void;
}

export const AprovarDevolutivaDialog: React.FC<AprovarDevolutivaDialogProps> = ({
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
          <DialogTitle>Aprovar Devolutiva</DialogTitle>
          <DialogDescription>
            Você está aprovando a devolutiva de {devolutiva.alunoNome} para o workshop {devolutiva.workshopNome}.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="nota-aprovar" className="text-right">
              Nota:
            </label>
            <input
              id="nota-aprovar"
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
            <label htmlFor="comentario-aprovar" className="text-right">
              Comentário:
            </label>
            <Textarea
              id="comentario-aprovar"
              placeholder="Comentário opcional"
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
              className="col-span-3"
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
            {isLoading ? "Aprovando..." : "Confirmar Aprovação"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};