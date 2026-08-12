import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Visit /api/health directly in your browser (or curl it) any time you get
// an unexplained 500 from the app. It tells you plainly whether the
// database is actually reachable and whether the expected tables exist —
// the two most common causes of "every API call returns 500":
//   1. `npx prisma generate` was never run (or failed) after a schema change
//   2. `npx prisma db push` was never run, so the tables don't exist yet
//   3. DATABASE_URL in .env is wrong, or the DB is unreachable/paused
export async function GET() {
  const result: {
    status: "ok" | "error";
    databaseUrlConfigured: boolean;
    checks: Record<string, { ok: boolean; detail: string }>;
  } = {
    status: "ok",
    databaseUrlConfigured: !!process.env.DATABASE_URL,
    checks: {},
  };

  if (!process.env.DATABASE_URL) {
    result.status = "error";
    result.checks.databaseUrl = { ok: false, detail: "DATABASE_URL is not set in .env" };
    return NextResponse.json(result, { status: 500 });
  }

  try {
    await prisma.$queryRaw`SELECT 1`;
    result.checks.connection = { ok: true, detail: "Connected to Postgres successfully" };
  } catch (err) {
    result.status = "error";
    result.checks.connection = {
      ok: false,
      detail: err instanceof Error ? err.message : "Could not connect to the database",
    };
    return NextResponse.json(result, { status: 500 });
  }

  try {
    const adminCount = await prisma.admin.count();
    result.checks.tables = {
      ok: true,
      detail: `Tables exist. Found ${adminCount} admin account${adminCount === 1 ? "" : "s"}.`,
    };
    if (adminCount === 0) {
      result.checks.seed = {
        ok: false,
        detail: "No admin accounts found — run `npx prisma db seed` to create the super admin.",
      };
      result.status = "error";
    }
  } catch (err) {
    result.status = "error";
    result.checks.tables = {
      ok: false,
      detail:
        (err instanceof Error ? err.message : "Query failed") +
        " — tables likely don't exist yet. Run `npx prisma db push`.",
    };
  }

  return NextResponse.json(result, { status: result.status === "ok" ? 200 : 500 });
}
