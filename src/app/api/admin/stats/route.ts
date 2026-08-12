import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/current-admin.server";
import { handleApiError } from "@/lib/api-error";

export async function GET(request: NextRequest) {
  try {
    const requester = await getCurrentAdmin(request);
    if (!requester) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const [
      totalCustomers,
      activeCustomers,
      accounts,
      transfersToday,
      pendingTransactions,
      pendingKyc,
      activeLoans,
      depositsThisMonth,
      withdrawalsThisMonth,
      customersByMonthRaw,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { status: "active" } }),
      prisma.account.findMany({ select: { balance: true } }),
      prisma.transaction.count({ where: { category: "transfer", date: { gte: startOfDay } } }),
      prisma.transaction.count({ where: { status: "pending" } }),
      prisma.user.count({ where: { kycStatus: "pending" } }),
      prisma.loanApplication.count({ where: { status: "active" } }),
      prisma.transaction.aggregate({
        where: { type: "credit", status: "completed", date: { gte: startOfMonth } },
        _sum: { amount: true },
      }),
      prisma.transaction.aggregate({
        where: { type: "debit", status: "completed", date: { gte: startOfMonth } },
        _sum: { amount: true },
      }),
      prisma.$queryRaw<{ month: string; count: bigint }[]>`
        SELECT to_char("createdAt", 'YYYY-MM') as month, count(*) as count
        FROM users
        WHERE "createdAt" >= NOW() - INTERVAL '6 months'
        GROUP BY month
        ORDER BY month ASC
      `,
    ]);

    const totalBalance = accounts.reduce((sum: number, a: { balance: unknown }) => sum + Number(a.balance), 0);

    return NextResponse.json({
      totalCustomers,
      activeCustomers,
      totalBalance,
      transfersToday,
      pendingApprovals: pendingTransactions + pendingKyc,
      activeLoans,
      depositsThisMonth: Number(depositsThisMonth._sum.amount ?? 0),
      withdrawalsThisMonth: Number(withdrawalsThisMonth._sum.amount ?? 0),
      newCustomersByMonth: customersByMonthRaw.map((r: { month: string; count: bigint }) => ({
        month: r.month,
        count: Number(r.count),
      })),
    });
  } catch (err) {
    return handleApiError(err, "fetch admin stats");
  }
}
