"use server";

import { db } from "@/lib/prisma";

export const getUsers = async () => {
  const users = await db.user.findMany({});

  return users;
};
