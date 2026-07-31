import { NextRequest, NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { serializeTransaction } from "@/lib/serializers.server";

export async function POST(request: NextRequest) {
  const body = (await request.json()) as {
    fromAccountId: string;
    beneficiaryId: string;
    amount: number;
    note?: string;
  };

  const beneficiary = await prisma.beneficiary.findUniqueOrThrow({ where: { id: body.beneficiaryId } });

  try {
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

      return tx.transaction.create({
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
    });

    return NextResponse.json(serializeTransaction(transaction));
  } catch (err) {
    if (err instanceof Error && err.message === "INSUFFICIENT_FUNDS") {
      return NextResponse.json({ error: "Insufficient available balance" }, { status: 400 });
    }
    console.error(err);
    return NextResponse.json({ error: "Transfer failed" }, { status: 500 });
  }
}
