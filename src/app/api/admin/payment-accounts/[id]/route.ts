import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/current-admin.server";
import { serializePaymentAccount } from "@/lib/serializers.server";

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const requester = await getCurrentAdmin(request);
  if (!requester) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { id } = await params;
  const { active } = (await request.json()) as { active: boolean };
  const account = await prisma.paymentAccount.update({ where: { id }, data: { active } });
  return NextResponse.json(serializePaymentAccount(account));
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const requester = await getCurrentAdmin(request);
  if (!requester) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { id } = await params;
  await prisma.paymentAccount.delete({ where: { id } });
  return NextResponse.json({ id });
}
