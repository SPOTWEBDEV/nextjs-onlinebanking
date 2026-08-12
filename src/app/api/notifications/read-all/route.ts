import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/current-user.server";

export async function POST(request: NextRequest) {
  const userId = await getCurrentUserId(request);
  await prisma.notification.updateMany({ where: { userId }, data: { read: true } });
  return NextResponse.json({ ok: true });
}
