import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/current-user.server";
import { serializeNotification } from "@/lib/serializers.server";

export async function GET() {
  const userId = await getCurrentUserId();
  const notifications = await prisma.notification.findMany({
    where: { userId },
    orderBy: { date: "desc" },
  });
  return NextResponse.json(notifications.map(serializeNotification));
}
