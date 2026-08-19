import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/current-admin.server";
import { notifyUser } from "@/lib/notify.server";
import { handleApiError } from "@/lib/api-error";

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const requester = await getCurrentAdmin(request);
    if (!requester) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const { id } = await params;
    const { status } = (await request.json()) as { status: "active" | "frozen" | "blocked" };

    const card = await prisma.card.update({ where: { id }, data: { status } });

    await notifyUser(
      card.userId,
      status === "frozen" ? "Card frozen" : status === "blocked" ? "Card blocked" : "Card unfrozen",
      `Your card ${card.numberMasked} was ${status} by an administrator`,
      "card"
    );

    return NextResponse.json({ id: card.id, status: card.status });
  } catch (err) {
    return handleApiError(err, "update card status (admin)");
  }
}
