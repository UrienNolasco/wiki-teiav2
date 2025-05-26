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



interface DevolverDevolutivaDialogProps {
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

export const DevolverDevolutivaDialog: React.FC<DevolverDevolutivaDialogProps> = ({
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
          <DialogTitle>Devolver para Revisão</DialogTitle>
          <DialogDescription>
            Você está devolvendo a devolutiva de {devolutiva.alunoNome} para revisão.
            Por favor, forneça um feedback detalhado sobre o que precisa ser melhorado.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="nota-devolucao" className="text-right">
              Nota:
            </label>
            <input
              id="nota-devolucao"
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
            <label htmlFor="comentario-devolucao" className="text-right">
              Feedback: *
            </label>
            <Textarea
              id="comentario-devolucao"
              placeholder="Explique o que precisa ser melhorado"
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
            {isLoading ? "Devolvendo para revisão..." : "Confirmar Devolução"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};