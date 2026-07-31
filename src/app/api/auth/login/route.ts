import { NextRequest, NextResponse } from "next/server";

// Demo-only auth stub. See README "known limitations" — there is no real
// session/JWT issuance here. A production version would verify a hashed
// password and issue a real session token.
export async function POST(request: NextRequest) {
  const { email } = (await request.json()) as { email: string; password: string };

  if (!email?.includes("@")) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  return NextResponse.json({ token: "demo-token", requiresOtp: true });
}
