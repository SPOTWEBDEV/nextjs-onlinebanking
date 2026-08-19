import { NextRequest, NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/current-admin.server";
import { handleApiError } from "@/lib/api-error";

export async function GET(request: NextRequest) {
  try {
    const admin = await getCurrentAdmin(request);
    if (!admin) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    return NextResponse.json({ id: admin.id, fullName: admin.fullName, email: admin.email, role: admin.role });

  } catch (err) {
    return handleApiError(err, "get me");
  }
}
