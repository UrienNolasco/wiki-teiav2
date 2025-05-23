"use client";

import { motion } from "framer-motion";
import {
  ChevronDown,
  ChevronUp,
  FileText,
  MessageCircle,
  Star,
} from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import { getAverageRating } from "@/app/actions/getrating";
import { switchVideo } from "@/app/actions/switchVideo";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useLastWorkshopStore } from "@/stores/progressStore";

import FooterAvaliation from "./footeravaliation";
import InitialWorkshop from "./initialworkshop";


interface Workshop {
  id: string;
  nome: string;
  link_video: string;
  done: boolean;
  startedAt?: Date | null;
}

export const VideoCard = ({ workshop }: { workshop: Workshop }) => {
  const { setLastWorkshop } = useLastWorkshopStore();
  const [averageRating, setAverageRating] = useState(0);
  const [ratingCount, setRatingCount] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    setLastWorkshop(workshop.id);
  }, [workshop.id, setLastWorkshop]);

  useEffect(() => {
    const fetchRating = async () => {
      const { average, count } = await getAverageRating({
        workshopId: workshop.id,
      });
      setAverageRating(Math.round(average));
      setRatingCount(count);
    };

    fetchRating();
  }, [workshop.id]);

  const renderStars = () => {
    return [1, 2, 3, 4, 5].map((starIndex) => (
      <Star
        key={starIndex}
        size={18}
        className={`${
          starIndex <= averageRating
            ? "text-yellow-400 fill-current"
            : "text-gray-300"
        }`}
      />
    ));
  };

  const user = useSession();

  const [isCollapsed, setIsCollapsed] = useState(true);

  useEffect(() => {
    if (!isCollapsed) {
      setLastWorkshop(workshop.id);
    }
  }, [isCollapsed, workshop.id, setLastWorkshop]);

  const handleToggleCollapse = () => {
    setIsCollapsed((prev) => {
      const newState = !prev;
      // Verifica se está expandindo E se não tem startedAt
      if (prev === true && newState === false && !workshop.startedAt) {
        setIsDialogOpen(true);
      }
      return newState;
    });
  };

  const handleDialogClose = (isCancel: boolean) => {
    if (isCancel) {
      setIsCollapsed(true); // Só fecha o card se for cancelamento
    }
  };

  const [isDone, setIsDone] = useState(workshop.done);

  const cleanVideoUrl = workshop.link_video.replace(/^"(.*)"$/, "$1");

  const handleSwitchChange = async () => {
    const newDoneStatus = !isDone;
    setIsDone(newDoneStatus);

    try {
      await switchVideo({
        usuarioId: user.data?.user.id ?? "",
        workshopId: workshop.id,
        done: newDoneStatus,
      });
      toast.success(
        "Alteração no estado de visto do vídeo realizada com sucesso!"
      );
    } catch (error) {
      console.error("Erro ao atualizar status do vídeo", error);
      setIsDone(!newDoneStatus); // Reverter em caso de erro
      toast.error("Erro ao marcar video como visto!");
    }
  };

  return (
    <Card className="w-full mb-6 shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
      <CardHeader
        className="cursor-pointer pb-4"
        onClick={handleToggleCollapse}
      >
        <CardTitle className="flex items-center gap-2 text-xl text-gray-800">
          {/* Nome do Workshop cresce para ocupar o espaço disponível */}
          <div className="flex items-center gap-2 flex-grow">
            <FileText className="h-6 w-6 text-blue-600 " />
            {workshop.nome}
          </div>

          {/* Estrelas alinhadas à direita */}
          <div className="flex items-center gap-1 justify-end min-w-[100px] mr-4">
            {renderStars()}
            {ratingCount > 0 && (
              <span className="text-sm text-gray-500 ml-1">
                ({ratingCount})
              </span>
            )}
          </div>

          {/* Ícone de abrir/fechar */}
          {isCollapsed ? (
            <ChevronDown className="h-6 w-6 text-gray-500 transition-transform duration-300" />
          ) : (
            <ChevronUp className="h-6 w-6 text-gray-500 transition-transform duration-300" />
          )}
        </CardTitle>
      </CardHeader>

      {isDialogOpen && (
        <InitialWorkshop
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          onClose={handleDialogClose}
          usuarioId={user.data?.user.id ?? ""}
          workshopId={workshop.id}
        />
      )}

      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{
          height: isCollapsed ? 0 : "auto",
          opacity: isCollapsed ? 0 : 1,
        }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        className="overflow-hidden"
      >
        <CardContent className="space-y-4">
          <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
            <iframe
              src={cleanVideoUrl}
              className="w-full h-full"
              title={workshop.nome}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
          </div>
        </CardContent>

        <CardFooter className="flex justify-between gap-4  items-center">
          <FooterAvaliation workshopId={workshop.id} isDone={!isDone} />

          <Button
            variant="outline"
            className="flex-1 gap-2"
            asChild
            onClick={(e) => e.stopPropagation()}
          >
            <Link href="#">
              <FileText className="h-4 w-4" />
              Materiais de Apoio
            </Link>
          </Button>

          <Button
            variant="outline"
            className="flex-1 gap-2"
            asChild
            onClick={(e) => e.stopPropagation()}
          >
            <Link href="/devolutivas">
              <MessageCircle className="h-4 w-4" />
              Devolutiva
            </Link>
          </Button>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700">Visto</span>
            <Switch checked={isDone} onCheckedChange={handleSwitchChange} />
          </div>
        </CardFooter>
      </motion.div>
    </Card>
  );
};
