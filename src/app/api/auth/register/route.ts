import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { issueVerificationCode } from "@/lib/otp.server";
import { initials } from "@/lib/utils";
import { handleApiError } from "@/lib/api-error";

export async function POST(request: NextRequest) {
  try {
    const { fullName, email, phone, password } = (await request.json()) as {
      fullName: string;
      email: string;
      phone: string;
      password: string;
    };

    if (!fullName || !email || !phone || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "An account with this email already exists" }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        fullName,
        email,
        phone,
        passwordHash,
        avatarInitials: initials(fullName),
        kycStatus: "unverified",
        tier: "standard",
        status: "active",
        securityScore: 40,
        // Demo default transfer PIN so the app is usable immediately after
        // signup. In production this should be set by the user, not defaulted.
        transferPinHash: "1234",
        createdBy: "self",
      },
    });

    // Give new customers a starter account so the dashboard isn't empty.
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
        balance: 0,
        availableBalance: 0,
        ledgerBalance: 0,
        status: "active",
      },
    });

    await issueVerificationCode(user.id, "email", email);

    return NextResponse.json({ userId: user.id, requiresEmailVerification: true }, { status: 201 });
  } catch (err) {
    return handleApiError(err, "customer register");
  }
}
