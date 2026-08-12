import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { serializeCard } from "@/lib/serializers.server";
import { notifyUser } from "@/lib/notify.server";
import { handleApiError } from "@/lib/api-error";

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { status } = (await request.json()) as { status: "active" | "frozen" | "blocked" };

    const card = await prisma.card.update({ where: { id }, data: { status } });

    await notifyUser(
      card.userId,
      status === "frozen" ? "Card frozen" : status === "blocked" ? "Card blocked" : "Card unfrozen",
      `Your card ${card.numberMasked} is now ${status}`,
      "card"
    );

    return NextResponse.json(serializeCard(card));
  } catch (err) {
    return handleApiError(err, "update card status");
  }
}
