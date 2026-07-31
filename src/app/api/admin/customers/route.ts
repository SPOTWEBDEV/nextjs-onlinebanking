import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { serializeAdminCustomer } from "@/lib/serializers.server";

export async function GET() {
  const customers = await prisma.adminCustomerView.findMany({ orderBy: { joined: "desc" } });
  return NextResponse.json(customers.map(serializeAdminCustomer));
}

export async function POST(request: NextRequest) {
  const { name, email } = (await request.json()) as { name: string; email: string };
  const customer = await prisma.adminCustomerView.create({
    data: { name, email, status: "active", kyc: "pending", balance: 0 },
  });
  return NextResponse.json(serializeAdminCustomer(customer), { status: 201 });
}
