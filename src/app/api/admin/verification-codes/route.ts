import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/current-admin.server";

export async function GET(request: NextRequest) {
  const requester = await getCurrentAdmin(request);
  if (!requester) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const codes = await prisma.verificationCode.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
    include: { user: { select: { fullName: true, email: true } } },
  });

  return NextResponse.json(
    codes.map(
      (c: {
        id: string;
        user: { fullName: string; email: string };
        code: string;
        purpose: string;
        destination: string;
        used: boolean;
        expiresAt: Date;
        createdAt: Date;
      }) => ({
        id: c.id,
        userName: c.user.fullName,
        userEmail: c.user.email,
        code: c.code,
        purpose: c.purpose,
        destination: c.destination,
        used: c.used,
        expired: c.expiresAt < new Date(),
        expiresAt: c.expiresAt.toISOString(),
        createdAt: c.createdAt.toISOString(),
      })
    )
  );
}
