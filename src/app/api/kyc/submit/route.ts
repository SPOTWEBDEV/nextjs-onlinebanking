import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/current-user.server";
import { notifyUser } from "@/lib/notify.server";
import { handleApiError } from "@/lib/api-error";

export async function POST(request: NextRequest) {
  try {
    const userId = await getCurrentUserId(request);
    const user = await prisma.user.findUniqueOrThrow({ where: { id: userId } });

    if (user.kycStatus === "verified") {
      return NextResponse.json({ error: "Your identity is already verified" }, { status: 400 });
    }

    const updated = await prisma.user.update({ where: { id: userId }, data: { kycStatus: "pending" } });

    await notifyUser(userId, "Documents submitted", "Your identity documents are with our review team.", "security");

    return NextResponse.json({ kycStatus: updated.kycStatus });
  } catch (err) {
    return handleApiError(err, "submit KYC documents");
  }
}
