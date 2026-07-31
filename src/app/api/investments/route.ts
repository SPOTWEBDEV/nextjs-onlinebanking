import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const holdings = await prisma.investmentHolding.findMany();
  return NextResponse.json(
    holdings.map(
      (h: { id: string; name: string; ticker: string; units: unknown; value: unknown; costBasis: unknown; changePct: unknown }) => ({
        id: h.id,
        name: h.name,
        ticker: h.ticker,
        units: Number(h.units),
        value: Number(h.value),
        costBasis: Number(h.costBasis),
        changePct: Number(h.changePct),
      })
    )
  );
}
