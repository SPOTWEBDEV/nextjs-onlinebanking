import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { issueVerificationCode, verifyCode } from "@/lib/otp.server";
import type { VerificationPurpose } from "@prisma/client";

export async function POST(request: NextRequest) {
  const { userId, code, purpose } = (await request.json()) as {
    userId: string;
    code: string;
    purpose: VerificationPurpose;
  };

  if (!userId || !code || !purpose) {
    return NextResponse.json({ error: "Missing userId, code, or purpose" }, { status: 400 });
  }

  const valid = await verifyCode(userId, purpose, code);
  if (!valid) {
    return NextResponse.json({ error: "Invalid or expired code" }, { status: 401 });
  }

  const updateData = purpose === "email" ? { emailVerified: true } : purpose === "phone" ? { phoneVerified: true } : {};

  const user = await prisma.user.update({
    where: { id: userId },
    data: updateData,
  });

  // Verifying email is the trigger for the next step in the registration
  // chain: issue the phone verification code now, so it actually exists in
  // the database by the time the user reaches /verify-phone.
  if (purpose === "email") {
    await issueVerificationCode(userId, "phone", user.phone);
  }

  return NextResponse.json({
    verified: true,
    user: {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      avatarInitials: user.avatarInitials,
      kycStatus: user.kycStatus,
      tier: user.tier,
      securityScore: user.securityScore,
    },
  });
}
