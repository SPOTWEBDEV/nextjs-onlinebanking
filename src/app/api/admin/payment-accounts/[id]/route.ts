import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/current-admin.server";
import { serializePaymentAccount } from "@/lib/serializers.server";
import { handleApiError } from "@/lib/api-error";

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const requester = await getCurrentAdmin(request);
    if (!requester) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { id } = await params;
    const { active } = (await request.json()) as { active: boolean };
    const account = await prisma.paymentAccount.update({ where: { id }, data: { active } });
    return NextResponse.json(serializePaymentAccount(account));

  } catch (err) {
    return handleApiError(err, "patch payment-accounts");
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const requester = await getCurrentAdmin(request);
    if (!requester) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { id } = await params;
    await prisma.paymentAccount.delete({ where: { id } });
    return NextResponse.json({ id });

  } catch (err) {
    return handleApiError(err, "delete payment-accounts");
  }
}
