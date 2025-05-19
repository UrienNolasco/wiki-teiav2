"use server"
import { db } from "@/lib/prisma";

export async function getAllWorkshop() {
    return await db.workshop.findMany();
  }
