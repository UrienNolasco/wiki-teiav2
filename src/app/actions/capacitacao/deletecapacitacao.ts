"use server"

import { db } from "@/lib/prisma";

export async function deleteCapacitacao(id: string) {
  await db.capacitacao.delete({
    where: { id },
  });
  return { id };
}