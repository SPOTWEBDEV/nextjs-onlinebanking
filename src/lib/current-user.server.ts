import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export class UnauthenticatedError extends Error {
  constructor() {
    super("UNAUTHENTICATED");
    this.name = "UnauthenticatedError";
  }
}

/**
 * Resolves the "current" user for API routes.
 *
 * This app doesn't implement real cookie/JWT sessions, so the client sends
 * an `x-user-id` header (set from the zustand session store, populated
 * after a real login/registration) on every request.
 *
 * There used to be a fallback here to a seeded "demo user" so the app
 * worked without logging in — that demo user no longer exists (the seed
 * script now only creates a super admin, everything else starts empty),
 * so that fallback was silently causing 500 errors on every customer-facing
 * route whenever no one was actually logged in. It's been removed in
 * favor of throwing a clear, catchable error instead.
 */
export async function getCurrentUserId(request?: NextRequest | Request): Promise<string> {
  const headerUserId = request?.headers.get("x-user-id");

  if (headerUserId) {
    const user = await prisma.user.findUnique({ where: { id: headerUserId } });
    if (user) return user.id;
  }

  throw new UnauthenticatedError();
}
