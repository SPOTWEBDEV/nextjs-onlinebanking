import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/current-user.server";
import { handleApiError } from "@/lib/api-error";

export async function GET(request: NextRequest) {
  try {
    const userId = await getCurrentUserId(request);
    const user = await prisma.user.findUniqueOrThrow({ where: { id: userId } });

    return NextResponse.json({
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      avatarInitials: user.avatarInitials,
      kycStatus: user.kycStatus,
      tier: user.tier,
      securityScore: user.securityScore,
      emailVerified: user.emailVerified,
      phoneVerified: user.phoneVerified,
    });

  } catch (err) {
    return handleApiError(err, "get me");
  }
}
