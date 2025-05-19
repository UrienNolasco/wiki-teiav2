"use server";

import { db } from "@/lib/prisma";

export async function getAllFormacao() {
  return await db.formacao.findMany();
}