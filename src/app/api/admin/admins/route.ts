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

    const admins = await prisma.admin.findMany({ orderBy: { createdAt: "asc" } });
    const usersCreated = await prisma.user.groupBy({
      by: ["createdBy"],
      _count: { id: true },
    });
    const countByAdminId = new Map(
      usersCreated.map((u: { createdBy: string | null; _count: { id: number } }) => [u.createdBy, u._count.id])
    );

    return NextResponse.json(
      admins.map(
        (a: {
          id: string;
          fullName: string;
          email: string;
          role: string;
          status: string;
          suspensionReason: string | null;
          createdAt: Date;
        }) => ({
          id: a.id,
          fullName: a.fullName,
          email: a.email,
          role: a.role,
          status: a.status,
          suspensionReason: a.suspensionReason,
          createdAt: a.createdAt.toISOString().slice(0, 10),
          usersCreated: countByAdminId.get(a.id) ?? 0,
        })
      )
    );
  } catch (err) {
    return handleApiError(err, "fetch admins");
  }
}
