import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/current-user.server";

export async function GET(request: NextRequest) {
  const userId = await getCurrentUserId(request);
  const user = await prisma.user.findUniqueOrThrow({ where: { id: userId } });

  const attempts = await prisma.loginAttempt.findMany({
    where: { email: user.email },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  return NextResponse.json(
    attempts.map((a: { id: string; success: boolean; ip: string | null; createdAt: Date }) => ({
      id: a.id,
      success: a.success,
      ip: a.ip ?? "unknown",
      createdAt: a.createdAt.toISOString(),
    }))
  );
}
