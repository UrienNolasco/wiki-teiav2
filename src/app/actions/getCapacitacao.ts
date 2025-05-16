"use server";

import { db } from "@/lib/prisma";

export const getCapacitacao = async () => {
  const capacitacao = await db.capacitacao.findMany({});

  return capacitacao;
};
