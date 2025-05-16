import { Star, ThumbsUp } from "lucide-react";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { toast } from "react-toastify";

import { addRating } from "@/app/actions/addrating";

import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Textarea } from "./ui/textarea";

interface FooterAvaliationProps {
  workshopId: string; // Adicione esta prop
  isDone?: boolean;
}

const FooterAvaliation = ({ workshopId, isDone }: FooterAvaliationProps) => {
  const user = useSession();
  const [open, setOpen] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState<number>(0);
  const [isEvaluated, setIsEvaluated] = useState(false);

  const handleConfirm = async () => {
    setIsEvaluated(true);
    setOpen(false);

    try {
      await addRating({
        usuarioId: user.data?.user.id ?? "",
        workshopId,
        rating,
        feedback,
      });
    } catch (error) {
      console.error("Erro ao adicionar avaliação", error);
      setIsEvaluated(false); // Reverter em caso de erro
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    if (isDone) {
      e.preventDefault();
      toast.warning(
        "Por favor, marque o vídeo como assistido antes de avaliar."
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="flex-1 gap-2 border-gray-400 hover:border-gray-600"
          onClick={handleClick}
        >
          <ThumbsUp className="h-4 w-4" />
          {isEvaluated ? "Workshop Avaliado" : "Avaliar Workshop"}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[450px] rounded-xl shadow-lg">
        <DialogHeader className="text-center">
          <DialogTitle className="text-xl font-semibold text-gray-800">
            Avalie o Workshop
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center justify-center space-y-4 mt-4 fill-current">
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-10 w-10 cursor-pointer transition-transform duration-200 fill-current ${
                  rating >= star
                    ? "text-yellow-500"
                    : "text-gray-300 hover:text-yellow-400"
                }`}
                onClick={() => setRating(star)}
              />
            ))}
          </div>
          <Textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Deixe seu feedback..."
          />
          <Button
            className="w-full bg-green-600 hover:bg-green-700 transition-colors duration-300 rounded-lg py-2 text-white font-medium"
            onClick={(e) => {
              e.stopPropagation();
              handleConfirm();
            }}
          >
            Confirmar Avaliação
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FooterAvaliation;
