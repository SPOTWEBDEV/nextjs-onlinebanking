import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/current-admin.server";
import { handleApiError } from "@/lib/api-error";

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const requester = await getCurrentAdmin(request);
    if (!requester) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    if (requester.role !== "super_admin") {
      return NextResponse.json({ error: "Only super admins can manage admins" }, { status: 403 });
    }
    if (id === requester.id) {
      return NextResponse.json({ error: "You cannot suspend your own account" }, { status: 400 });
    }

    const { status, reason } = (await request.json()) as { status: "active" | "suspended"; reason?: string };

    const target = await prisma.admin.findUniqueOrThrow({ where: { id } });
    if (target.role === "super_admin" && status === "suspended") {
      return NextResponse.json({ error: "Super admins cannot be suspended" }, { status: 400 });
    }

    const admin = await prisma.admin.update({
      where: { id },
      data: {
        status,
        suspensionReason: status === "suspended" ? reason || "No reason provided" : null,
      },
    });

    return NextResponse.json({
      id: admin.id,
      status: admin.status,
      suspensionReason: admin.suspensionReason,
    });
  } catch (err) {
    return handleApiError(err, "update admin status");
  }
}
