import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { serializeSavingsGoal } from "@/lib/serializers.server";

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { amount } = (await request.json()) as { amount: number };

  const goal = await prisma.savingsGoal.findUniqueOrThrow({ where: { id } });
  const newSaved = Math.min(Number(goal.target), Number(goal.saved) + amount);

  const updated = await prisma.savingsGoal.update({ where: { id }, data: { saved: newSaved } });
  return NextResponse.json(serializeSavingsGoal(updated));
}
