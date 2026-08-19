import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/current-admin.server";
import { handleApiError } from "@/lib/api-error";

export async function GET(request: NextRequest) {
  try {
    const requester = await getCurrentAdmin(request);
    if (!requester) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const [applications, products] = await Promise.all([
      prisma.loanApplication.findMany({
        orderBy: { createdAt: "desc" },
        include: { product: true, user: { select: { fullName: true, email: true } } },
      }),
      prisma.loanProduct.findMany(),
    ]);

    const active = applications.filter((l: { status: string }) => l.status === "active").length;
    const pending = applications.filter((l: { status: string }) => l.status === "pending").length;
    const approved = applications.filter((l: { status: string }) => l.status === "approved").length;
    const rejected = applications.filter((l: { status: string }) => l.status === "rejected").length;

    return NextResponse.json({
      stats: { total: applications.length, active, pending, approved, rejected },
      applications: applications.map(
        (l: {
          id: string;
          amount: unknown;
          remainingBalance: unknown;
          status: string;
          product: { name: string };
          user: { fullName: string; email: string };
        }) => ({
          id: l.id,
          productName: l.product.name,
          amount: Number(l.amount),
          remainingBalance: Number(l.remainingBalance),
          status: l.status,
          ownerName: l.user.fullName,
          ownerEmail: l.user.email,
        })
      ),
      products: products.map((p: { id: string; name: string; rate: unknown; maxAmount: unknown }) => ({
        id: p.id,
        name: p.name,
        rate: Number(p.rate),
        maxAmount: Number(p.maxAmount),
      })),
    });
  } catch (err) {
    return handleApiError(err, "get all loans (admin)");
  }
}
