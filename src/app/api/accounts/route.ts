import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/current-user.server";
import { serializeAccount } from "@/lib/serializers.server";

export async function GET() {
  const userId = await getCurrentUserId();
  const accounts = await prisma.account.findMany({
    where: { userId },
    orderBy: { createdAt: "asc" },
  });
  return NextResponse.json(accounts.map(serializeAccount));
}
