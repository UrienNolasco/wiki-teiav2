import { FileCheck,Upload } from "lucide-react";
import React from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

import { WorkshopFrontend } from "./types";


interface UploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workshop: WorkshopFrontend | null;
  isDragging: boolean;
  onDragEnter: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onFileInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
  fileSelected: File | null;
  setFileSelected: (file: File | null) => void;
  onSave: () => void;
}

const UploadDialog: React.FC<UploadDialogProps> = ({
  open,
  onOpenChange,
  workshop,
  isDragging,
  onDragEnter,
  onDragLeave,
  onDragOver,
  onDrop,
  onFileInput,
  fileSelected,
  setFileSelected,
  onSave,
}) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Enviar Devolutiva</DialogTitle>
        <DialogDescription>
          {workshop ? `Envie a devolutiva para ${workshop.nome}` : "Enviar devolutiva"}
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div
          className={cn(
            "border-2 border-dashed rounded-lg p-8 text-center flex flex-col items-center justify-center transition-colors",
            isDragging ? "border-purple-500 bg-purple-50" : "border-gray-300",
            "cursor-pointer"
          )}
          onDragEnter={onDragEnter}
          onDragLeave={onDragLeave}
          onDragOver={onDragOver}
          onDrop={onDrop}
          onClick={() => document.getElementById("fileInput")?.click()}
        >
          <input
            type="file"
            id="fileInput"
            className="hidden"
            onChange={onFileInput}
          />
          <Upload className="h-10 w-10 text-purple-500 mb-2" />
          <p className="text-sm font-medium mb-1">
            {fileSelected ? fileSelected.name : "Arraste e solte ou clique para selecionar um arquivo"}
          </p>
          <p className="text-xs text-muted-foreground">
            Suporta PDFs, documentos e imagens (até 10MB)
          </p>
        </div>
        {fileSelected && (
          <div className="bg-slate-50 p-3 rounded-md flex items-center">
            <FileCheck className="h-5 w-5 text-green-500 mr-2" />
            <div className="flex-1 overflow-hidden">
              <p className="font-medium text-sm truncate">{fileSelected.name}</p>
              <p className="text-xs text-muted-foreground">
                {(fileSelected.size / 1024).toFixed(1)} KB
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-red-500 h-8 hover:text-red-700"
              onClick={(e) => {
                e.stopPropagation();
                setFileSelected(null);
              }}
            >
              Remover
            </Button>
          </div>
        )}
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={() => onOpenChange(false)}>
          Cancelar
        </Button>
        <Button
          onClick={onSave}
          className="bg-purple-gradient"
          disabled={!fileSelected}
        >
          Enviar Arquivo
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

export default UploadDialog;