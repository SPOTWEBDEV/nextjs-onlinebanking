import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * Resolves the admin making an API request, from the `x-admin-id` header
 * the client attaches (see src/lib/services/admin-api.ts). Returns null if
 * there's no header or it doesn't match a real admin — callers should
 * treat that as "not logged in" and respond with 401.
 *
 * Like the customer-facing `current-user.server.ts`, a client-sent header
 * is a lightweight stand-in for real sessions, not a secure mechanism on
 * its own — see the README's "known limitations".
 */
export async function getCurrentAdmin(request: NextRequest | Request) {
  const adminId = request.headers.get("x-admin-id");
  if (!adminId) return null;

  const admin = await prisma.admin.findUnique({ where: { id: adminId } });
  if (!admin || admin.status === "suspended") return null;
  return admin;
}
