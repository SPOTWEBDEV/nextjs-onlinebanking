import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { handleApiError } from "@/lib/api-error";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = (await request.json()) as { email: string; password: string };

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const admin = await prisma.admin.findUnique({ where: { email } });
    if (!admin) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    const matches = await bcrypt.compare(password, admin.passwordHash);
    if (!matches) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    if (admin.status === "suspended") {
      return NextResponse.json(
        { error: admin.suspensionReason ? `Account suspended: ${admin.suspensionReason}` : "Your admin account has been suspended." },
        { status: 403 }
      );
    }

    return NextResponse.json({ id: admin.id, fullName: admin.fullName, email: admin.email, role: admin.role });
  } catch (err) {
    return handleApiError(err, "admin login");
  }
}
