import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { serializeBeneficiary } from "@/lib/serializers.server";

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const existing = await prisma.beneficiary.findUniqueOrThrow({ where: { id } });
  const updated = await prisma.beneficiary.update({
    where: { id },
    data: { favourite: !existing.favourite },
  });
  return NextResponse.json(serializeBeneficiary(updated));
}
