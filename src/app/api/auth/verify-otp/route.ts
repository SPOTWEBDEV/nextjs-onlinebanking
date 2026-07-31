import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { code } = (await request.json()) as { code: string };

  if (!code || code.length !== 6) {
    return NextResponse.json({ error: "Invalid code" }, { status: 401 });
  }

  return NextResponse.json({ verified: true });
}
