import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/current-user.server";
import { serializeCard } from "@/lib/serializers.server";
import { handleApiError } from "@/lib/api-error";

export async function GET(request: NextRequest) {
  try {
    const userId = await getCurrentUserId(request);
    const cards = await prisma.card.findMany({ where: { userId }, orderBy: { createdAt: "asc" } });
    return NextResponse.json(cards.map(serializeCard));

  } catch (err) {
    return handleApiError(err, "get cards");
  }
}
