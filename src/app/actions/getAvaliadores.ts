"use server";

import { db } from "@/lib/prisma";

export async function getAvaliadores() {
    try {
      return await db.user.findMany({
        where: { tipo: "Avaliador" },
        select: { id: true, name: true, email: true },
      });
    } catch (error) {
        console.error("Erro ao buscar avaliadores:", error);
      throw new Error("Não foi possível buscar os avaliadores.");
    }
  }