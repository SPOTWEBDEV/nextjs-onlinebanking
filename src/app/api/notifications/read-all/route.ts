import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/current-user.server";
import { handleApiError } from "@/lib/api-error";

export async function POST(request: NextRequest) {
  try {
    const userId = await getCurrentUserId(request);
    await prisma.notification.updateMany({ where: { userId }, data: { read: true } });
    return NextResponse.json({ ok: true });

  } catch (err) {
    return handleApiError(err, "post read-all");
  }
}
