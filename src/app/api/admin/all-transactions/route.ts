import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/current-admin.server";
import { handleApiError } from "@/lib/api-error";

export async function GET(request: NextRequest) {
  try {
    const requester = await getCurrentAdmin(request);
    if (!requester) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const transactions = await prisma.transaction.findMany({
      orderBy: { date: "desc" },
      take: 200,
      include: { account: { select: { userId: true, user: { select: { fullName: true, email: true } } } } },
    });

    const pending = transactions.filter((t: { status: string }) => t.status === "pending").length;

    return NextResponse.json({
      stats: { total: transactions.length, pending },
      transactions: transactions.map(
        (t: {
          id: string;
          date: Date;
          description: string;
          reference: string;
          amount: unknown;
          currency: string;
          status: string;
          type: string;
          category: string;
          account: { user: { fullName: string; email: string } };
        }) => ({
          id: t.id,
          date: t.date.toISOString().slice(0, 10),
          description: t.description,
          reference: t.reference,
          amount: Number(t.amount),
          currency: t.currency,
          status: t.status,
          type: t.type,
          category: t.category,
          ownerName: t.account.user.fullName,
          ownerEmail: t.account.user.email,
        })
      ),
    });
  } catch (err) {
    return handleApiError(err, "get all transactions (admin)");
  }
}
