// UploadDialog.tsx
"use client";

import { FileCheck, Loader2, Upload } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { SubmeterDevolutivaResult, submeterNovaDevolutivaAction } from "@/app/actions/submeterNovaDevolutivaAction";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

import { WorkshopFrontend } from "./types"; // Assumindo que este tipo está definido em algum lugar

interface UploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workshop: WorkshopFrontend | null;
  alunoId: string;
  devolutivaAgendamentoId: string;
  isDragging: boolean;
  onDragEnter: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onFileInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
  fileSelected: File | null;
  setFileSelected: (file: File | null) => void;
  // onSubmissionComplete removido
}

const initialState: SubmeterDevolutivaResult = {
  success: false,
  message: "",
};

function SubmitButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="bg-purple-gradient" disabled={disabled || pending}>
      {pending ? ( <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Enviando...</> ) : ( "Enviar Arquivo" )}
    </Button>
  );
}

const UploadDialog: React.FC<UploadDialogProps> = ({
  open,
  onOpenChange,
  workshop,
  alunoId,
  devolutivaAgendamentoId,
  isDragging,
  onDragEnter,
  onDragLeave,
  onDragOver,
  onDrop,
  onFileInput,
  fileSelected,
  setFileSelected,
}) => {
  const [formKey, setFormKey] = useState(0);
  const [state, formAction] = useActionState(
    submeterNovaDevolutivaAction,
    initialState
  );

  const stableSetFileSelected = useCallback(setFileSelected, [setFileSelected]);

 
  useEffect(() => {
    if (open) {
      setFormKey(prevKey => prevKey + 1);
      stableSetFileSelected(null);

    }
  }, [open, stableSetFileSelected]);


  useEffect(() => {
    if (state.message && state.message !== initialState.message) {
      if (state.success) {

      }
    }
  }, [state, onOpenChange]);


  const handleDialogInternalOpenChange = (newOpenState: boolean) => {
    if (!newOpenState) {
      stableSetFileSelected(null);
    }
    onOpenChange(newOpenState);
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogInternalOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form key={formKey} action={formAction}>
          <DialogHeader>
            <DialogTitle>Enviar Devolutiva</DialogTitle>
            <DialogDescription>
              {workshop ? `Envie a devolutiva para ${workshop.nome}`: "Enviar devolutiva"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <input type="hidden" name="workshopId" value={workshop?.id || ""} />
            <input type="hidden" name="alunoId" value={alunoId} />
            <input type="hidden" name="devolutivaAgendamentoId" value={devolutivaAgendamentoId}/>
            <div
              className={cn(
                "border-2 border-dashed rounded-lg p-8 text-center flex flex-col items-center justify-center transition-colors",
                isDragging ? "border-purple-500 bg-purple-50" : "border-gray-300",
                "cursor-pointer"
              )}
              onDragEnter={onDragEnter} onDragLeave={onDragLeave} onDragOver={onDragOver} onDrop={onDrop}
              onClick={() => document.getElementById(`fileInput-${formKey}`)?.click()} // Adiciona formKey ao ID para garantir unicidade se necessário
            >
              <input type="file" id={`fileInput-${formKey}`} name="arquivo" className="hidden" onChange={onFileInput}/>
              <Upload className="h-10 w-10 text-purple-500 mb-2" />
              <p className="text-sm font-medium mb-1">
                {fileSelected ? fileSelected.name : "Arraste e solte ou clique para selecionar um arquivo"}
              </p>
              <p className="text-xs text-muted-foreground">
                PDF, PPTX, Vídeo (até 200MB)
              </p>
            </div>
            {fileSelected && (
              <div className="bg-slate-50 p-3 rounded-md flex items-center">
                <FileCheck className="h-5 w-5 text-green-500 mr-2" />
                <div className="flex-1 overflow-hidden">
                  <p className="font-medium text-sm truncate">{fileSelected.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(fileSelected.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
                <Button variant="ghost" size="sm" type="button" className="text-red-500 h-8 hover:text-red-700"
                  onClick={(e) => {
                    e.stopPropagation();
                    stableSetFileSelected(null);
                    const fileInputElement = document.getElementById(`fileInput-${formKey}`) as HTMLInputElement | null;
                    if (fileInputElement) fileInputElement.value = "";
                  }}
                >
                  Remover
                </Button>
              </div>
            )}
          </div>
          {/* Exibe a mensagem de sucesso ou erro da server action aqui */}
          {state?.message && state.message !== initialState.message && (
             <p className={`my-2 text-sm ${state.success ? "text-green-600" : "text-red-500"}`}>
               {state.message}
             </p>
           )}
          {/* Exibição simplificada de erros de campo, se houver */}
          {state?.errorDetails && typeof state.errorDetails === 'object' && state.errorDetails.fieldErrors && (
            <div className="my-2 text-sm text-red-500">
              {Object.entries(state.errorDetails.fieldErrors).map(([field, errorMsg]) => (
                errorMsg && <p key={field}><strong>{field}:</strong> {Array.isArray(errorMsg) ? errorMsg.join(', ') : errorMsg}</p>
              ))}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" type="button" onClick={() => handleDialogInternalOpenChange(false)}>
              Cancelar
            </Button>
            <SubmitButton disabled={!fileSelected || !workshop} />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UploadDialog;