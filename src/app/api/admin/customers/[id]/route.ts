import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/current-admin.server";
import { serializeAdminCustomer } from "@/lib/serializers.server";
import { notifyUser } from "@/lib/notify.server";
import { handleApiError } from "@/lib/api-error";

// Full customer detail — gated by ownership. Only the admin who created
// this customer (or a super admin, who can see everyone) may view full,
// unmasked details. Self-registered customers (createdBy === null or a
// value that doesn't match any admin) aren't owned by anyone in
// particular, so any admin can view those.
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const requester = await getCurrentAdmin(request);
    if (!requester) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const user = await prisma.user.findUniqueOrThrow({
      where: { id },
      include: { accounts: { select: { balance: true } } },
    });

    const wasAdminCreated = !!user.createdBy && user.createdBy !== "self";
    const isOwner = user.createdBy === requester.id;
    const canView = requester.role === "super_admin" || !wasAdminCreated || isOwner;

    if (!canView) {
      return NextResponse.json(
        { error: "Cannot view details — you are not the admin who created this user." },
        { status: 403 }
      );
    }

    const balance = user.accounts.reduce((sum: number, a: { balance: unknown }) => sum + Number(a.balance), 0);
    return NextResponse.json(serializeAdminCustomer(user, balance));
  } catch (err) {
    return handleApiError(err, "fetch customer detail");
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const requester = await getCurrentAdmin(request);
    if (!requester) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const body = (await request.json()) as {
      status?: "active" | "suspended" | "frozen";
      kyc?: "verified" | "rejected";
      specialNeeds?: string[];
    };

    const user = await prisma.user.update({
      where: { id },
      data: {
        ...(body.status ? { status: body.status } : {}),
        ...(body.kyc ? { kycStatus: body.kyc } : {}),
        ...(body.specialNeeds ? { specialNeeds: body.specialNeeds } : {}),
      },
      include: { accounts: { select: { balance: true } } },
    });

    if (body.status) {
      await notifyUser(
        user.id,
        body.status === "active" ? "Account activated" : body.status === "suspended" ? "Account suspended" : "Account frozen",
        body.status === "active" ? "Your account access has been restored." : "Contact support for details.",
        "security"
      );
    }

    const balance = user.accounts.reduce((sum: number, a: { balance: unknown }) => sum + Number(a.balance), 0);
    return NextResponse.json(serializeAdminCustomer(user, balance));
  } catch (err) {
    return handleApiError(err, "update customer");
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const requester = await getCurrentAdmin(request);
    if (!requester) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const user = await prisma.user.findUniqueOrThrow({ where: { id } });

    // LoginAttempt isn't a foreign-key relation (just stores the email
    // string), so it won't cascade-delete with the user like
    // accounts/transactions/cards/etc. do — clean it up explicitly so
    // "delete everything about this user" is actually true.
    await prisma.loginAttempt.deleteMany({ where: { email: user.email } });
    await prisma.user.delete({ where: { id } });

    return NextResponse.json({ id });
  } catch (err) {
    return handleApiError(err, "delete customer");
  }
}
