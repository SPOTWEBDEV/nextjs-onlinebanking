import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/current-user.server";
import { serializeCard } from "@/lib/serializers.server";

export async function GET() {
  const userId = await getCurrentUserId();
  const cards = await prisma.card.findMany({ where: { userId }, orderBy: { createdAt: "asc" } });
  return NextResponse.json(cards.map(serializeCard));
}
