import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/current-admin.server";
import { handleApiError } from "@/lib/api-error";

export async function GET(request: NextRequest) {
  try {
    const requester = await getCurrentAdmin(request);
    if (!requester) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const attempts = await prisma.loginAttempt.findMany({
      orderBy: { createdAt: "desc" },
      take: 30,
    });

    return NextResponse.json(
      attempts.map((a: { id: string; email: string; success: boolean; ip: string | null; createdAt: Date }) => ({
        id: a.id,
        email: a.email,
        success: a.success,
        ip: a.ip ?? "unknown",
        createdAt: a.createdAt.toISOString(),
      }))
    );

  } catch (err) {
    return handleApiError(err, "get login-attempts");
  }
}
