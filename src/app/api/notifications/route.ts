import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/current-user.server";
import { serializeNotification } from "@/lib/serializers.server";
import { handleApiError } from "@/lib/api-error";

export async function GET(request: NextRequest) {
  try {
    const userId = await getCurrentUserId(request);
    const notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { date: "desc" },
    });
    return NextResponse.json(notifications.map(serializeNotification));

  } catch (err) {
    return handleApiError(err, "get notifications");
  }
}
