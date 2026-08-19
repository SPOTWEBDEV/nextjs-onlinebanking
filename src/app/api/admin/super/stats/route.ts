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
    if (requester.role !== "super_admin") {
      return NextResponse.json({ error: "Only super admins can view this" }, { status: 403 });
    }

    const [totalAdmins, totalUsers, activeUsers, suspendedUsers, frozenUsers, pendingKyc, totalPaymentAccounts] =
      await Promise.all([
        prisma.admin.count(),
        prisma.user.count(),
        prisma.user.count({ where: { status: "active" } }),
        prisma.user.count({ where: { status: "suspended" } }),
        prisma.user.count({ where: { status: "frozen" } }),
        prisma.user.count({ where: { kycStatus: "pending" } }),
        prisma.paymentAccount.count({ where: { active: true } }),
      ]);

    return NextResponse.json({
      totalAdmins,
      totalUsers,
      activeUsers,
      suspendedUsers,
      frozenUsers,
      pendingKyc,
      totalPaymentAccounts,
    });

  } catch (err) {
    return handleApiError(err, "get stats");
  }
}
