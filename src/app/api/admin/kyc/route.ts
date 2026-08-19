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

    const users = await prisma.user.findMany({
      where: { kycStatus: { in: ["unverified", "pending"] } },
      orderBy: { createdAt: "asc" },
      select: {
        id: true,
        fullName: true,
        email: true,
        kycStatus: true,
        emailVerified: true,
        phoneVerified: true,
        createdAt: true,
      },
    });

    return NextResponse.json(
      users.map(
        (u: {
          id: string;
          fullName: string;
          email: string;
          kycStatus: string;
          emailVerified: boolean;
          phoneVerified: boolean;
          createdAt: Date;
        }) => ({
          id: u.id,
          name: u.fullName,
          email: u.email,
          kycStatus: u.kycStatus,
          emailVerified: u.emailVerified,
          phoneVerified: u.phoneVerified,
          submitted: u.createdAt.toISOString().slice(0, 10),
        })
      )
    );

  } catch (err) {
    return handleApiError(err, "get kyc");
  }
}
