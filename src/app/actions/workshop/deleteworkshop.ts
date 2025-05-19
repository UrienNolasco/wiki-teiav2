"use server"

import { db } from "@/lib/prisma";

export async function deleteWorkshop(id: string) {
  await db.workshop.delete({
    where: { id },
  });
  return { id };
}