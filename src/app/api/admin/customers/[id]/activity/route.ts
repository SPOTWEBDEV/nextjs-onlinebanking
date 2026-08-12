import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/current-admin.server";
import { serializeTransaction } from "@/lib/serializers.server";
import { notifyUser } from "@/lib/notify.server";
import { formatCurrency } from "@/lib/utils";
import { handleApiError } from "@/lib/api-error";

// Lets an admin log a manual account activity (a credit or debit
// adjustment) directly onto a customer's primary account — e.g. a goodwill
// credit, a fee reversal, or correcting an error. Unlike customer-initiated
// deposits, this is completed immediately since an admin is directly
// authorizing it.
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const requester = await getCurrentAdmin(request);
    if (!requester) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { id } = await params;
    const { type, amount, description } = (await request.json()) as {
      type: "credit" | "debit";
      amount: number;
      description: string;
    };

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Enter an amount greater than 0" }, { status: 400 });
    }
    if (!description) {
      return NextResponse.json({ error: "Enter a description for this activity" }, { status: 400 });
    }

    const account = await prisma.account.findFirst({ where: { userId: id }, orderBy: { createdAt: "asc" } });
    if (!account) {
      return NextResponse.json({ error: "This customer has no account to apply the activity to" }, { status: 404 });
    }

    if (type === "debit" && Number(account.availableBalance) < amount) {
      return NextResponse.json({ error: "Insufficient balance for this debit" }, { status: 400 });
    }

    const balanceUpdate = type === "credit" ? { increment: amount } : { decrement: amount };

    const [transaction] = await prisma.$transaction([
      prisma.transaction.create({
        data: {
          accountId: account.id,
          description,
          counterparty: "Banco Aurora Admin",
          category: "adjustment",
          type,
          amount,
          currency: account.currency,
          status: "completed",
          reference: `ADJ-${Date.now().toString().slice(-8)}`,
        },
      }),
      prisma.account.update({
        where: { id: account.id },
        data: { balance: balanceUpdate, availableBalance: balanceUpdate, ledgerBalance: balanceUpdate },
      }),
    ]);

    await notifyUser(
      id,
      type === "credit" ? "Account credited" : "Account debited",
      `${description} — ${formatCurrency(amount, account.currency)}`,
      "transaction"
    );

    return NextResponse.json(serializeTransaction(transaction), { status: 201 });
  } catch (err) {
    return handleApiError(err, "add customer activity");
  }
}
