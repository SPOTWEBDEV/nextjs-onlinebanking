import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/current-admin.server";
import { notifyUser } from "@/lib/notify.server";
import { handleApiError } from "@/lib/api-error";

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const requester = await getCurrentAdmin(request);
    if (!requester) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { id } = await params;
    const { action } = (await request.json()) as { action: "approve" | "reject" };

    const user = await prisma.user.update({
      where: { id },
      data: { kycStatus: action === "approve" ? "verified" : "rejected" },
    });

    await notifyUser(
      user.id,
      action === "approve" ? "Identity verified" : "Identity verification rejected",
      action === "approve" ? "Your identity has been verified." : "Please resubmit your documents.",
      "security"
    );

    return NextResponse.json({ id: user.id, kycStatus: user.kycStatus });
  } catch (err) {
    return handleApiError(err, "resolve KYC");
  }
}
