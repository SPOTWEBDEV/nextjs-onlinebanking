import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/current-admin.server";
import { serializeAdminCustomer } from "@/lib/serializers.server";
import { initials } from "@/lib/utils";
import { maskEmail, maskPhone } from "@/lib/mask";
import { handleApiError } from "@/lib/api-error";

function randomPassword() {
  return Math.random().toString(36).slice(2, 8) + Math.random().toString(36).slice(2, 6).toUpperCase() + "!1";
}

export async function GET(request: NextRequest) {
  try {
    const requester = await getCurrentAdmin(request);
    if (!requester) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      include: { accounts: { select: { balance: true } } },
    });

    // The list view always shows masked contact details — only opening a
    // specific customer's record (subject to the ownership check) reveals
    // the full email/phone.
    const customers = users.map((u: typeof users[number]) => {
      const balance = u.accounts.reduce((sum: number, a: { balance: unknown }) => sum + Number(a.balance), 0);
      const serialized = serializeAdminCustomer(u, balance);
      return { ...serialized, email: maskEmail(serialized.email), phone: maskPhone(serialized.phone) };
    });

    return NextResponse.json(customers);

  } catch (err) {
    return handleApiError(err, "get customers");
  }
}

export async function POST(request: NextRequest) {
  try {
    const requester = await getCurrentAdmin(request);
    if (!requester) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const body = (await request.json()) as {
      name: string;
      email: string;
      phone?: string;
      initialDeposit?: number;
      specialNeeds?: string[];
    };

    const existing = await prisma.user.findUnique({ where: { email: body.email } });
    if (existing) {
      return NextResponse.json({ error: "A customer with this email already exists" }, { status: 409 });
    }

    const tempPassword = randomPassword();
    const passwordHash = await bcrypt.hash(tempPassword, 10);
    const initialBalance = body.initialDeposit && body.initialDeposit > 0 ? body.initialDeposit : 0;

    const user = await prisma.user.create({
      data: {
        fullName: body.name,
        email: body.email,
        phone: body.phone || "+351 000 000 000",
        passwordHash,
        avatarInitials: initials(body.name),
        kycStatus: "unverified",
        tier: "standard",
        status: "active",
        securityScore: 40,
        transferPinHash: "1234",
        emailVerified: false,
        phoneVerified: false,
        specialNeeds: body.specialNeeds ?? [],
        // This is the ownership record the "only the creating admin can view
        // full details" restriction is built on.
        createdBy: requester.id,
      },
    });

    await prisma.account.create({
      data: {
        userId: user.id,
        nickname: "Conta Corrente",
        type: "current",
        accountNumber: `${Math.floor(1000 + Math.random() * 8999)} ${Math.floor(1000 + Math.random() * 8999)}`,
        iban: `PT50 0035 0${Math.floor(100 + Math.random() * 899)} 000${Math.floor(1000 + Math.random() * 8999)}`,
        nib: `0035 0${Math.floor(100 + Math.random() * 899)} 0000${Math.floor(100000 + Math.random() * 899999)} 00`,
        swiftCode: "AURAPTPL",
        currency: "EUR",
        balance: initialBalance,
        availableBalance: initialBalance,
        ledgerBalance: initialBalance,
        status: "active",
      },
    });

    return NextResponse.json(
      { ...serializeAdminCustomer(user, initialBalance), tempPassword },
      { status: 201 }
    );

  } catch (err) {
    return handleApiError(err, "post customers");
  }
}
