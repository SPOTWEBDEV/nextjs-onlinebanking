import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { handleApiError } from "@/lib/api-error";

export async function POST(request: NextRequest) {
  try {
    const { fullName, email, password } = (await request.json()) as {
      fullName: string;
      email: string;
      password: string;
    };

    if (!fullName || !email || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const existing = await prisma.admin.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "An admin account with this email already exists" }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    // New admin sign-ups always get the "admin" role, never "super_admin" —
    // only the seeded Spotwebtech account can grant that, so a self-service
    // registration form can't be used to escalate privileges.
    const admin = await prisma.admin.create({
      data: { fullName, email, passwordHash, role: "admin" },
    });

    return NextResponse.json(
      { id: admin.id, fullName: admin.fullName, email: admin.email, role: admin.role },
      { status: 201 }
    );
  } catch (err) {
    return handleApiError(err, "admin register");
  }
}
