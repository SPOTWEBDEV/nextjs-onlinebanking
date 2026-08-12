import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { issueVerificationCode } from "@/lib/otp.server";
import { handleApiError } from "@/lib/api-error";

function logAttempt(request: NextRequest, email: string, success: boolean) {
  const ip = request.headers.get("x-forwarded-for") ?? request.headers.get("x-real-ip") ?? undefined;
  const userAgent = request.headers.get("user-agent") ?? undefined;
  // Fire-and-forget — a login attempt log should never block or fail the
  // actual login flow.
  prisma.loginAttempt.create({ data: { email, success, ip, userAgent } }).catch((err: unknown) => {
    console.error("Failed to log login attempt", err);
  });
}

export async function POST(request: NextRequest) {
  try {
    const { email, password } = (await request.json()) as { email: string; password: string };

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !user.passwordHash) {
      logAttempt(request, email, false);
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    const passwordMatches = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatches) {
      logAttempt(request, email, false);
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    if (user.status !== "active") {
      logAttempt(request, email, false);
      return NextResponse.json(
        { error: user.status === "suspended" ? "Your account has been suspended. Contact support." : "Your account is frozen. Contact support." },
        { status: 403 }
      );
    }

    logAttempt(request, email, true);

    // Password verified — now issue a 2FA/login code. There's no real
    // authenticator app or SMS provider wired up in this demo, so admins can
    // read the current code from the admin "Verification Codes" console.
    await issueVerificationCode(user.id, "login", user.phone);

    return NextResponse.json({ userId: user.id, requiresOtp: true });
  } catch (err) {
    return handleApiError(err, "customer login");
  }
}
