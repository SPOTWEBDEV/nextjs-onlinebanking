import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/current-admin.server";
import { serializePaymentAccount } from "@/lib/serializers.server";

export async function GET(request: NextRequest) {
  const requester = await getCurrentAdmin(request);
  if (!requester) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const accounts = await prisma.paymentAccount.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(accounts.map(serializePaymentAccount));
}

export async function POST(request: NextRequest) {
  const requester = await getCurrentAdmin(request);
  if (!requester) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const body = (await request.json()) as {
    label: string;
    type: "bank" | "crypto" | "mobile_money";
    details: string;
    currency?: string;
  };

  if (!body.label || !body.details) {
    return NextResponse.json({ error: "Label and details are required" }, { status: 400 });
  }

  const account = await prisma.paymentAccount.create({
    data: {
      label: body.label,
      type: body.type,
      details: body.details,
      currency: body.currency ?? "EUR",
      active: true,
    },
  });

  return NextResponse.json(serializePaymentAccount(account), { status: 201 });
}
