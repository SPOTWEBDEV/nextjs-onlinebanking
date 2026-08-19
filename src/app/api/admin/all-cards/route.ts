import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/current-admin.server";
import { handleApiError } from "@/lib/api-error";

export async function GET(request: NextRequest) {
  try {
    const requester = await getCurrentAdmin(request);
    if (!requester) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const cards = await prisma.card.findMany({
      orderBy: { createdAt: "desc" },
      include: { user: { select: { fullName: true, email: true } } },
    });

    const physical = cards.filter((c: { type: string }) => c.type === "physical").length;
    const virtual = cards.filter((c: { type: string }) => c.type === "virtual").length;
    const frozen = cards.filter((c: { status: string }) => c.status === "frozen").length;
    const blocked = cards.filter((c: { status: string }) => c.status === "blocked").length;

    return NextResponse.json({
      stats: { total: cards.length, physical, virtual, frozen, blocked },
      cards: cards.map(
        (c: {
          id: string;
          numberMasked: string;
          holder: string;
          type: string;
          status: string;
          spendLimit: unknown;
          currency: string;
          user: { fullName: string; email: string };
        }) => ({
          id: c.id,
          numberMasked: c.numberMasked,
          holder: c.holder,
          type: c.type,
          status: c.status,
          spendLimit: Number(c.spendLimit),
          currency: c.currency,
          ownerName: c.user.fullName,
          ownerEmail: c.user.email,
        })
      ),
    });
  } catch (err) {
    return handleApiError(err, "get all cards (admin)");
  }
}
