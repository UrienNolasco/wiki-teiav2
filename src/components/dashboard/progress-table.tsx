import { CalendarDays, CheckCircle, FileCheck, FileX, XCircle } from "lucide-react";

import { HoverCard, HoverCardContent, HoverCardTrigger } from "../ui/hover-card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

export interface WorkshopProgress {
  id: string;
  nome: string;
  startedAt: Date | null;
  done: boolean;
  doneAt: Date | null;
  truedone: boolean;
  truedoneAt: Date | null;
}

interface WorkshopProgressTableProps {
  workshops: WorkshopProgress[];
  filterStatus: string | null;
  sortBy: string | null;
}

const WorkshopProgressTable = ({
  workshops,
  filterStatus,
  sortBy,
}: WorkshopProgressTableProps) => {
  // 1) Filtrar (com base em campos reais agora)
  const filtered = workshops.filter((w) => {
    if (!filterStatus) return true;
    if (filterStatus === "assistido") return w.done;
    if (filterStatus === "devolutiva") return w.truedone;
    return true; // ou ignore se filtro não for aplicável
  });

  // 2) Ordenar
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "nome") return a.nome.localeCompare(b.nome);
    if (sortBy === "status") {
      const aStatus = a.startedAt ? 1 : 0;
      const bStatus = b.startedAt ? 1 : 0;
      return bStatus - aStatus;
    }
    return 0;
  });

  // 3) Cálculo de porcentagem
  const concluidos = sorted.filter((w) => w.done).length;
  const porcentagem = sorted.length
    ? (concluidos / sorted.length) * 100
    : 0;

  // 4) Formatação de data
  const formatDate = (date: Date | null) => {
    if (!date) return "—";
    return new Date(date).toLocaleDateString("pt-BR");
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nome do Workshop</TableHead>
          <TableHead>Início</TableHead>
          <TableHead className="text-center">Assistido</TableHead>
          <TableHead className="text-center">Devolutiva</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sorted.map((w) => (
          <TableRow key={w.id}>
            <TableCell className="font-medium truncate">{w.nome}</TableCell>
            <TableCell>{formatDate(w.startedAt)}</TableCell>
            <TableCell className="text-center px-0">
  <HoverCard>
    <HoverCardTrigger asChild>
      <div className="flex justify-center items-center cursor-pointer">
        {w.done ? (
          <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
        ) : (
          <XCircle className="h-5 w-5 text-red-500 mx-auto" />
        )}  
      </div>
    </HoverCardTrigger>
    <HoverCardContent className="w-64">
      <div className="flex items-center gap-2">
        <CalendarDays className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">
          {w.done
            ? `Assistido em ${new Date(w.doneAt!).toLocaleDateString("pt-BR")}`
            : "Não assistido"}
        </span>
      </div>
    </HoverCardContent>
  </HoverCard>
</TableCell>
<TableCell className="text-center px-0">
                                <HoverCard>
                                  <HoverCardTrigger asChild>
                                    <div className="flex justify-center items-center cursor-pointer">
                                      {w.truedone ? (
                                        <>
                                          <FileCheck className="h-5 w-5 text-blue-500" />
                                          <span className="text-sm text-gray-500">
                                            {new Date(
                                              w.truedoneAt!
                                            ).toLocaleDateString("pt-BR")}
                                          </span>
                                        </>
                                      ) : (
                                        <FileX
                                          className={`h-5 w-5 ${
                                            w.done
                                              ? "text-orange-500"
                                              : w.truedone
                                              ? "text-green-500"
                                              : "text-gray-400"
                                          }`}
                                        />
                                      )}
                                    </div>
                                  </HoverCardTrigger>
                                  <HoverCardContent className="w-64">
                                    <div className="flex items-center gap-2">
                                      <span
                                        className={`w-3 h-3 rounded-full ${
                                          w.truedone
                                            ? "bg-green-500"
                                            : w.done
                                            ? "bg-orange-500"
                                            : "bg-gray-400"
                                        }`}
                                      />
                                      <span className="text-sm text-muted-foreground">
                                        {w.truedone
                                          ? "Devolutiva aprovada"
                                          : w.done
                                          ? "Aguardando envio"
                                            : "Usuário ainda não assistiu"}
                                      </span>
                                    </div>
                                  </HoverCardContent>
                                </HoverCard>
                              </TableCell>
          </TableRow>
        ))}
      </TableBody>

      {/* Rodapé com totais */}
      <tfoot>
        <tr>
          <td colSpan={2} className="font-medium">
            Total de Workshops: {sorted.length}
          </td>
          <td colSpan={2} className="text-right">
            Progresso: {porcentagem.toFixed(0)}%
          </td>
        </tr>
      </tfoot>
    </Table>
  );
};

export default WorkshopProgressTable;
