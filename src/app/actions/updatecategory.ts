"use server";

import { TipoUsuario } from "@prisma/client";

import { db } from "@/lib/prisma";

interface UpdateCategoryProps {
  userId: string;
  category: TipoUsuario;
}

export const updateCategory = async ({
  userId,
  category,
}: UpdateCategoryProps) => {
  try {
    const updatedUser = await db.user.update({
      where: { id: userId },
      data: {
        tipo: category,
      },
    });

    return updatedUser;
  } catch (error) {
    console.error("Error updating user category:", error);
    throw error;
  }
};
