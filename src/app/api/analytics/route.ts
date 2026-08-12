import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const [monthly, categories] = await Promise.all([
    prisma.monthlySpending.findMany({ orderBy: { sortIndex: "asc" } }),
    prisma.categorySpending.findMany(),
  ]);

  return NextResponse.json({
    spendingByMonth: monthly.map((m: { month: string; income: unknown; expenses: unknown }) => ({
      month: m.month,
      income: Number(m.income),
      expenses: Number(m.expenses),
    })),
    spendingByCategory: categories.map((c: { category: string; value: unknown; color: string }) => ({
      category: c.category,
      value: Number(c.value),
      color: c.color,
    })),
  });
}
