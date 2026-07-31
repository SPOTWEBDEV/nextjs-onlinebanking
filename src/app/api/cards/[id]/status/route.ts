import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { serializeCard } from "@/lib/serializers.server";

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { status } = (await request.json()) as { status: "active" | "frozen" | "blocked" };

  const card = await prisma.card.update({ where: { id }, data: { status } });
  return NextResponse.json(serializeCard(card));
}
