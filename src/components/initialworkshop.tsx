"use client";

import { Rocket, X } from "lucide-react";
import { toast } from "react-toastify";

import { startWorkshop } from "@/app/actions/startworkshop";

import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

interface InitialWorkshopProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClose?: (isCancel: boolean) => void;
  usuarioId: string; // Nova prop
  workshopId: string; // Nova prop
  onWorkshopStarted?: () => void;
  
}

const InitialWorkshop = ({
  open,
  onOpenChange,
  onClose,
  usuarioId, // Nova prop
  workshopId, // Nova prop
  onWorkshopStarted
}: InitialWorkshopProps) => {
  const handleConfirm = async () => {
    try {
      await startWorkshop({ usuarioId, workshopId });
      toast.success("Workshop iniciado com sucesso!");
      onWorkshopStarted?.();
      onOpenChange(false);
      onClose?.(false); // Não é cancelamento
    } catch (error) {
      console.error("Erro ao iniciar o workshop:", error);
      toast.error("Erro ao iniciar o workshop. Tente novamente mais tarde.");
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
    onClose?.(true); // É cancelamento
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* Trigger invisível para manter a funcionalidade do Dialog */}
      <DialogTrigger asChild>
        <button className="hidden" aria-hidden="true" />
      </DialogTrigger>

      <DialogContent
        onInteractOutside={(e) => e.preventDefault()} // Impede o fechamento ao clicar fora
        className="border-0 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 rounded-xl overflow-hidden  backdrop:bg-black/50 p-6 [&>button]:hidden"
      >
        {/* Decoração de fundo */}

        <div className="space-y-6">
          <DialogTitle className="text-2xl font-bold text-gray-800 dark:text-gray-100 text-center">
            Iniciar Workshop
            <div className="mx-auto mt-2 h-1 w-12 bg-pink-500 rounded-full" />
          </DialogTitle>

          <DialogDescription className="text-center text-gray-500 dark:text-gray-400 leading-relaxed">
            <Rocket className="h-12 w-12 text-pink-500 mx-auto mb-4" />
            Você está prestes a iniciar uma nova jornada de aprendizagem. Ao
            confirmar, registraremos a data de início do workshop.
          </DialogDescription>

          <DialogFooter className="flex flex-col gap-2 w-full pt-2">
            <Button
              className=" transform transition-all duration-300 hover:scale-[1.02] 
                        bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 
                        text-white shadow-sm hover:shadow-md"
              onClick={handleConfirm}
            >
              <Rocket className="h-4 w-4 mr-2" />
              Iniciar Agora
            </Button>

            <Button
              variant="outline"
              className=" border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300
                        hover:bg-gray-50 dark:hover:bg-gray-800/50"
              onClick={handleCancel}
            >
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
          </DialogFooter>
        </div>

        {/* Efeito de borda gradiente */}
      </DialogContent>
    </Dialog>
  );
};
export default InitialWorkshop;
