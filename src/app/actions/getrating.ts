// app/actions/getrating.ts
"use server"

import { db } from "@/lib/prisma";

interface GetRatingParams {
  workshopId: string;
}

export const getAverageRating = async ({ workshopId }: GetRatingParams) => {
  try {
    const result = await db.avaliacaoWorkshop.aggregate({
      where: { workshopId },
      _avg: { rating: true },
      _count: { rating: true }
    })

    return {
      average: result._avg.rating || 0,
      count: result._count.rating || 0
    }
  } catch (error) {
    console.error("Error fetching rating:", error)
    return { average: 0, count: 0 }
  }
}