import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/current-user.server";
import { serializeBeneficiary } from "@/lib/serializers.server";

export async function GET(request: NextRequest) {
  const userId = await getCurrentUserId(request);
  const beneficiaries = await prisma.beneficiary.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(beneficiaries.map(serializeBeneficiary));
}

export async function POST(request: NextRequest) {
  const userId = await getCurrentUserId(request);
  const body = await request.json();

  const beneficiary = await prisma.beneficiary.create({
    data: {
      userId,
      name: body.name,
      bank: body.bank,
      accountNumber: body.accountNumber,
      currency: body.currency ?? "EUR",
      type: body.type,
    },
  });

  return NextResponse.json(serializeBeneficiary(beneficiary), { status: 201 });
}
