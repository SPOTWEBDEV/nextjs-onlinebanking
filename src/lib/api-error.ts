import { NextResponse } from "next/server";
import { UnauthenticatedError } from "@/lib/current-user.server";

/**
 * Shared error handler for API routes. Logs the full error (with stack)
 * to the server console — this is what shows up in your terminal where
 * `npm run dev` is running, NOT the browser's Network tab, which only
 * ever shows a generic "500 Internal Server Error" with no detail.
 *
 * In development, the actual error message is also included in the JSON
 * response so you can see it without digging through terminal output. In
 * production it's hidden (a generic message is returned instead) so
 * internal details (table names, query structure, etc.) aren't exposed.
 */
export function handleApiError(err: unknown, context: string) {
  if (err instanceof UnauthenticatedError) {
    return NextResponse.json({ error: "Not authenticated — please log in again." }, { status: 401 });
  }

  console.error(`[API ERROR] ${context}:`, err);

  const isPrismaConnectionError =
    err instanceof Error &&
    (err.message.includes("Can't reach database server") ||
      err.message.includes("did not initialize") ||
      err.message.includes("P1001") ||
      err.message.includes("P1000"));

  const devMessage = err instanceof Error ? err.message : "Unknown error";
  const message = isPrismaConnectionError
    ? "Could not reach the database. Check DATABASE_URL in .env, and that you've run `npx prisma generate` and `npx prisma db push`. See /api/health for a diagnostic."
    : process.env.NODE_ENV === "production"
      ? "Something went wrong. Please try again."
      : devMessage;

  return NextResponse.json({ error: message, context }, { status: 500 });
}
