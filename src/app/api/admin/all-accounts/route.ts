import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/current-admin.server";
import { handleApiError } from "@/lib/api-error";

export async function GET(request: NextRequest) {
  try {
    const requester = await getCurrentAdmin(request);
    if (!requester) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const accounts = await prisma.account.findMany({
      orderBy: { createdAt: "desc" },
      include: { user: { select: { fullName: true, email: true } } },
    });

    const active = accounts.filter((a: { status: string }) => a.status === "active").length;
    const savings = accounts.filter((a: { type: string }) => a.type === "savings").length;
    const current = accounts.filter((a: { type: string }) => a.type === "current").length;
    const frozen = accounts.filter((a: { status: string }) => a.status === "frozen").length;
    const closed = accounts.filter((a: { status: string }) => a.status === "closed").length;

    return NextResponse.json({
      stats: { total: accounts.length, active, current, savings, frozen, closed },
      accounts: accounts.map(
        (a: {
          id: string;
          nickname: string;
          accountNumber: string;
          type: string;
          currency: string;
          balance: unknown;
          status: string;
          user: { fullName: string; email: string };
        }) => ({
          id: a.id,
          nickname: a.nickname,
          accountNumber: a.accountNumber,
          type: a.type,
          currency: a.currency,
          balance: Number(a.balance),
          status: a.status,
          ownerName: a.user.fullName,
          ownerEmail: a.user.email,
        })
      ),
    });
  } catch (err) {
    return handleApiError(err, "get all accounts (admin)");
  }
}
