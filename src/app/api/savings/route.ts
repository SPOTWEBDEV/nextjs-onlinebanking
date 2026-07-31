import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/current-user.server";
import { serializeSavingsGoal } from "@/lib/serializers.server";

export async function GET() {
  const userId = await getCurrentUserId();
  const goals = await prisma.savingsGoal.findMany({ where: { userId } });
  return NextResponse.json(goals.map(serializeSavingsGoal));
}
