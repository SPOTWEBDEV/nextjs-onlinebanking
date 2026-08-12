import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { issueVerificationCode } from "@/lib/otp.server";
import type { VerificationPurpose } from "@prisma/client";

export async function POST(request: NextRequest) {
  const { userId, purpose } = (await request.json()) as { userId: string; purpose: VerificationPurpose };

  const user = await prisma.user.findUniqueOrThrow({ where: { id: userId } });
  const destination = purpose === "email" ? user.email : user.phone;

  await issueVerificationCode(userId, purpose, destination);
  return NextResponse.json({ ok: true });
}
