import { NextRequest, NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { serializeTransaction } from "@/lib/serializers.server";
import { notifyUser } from "@/lib/notify.server";
import { formatCurrency } from "@/lib/utils";
import { handleApiError } from "@/lib/api-error";

export async function POST(request: NextRequest) {
  const body = (await request.json()) as {
    fromAccountId: string;
    beneficiaryId: string;
    amount: number;
    note?: string;
  };

  try {
    const beneficiary = await prisma.beneficiary.findUniqueOrThrow({ where: { id: body.beneficiaryId } });

    const transaction = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const account = await tx.account.findUniqueOrThrow({ where: { id: body.fromAccountId } });

      if (Number(account.availableBalance) < body.amount) {
        throw new Error("INSUFFICIENT_FUNDS");
      }

      await tx.account.update({
        where: { id: account.id },
        data: {
          balance: { decrement: body.amount },
          availableBalance: { decrement: body.amount },
          ledgerBalance: { decrement: body.amount },
        },
      });

      const created = await tx.transaction.create({
        data: {
          accountId: account.id,
          description: `Transferência para ${beneficiary.name}`,
          counterparty: beneficiary.name,
          category: "transfer",
          type: "debit",
          amount: body.amount,
          currency: account.currency,
          status: "completed",
          reference: `TRF-${Date.now().toString().slice(-8)}`,
        },
      });

      return { created, userId: account.userId, currency: account.currency };
    });

    await notifyUser(
      transaction.userId,
      "Transfer sent",
      `${formatCurrency(body.amount, transaction.currency)} to ${beneficiary.name}`,
      "transaction"
    );

    return NextResponse.json(serializeTransaction(transaction.created));
  } catch (err) {
    if (err instanceof Error && err.message === "INSUFFICIENT_FUNDS") {
      return NextResponse.json({ error: "Insufficient available balance" }, { status: 400 });
    }
    return handleApiError(err, "submit transfer");
  }
}
