import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/current-user.server";
import { serializeSavingsGoal } from "@/lib/serializers.server";
import { handleApiError } from "@/lib/api-error";

export async function GET(request: NextRequest) {
  try {
    const userId = await getCurrentUserId(request);
    const goals = await prisma.savingsGoal.findMany({ where: { userId } });
    return NextResponse.json(goals.map(serializeSavingsGoal));

  } catch (err) {
    return handleApiError(err, "get savings");
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await getCurrentUserId(request);
    const { name, target, emoji, type } = (await request.json()) as {
      name: string;
      target: number;
      emoji: string;
      type: "flexible" | "fixed" | "auto";
    };

    if (!name || !target || target <= 0) {
      return NextResponse.json({ error: "Enter a name and a target amount greater than 0" }, { status: 400 });
    }

    const goal = await prisma.savingsGoal.create({
      data: {
        userId,
        name,
        target,
        saved: 0,
        emoji: emoji || "🎯",
        type: type || "flexible",
      },
    });

    return NextResponse.json(serializeSavingsGoal(goal), { status: 201 });

  } catch (err) {
    return handleApiError(err, "post savings");
  }
}
