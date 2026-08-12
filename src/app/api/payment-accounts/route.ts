import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { serializePaymentAccount } from "@/lib/serializers.server";

// Public (customer-facing) list of active payment accounts, shown on the
// "Bank Transfer" deposit tab.
export async function GET() {
  const accounts = await prisma.paymentAccount.findMany({
    where: { active: true },
    orderBy: { createdAt: "asc" },
  });
  return NextResponse.json(accounts.map(serializePaymentAccount));
}
