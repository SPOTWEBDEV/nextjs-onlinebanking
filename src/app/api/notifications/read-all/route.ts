import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/current-user.server";

export async function POST() {
  const userId = await getCurrentUserId();
  await prisma.notification.updateMany({ where: { userId }, data: { read: true } });
  return NextResponse.json({ ok: true });
}
