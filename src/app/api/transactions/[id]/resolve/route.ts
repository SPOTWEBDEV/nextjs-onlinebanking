import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { serializeTransaction } from "@/lib/serializers.server";
import { notifyUser } from "@/lib/notify.server";
import { formatCurrency } from "@/lib/utils";
import { handleApiError } from "@/lib/api-error";

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { action } = (await request.json()) as { action: "approve" | "reject" };

    const transaction = await prisma.transaction.findUniqueOrThrow({
      where: { id },
      include: { account: { select: { userId: true, currency: true } } },
    });

    if (transaction.status !== "pending") {
      return NextResponse.json({ error: "Only pending transactions can be resolved" }, { status: 400 });
    }

    if (action === "reject") {
      const updated = await prisma.transaction.update({ where: { id }, data: { status: "failed" } });
      await notifyUser(
        transaction.account.userId,
        "Transaction rejected",
        `${transaction.description} (${formatCurrency(Number(transaction.amount), transaction.currency)}) was rejected`,
        "transaction"
      );
      return NextResponse.json(serializeTransaction(updated));
    }

    // Approve: mark completed and actually move the money.
    const amount = Number(transaction.amount);
    const balanceUpdate = transaction.type === "credit" ? { increment: amount } : { decrement: amount };

    const [updated] = await prisma.$transaction([
      prisma.transaction.update({ where: { id }, data: { status: "completed" } }),
      prisma.account.update({
        where: { id: transaction.accountId },
        data: {
          balance: balanceUpdate,
          availableBalance: balanceUpdate,
          ledgerBalance: balanceUpdate,
        },
      }),
    ]);

    await notifyUser(
      transaction.account.userId,
      "Deposit confirmed",
      `${formatCurrency(amount, transaction.currency)} added to your account`,
      "transaction"
    );

    return NextResponse.json(serializeTransaction(updated));
  } catch (err) {
    return handleApiError(err, "resolve transaction");
  }
}
