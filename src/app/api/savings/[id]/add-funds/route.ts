import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/current-user.server";
import { serializeSavingsGoal } from "@/lib/serializers.server";
import { notifyUser } from "@/lib/notify.server";
import { formatCurrency } from "@/lib/utils";
import { handleApiError } from "@/lib/api-error";

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const userId = await getCurrentUserId(request);
    const { amount, accountId } = (await request.json()) as { amount: number; accountId: string };

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Enter an amount greater than 0" }, { status: 400 });
    }
    if (!accountId) {
      return NextResponse.json({ error: "Choose which account to fund this from" }, { status: 400 });
    }

    const goal = await prisma.savingsGoal.findFirst({ where: { id, userId } });
    if (!goal) {
      return NextResponse.json({ error: "Savings goal not found" }, { status: 404 });
    }

    const account = await prisma.account.findFirst({ where: { id: accountId, userId } });
    if (!account) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }

    // This is the fix: actually check the account has enough available
    // balance before moving money into the goal, instead of conjuring funds
    // from nowhere.
    if (Number(account.availableBalance) < amount) {
      return NextResponse.json({ error: "Insufficient available balance in that account" }, { status: 400 });
    }

    const cappedAmount = Math.min(Number(goal.target) - Number(goal.saved), amount);

    const [updatedGoal] = await prisma.$transaction([
      prisma.savingsGoal.update({ where: { id: goal.id }, data: { saved: { increment: cappedAmount } } }),
      prisma.account.update({
        where: { id: account.id },
        data: {
          balance: { decrement: cappedAmount },
          availableBalance: { decrement: cappedAmount },
          ledgerBalance: { decrement: cappedAmount },
        },
      }),
      prisma.transaction.create({
        data: {
          accountId: account.id,
          description: `Transfer to ${goal.name}`,
          counterparty: goal.name,
          category: "savings",
          type: "debit",
          amount: cappedAmount,
          currency: account.currency,
          status: "completed",
          reference: `SAV-${Date.now().toString().slice(-8)}`,
        },
      }),
    ]);

    await notifyUser(userId, "Added to savings goal", `${formatCurrency(cappedAmount, account.currency)} moved into ${goal.name}`, "transaction");

    return NextResponse.json(serializeSavingsGoal(updatedGoal));
  } catch (err) {
    return handleApiError(err, "add funds to savings goal");
  }
}
