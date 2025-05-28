import { getServerSession } from "next-auth";

import { VideoCard } from "@/components/videocard";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/prisma";

export const revalidate = 0;

const Workshops = async () => {
  const session = await getServerSession(authOptions);
  const userId = session?.user.id;

  const workshops = await db.workshop.findMany({
    where: {
      capacitacao: {
        nome: "Capacitação MM",
      },
    },
    include: {
      progressoWorkshop: {
        where: {
          usuarioId: userId,
        },
      },
    },
    orderBy: {
      nome: "asc",
    },
  });

  const workshopsComProgresso = workshops.map((workshop) => ({
    ...workshop,
    done: workshop.progressoWorkshop.some((pw) => pw.done),
    startedAt: workshop.progressoWorkshop[0]?.startedAt || null, // Adiciona o startedAt
  }));

  return (
      <div className="container mx-auto animate-fade-in">
          <div className="max-w-7xl mx-auto space-y-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Capacitação MM
            </h1>
            <div className="space-y-6">
              {workshopsComProgresso.map((workshop) => (
                <VideoCard
                  key={workshop.id}
                  workshop={{
                    ...workshop,
                    link_video: workshop.link_video ?? "",
                    done: workshop.done, // Agora está correto
                  }}
                />
              ))}
            </div>
          </div>
      </div>

  );
};

export default Workshops;
