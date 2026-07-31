import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/current-user.server";
import { serializeTransaction } from "@/lib/serializers.server";

export async function GET(request: NextRequest) {
  const userId = await getCurrentUserId();
  const accountId = request.nextUrl.searchParams.get("accountId") ?? undefined;
  const query = request.nextUrl.searchParams.get("query") ?? undefined;

  const transactions = await prisma.transaction.findMany({
    where: {
      account: { userId },
      ...(accountId ? { accountId } : {}),
      ...(query
        ? {
            OR: [
              { description: { contains: query, mode: "insensitive" } },
              { counterparty: { contains: query, mode: "insensitive" } },
              { reference: { contains: query, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    orderBy: { date: "desc" },
  });

  return NextResponse.json(transactions.map(serializeTransaction));
}
