import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { serializeAdminCustomer } from "@/lib/serializers.server";

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = (await request.json()) as { status?: "active" | "suspended" | "frozen"; kyc?: "verified" };

  const customer = await prisma.adminCustomerView.update({
    where: { id },
    data: {
      ...(body.status ? { status: body.status } : {}),
      ...(body.kyc ? { kyc: body.kyc } : {}),
    },
  });
  return NextResponse.json(serializeAdminCustomer(customer));
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.adminCustomerView.delete({ where: { id } });
  return NextResponse.json({ id });
}
