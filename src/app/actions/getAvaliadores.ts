"use server";

import { TipoUsuario } from "@prisma/client";

import { db } from "@/lib/prisma";

export async function getAvaliadores() {
    try {
      return await db.user.findMany({
        where: {
          tipo: {
            in: [TipoUsuario.Administrador, TipoUsuario.Instrutor, TipoUsuario.Avaliador],
          }
        },
        orderBy: {
          name: "asc",
        },
        select: { id: true, name: true, email: true },
      });
    } catch (error) {
        console.error("Erro ao buscar avaliadores:", error);
      throw new Error("Não foi possível buscar os avaliadores.");
    }
  }