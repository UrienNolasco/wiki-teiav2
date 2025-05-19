"use server"

import { db } from "@/lib/prisma";

export async function deleteFormacao(id: string) {
  await db.formacao.delete({
    where: { id },
  });
  return { id };
}