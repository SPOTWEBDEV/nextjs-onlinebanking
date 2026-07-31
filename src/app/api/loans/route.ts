import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/current-user.server";
import { serializeLoanApplication, serializeLoanProduct } from "@/lib/serializers.server";

export async function GET() {
  const userId = await getCurrentUserId();
  const [applications, products] = await Promise.all([
    prisma.loanApplication.findMany({ where: { userId }, include: { product: true }, orderBy: { createdAt: "desc" } }),
    prisma.loanProduct.findMany(),
  ]);

  return NextResponse.json({
    applications: applications.map(serializeLoanApplication),
    products: products.map(serializeLoanProduct),
  });
}

export async function POST(request: NextRequest) {
  const userId = await getCurrentUserId();
  const { productId, amount, termMonths } = (await request.json()) as {
    productId: string;
    amount: number;
    termMonths: number;
  };

  const product = await prisma.loanProduct.findUniqueOrThrow({ where: { id: productId } });
  const monthlyRate = Number(product.rate) / 100 / 12;
  const nextPaymentAmount =
    monthlyRate > 0
      ? (amount * monthlyRate * Math.pow(1 + monthlyRate, termMonths)) / (Math.pow(1 + monthlyRate, termMonths) - 1)
      : amount / termMonths;

  const application = await prisma.loanApplication.create({
    data: {
      userId,
      productId,
      amount,
      termMonths,
      status: "pending",
      nextPaymentDate: new Date(Date.now() + 30 * 86400000),
      nextPaymentAmount: Math.round(nextPaymentAmount * 100) / 100,
      remainingBalance: amount,
    },
    include: { product: true },
  });

  return NextResponse.json(serializeLoanApplication(application), { status: 201 });
}
