import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/current-user.server";
import { serializeAccount } from "@/lib/serializers.server";
import { handleApiError } from "@/lib/api-error";

export async function GET(request: NextRequest) {
  try {
    const userId = await getCurrentUserId(request);
    const accounts = await prisma.account.findMany({
      where: { userId },
      orderBy: { createdAt: "asc" },
    });
    return NextResponse.json(accounts.map(serializeAccount));

  } catch (err) {
    return handleApiError(err, "get accounts");
  }
}
