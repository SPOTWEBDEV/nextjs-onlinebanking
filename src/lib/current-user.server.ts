import { prisma } from "@/lib/prisma";

const DEMO_USER_EMAIL = "mariana.costa@example.com";

/**
 * Resolves the "current" user for API routes.
 *
 * This app doesn't implement real session-based authentication (see the
 * README's "known limitations" section), so every route resolves to the
 * single seeded demo user. In a real deployment, replace this with a call
 * that reads the authenticated session (e.g. from a cookie / JWT) and
 * returns that user's id instead.
 */
export async function getCurrentUserId(): Promise<string> {
  const user = await prisma.user.findUniqueOrThrow({ where: { email: DEMO_USER_EMAIL } });
  return user.id;
}
