"use server";
import { db } from "@/lib/prisma";

export async function getAllCapacitacao() {
  return await db.capacitacao.findMany();
}
