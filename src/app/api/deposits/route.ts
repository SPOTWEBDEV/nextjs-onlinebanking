import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/current-user.server";
import { serializeTransaction } from "@/lib/serializers.server";
import { notifyUser } from "@/lib/notify.server";
import { formatCurrency } from "@/lib/utils";
import { handleApiError } from "@/lib/api-error";

export async function POST(request: NextRequest) {
  try {
    const userId = await getCurrentUserId(request);
    const body = (await request.json()) as {
      accountId: string;
      method: "crypto" | "giftcard" | "card" | "manual";
      amount?: number;
      cryptoCurrency?: "BTC" | "ETH" | "USDT";
      giftCardCode?: string;
      giftCardProvider?: string;
      cardLast4?: string;
      paymentAccountId?: string;
      reference?: string;
    };

    const account = await prisma.account.findFirst({ where: { id: body.accountId, userId } });
    if (!account) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }

    // ---------- Gift card: instant, like card payments ----------
    if (body.method === "giftcard") {
      const code = (body.giftCardCode ?? "").replace(/\s/g, "");
      if (code.length < 10) {
        return NextResponse.json({ error: "Enter a valid gift card code (at least 10 characters)" }, { status: 400 });
      }
      if (!body.amount || body.amount <= 0) {
        return NextResponse.json({ error: "Select a gift card value" }, { status: 400 });
      }

      const provider = body.giftCardProvider ?? "Gift card";
      const [transaction] = await prisma.$transaction([
        prisma.transaction.create({
          data: {
            accountId: account.id,
            description: `${provider} gift card redeemed`,
            counterparty: provider,
            category: "deposit",
            type: "credit",
            amount: body.amount,
            currency: account.currency,
            status: "completed",
            reference: `GC-${Date.now().toString().slice(-8)}`,
          },
        }),
        prisma.account.update({
          where: { id: account.id },
          data: {
            balance: { increment: body.amount },
            availableBalance: { increment: body.amount },
            ledgerBalance: { increment: body.amount },
          },
        }),
      ]);

      await notifyUser(userId, "Gift card redeemed", `${formatCurrency(body.amount, account.currency)} added to your account`, "transaction");
      return NextResponse.json(serializeTransaction(transaction), { status: 201 });
    }

    // ---------- Card / Paystack-style: automatic, instant settlement ----------
    // Real Paystack (or Stripe, etc.) integration verifies the charge via a
    // webhook before crediting — this demo doesn't hold real card credentials
    // or a payment gateway API key, so it simulates the *outcome* of that
    // flow (instant, no admin step) rather than actually processing a card.
    if (body.method === "card") {
      if (!body.amount || body.amount <= 0) {
        return NextResponse.json({ error: "Enter an amount greater than 0" }, { status: 400 });
      }

      const [transaction] = await prisma.$transaction([
        prisma.transaction.create({
          data: {
            accountId: account.id,
            description: `Card deposit${body.cardLast4 ? ` •••• ${body.cardLast4}` : ""}`,
            counterparty: "Card payment (Paystack)",
            category: "deposit",
            type: "credit",
            amount: body.amount,
            currency: account.currency,
            status: "completed",
            reference: `PS-${Date.now().toString().slice(-8)}`,
          },
        }),
        prisma.account.update({
          where: { id: account.id },
          data: {
            balance: { increment: body.amount },
            availableBalance: { increment: body.amount },
            ledgerBalance: { increment: body.amount },
          },
        }),
      ]);

      await notifyUser(userId, "Card deposit successful", `${formatCurrency(body.amount, account.currency)} added instantly`, "transaction");
      return NextResponse.json(serializeTransaction(transaction), { status: 201 });
    }

    // ---------- Manual bank transfer: always pending, admin-reviewed ----------
    if (body.method === "manual") {
      if (!body.amount || body.amount <= 0) {
        return NextResponse.json({ error: "Enter an amount greater than 0" }, { status: 400 });
      }
      if (!body.paymentAccountId) {
        return NextResponse.json({ error: "Choose which account you sent the payment to" }, { status: 400 });
      }

      const paymentAccount = await prisma.paymentAccount.findFirst({
        where: { id: body.paymentAccountId, active: true },
      });
      if (!paymentAccount) {
        return NextResponse.json({ error: "That payment account is no longer available" }, { status: 404 });
      }

      const transaction = await prisma.transaction.create({
        data: {
          accountId: account.id,
          description: `Manual deposit — ${paymentAccount.label}`,
          counterparty: paymentAccount.label,
          category: "deposit",
          type: "credit",
          amount: body.amount,
          currency: account.currency,
          status: "pending",
          reference: body.reference?.slice(0, 40) || `MT-${Date.now().toString().slice(-8)}`,
        },
      });

      await notifyUser(userId, "Deposit submitted", `${formatCurrency(body.amount, account.currency)} submitted for admin review`, "transaction");
      return NextResponse.json(serializeTransaction(transaction), { status: 201 });
    }

    // ---------- Crypto: manual, held pending until confirmed ----------
    // Created as pending; real confirmation would come from a blockchain
    // webhook. In this demo it's confirmed via
    // POST /api/transactions/[id]/resolve, either by the user's "simulate
    // confirmation" button or by an admin on the Transaction Management page.
    if (!body.amount || body.amount <= 0) {
      return NextResponse.json({ error: "Enter an amount greater than 0" }, { status: 400 });
    }

    const currency = body.cryptoCurrency ?? "BTC";
    const walletAddress = `bc1${Math.random().toString(36).slice(2, 15)}${Math.random().toString(36).slice(2, 15)}`;

    const transaction = await prisma.transaction.create({
      data: {
        accountId: account.id,
        description: `${currency} deposit`,
        counterparty: `Crypto deposit (${currency})`,
        category: "deposit",
        type: "credit",
        amount: body.amount,
        currency: account.currency,
        status: "pending",
        reference: `CR-${Date.now().toString().slice(-8)}`,
      },
    });

    await notifyUser(userId, "Crypto deposit created", `Awaiting confirmation for ${formatCurrency(body.amount, account.currency)}`, "transaction");
    return NextResponse.json({ ...serializeTransaction(transaction), walletAddress }, { status: 201 });
  } catch (err) {
    return handleApiError(err, "create deposit");
  }
}
