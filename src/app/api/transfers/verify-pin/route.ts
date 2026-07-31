import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/current-user.server";

export async function POST(request: NextRequest) {
  const { pin } = (await request.json()) as { pin: string };
  const userId = await getCurrentUserId();
  const user = await prisma.user.findUniqueOrThrow({ where: { id: userId } });

  // Demo only: the PIN is stored/compared in plain text here. In production
  // this must be a salted hash comparison (e.g. bcrypt/argon2), never a
  // plain-text match.
  const valid = user.transferPinHash === pin;
  return NextResponse.json(valid);
}
