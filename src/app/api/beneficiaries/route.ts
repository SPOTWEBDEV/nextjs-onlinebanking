import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/current-user.server";
import { serializeBeneficiary } from "@/lib/serializers.server";
import { handleApiError } from "@/lib/api-error";

export async function GET(request: NextRequest) {
  try {
    const userId = await getCurrentUserId(request);
    const beneficiaries = await prisma.beneficiary.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(beneficiaries.map(serializeBeneficiary));

  } catch (err) {
    return handleApiError(err, "get beneficiaries");
  }
}

export async function POST(request: NextRequest) {
  try {
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

  } catch (err) {
    return handleApiError(err, "post beneficiaries");
  }
}
