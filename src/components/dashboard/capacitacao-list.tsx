import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

interface ICapacitacao {
  id: string;
  nome: string;
  link_video: string | null;
  formacaoId: string;
  done: boolean;
}

interface CapacitacaoSelectorProps {
  capacitacoes: ICapacitacao[];
  selectedCapacitacaoId: string;
  onSelect: (id: string) => void;
  onBuscar: () => void;
}

const CapacitacaoSelector = ({
  capacitacoes,
  selectedCapacitacaoId,
  onSelect,
  onBuscar,
}: CapacitacaoSelectorProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Capacitações</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {capacitacoes.map((cap) => (
            <div
              key={cap.id}
              className={`p-3 rounded-md cursor-pointer transition-colors ${
                selectedCapacitacaoId === cap.nome
                  ? "bg-pink-50 dark:bg-pink-900/20 border border-rosa-500"
                  : "hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
              onClick={() => onSelect(cap.nome)}
            >
              <p>{cap.nome}</p>
            </div>
          ))}
        </div>

        <Button className="w-full mt-6 bg-rosa-gradient" onClick={onBuscar}>
          Buscar
        </Button>
      </CardContent>
    </Card>
  );
};

export default CapacitacaoSelector;
