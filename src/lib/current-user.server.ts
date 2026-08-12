import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

const DEMO_USER_EMAIL = "mariana.costa@example.com";

/**
 * Resolves the "current" user for API routes.
 *
 * This app doesn't implement real cookie/JWT sessions, so the client sends
 * an `x-user-id` header (set from the zustand session store, populated
 * after a real login/registration) on every request. If that header is
 * present and matches a real user, we use it — this is what makes actions
 * like "create a savings goal" or "apply for a loan" actually affect the
 * account of whoever is logged in, not always the seeded demo user.
 *
 * If no header is sent (e.g. the request came from a tool or the app
 * hasn't established a session yet), we fall back to the seeded demo user
 * so the app remains usable out of the box. A production version should
 * replace this whole mechanism with real signed sessions — a client-sent
 * user id header is not secure on its own.
 */
export async function getCurrentUserId(request?: NextRequest | Request): Promise<string> {
  const headerUserId = request?.headers.get("x-user-id");

  if (headerUserId) {
    const user = await prisma.user.findUnique({ where: { id: headerUserId } });
    if (user) return user.id;
  }

  const fallback = await prisma.user.findUniqueOrThrow({ where: { email: DEMO_USER_EMAIL } });
  return fallback.id;
}
