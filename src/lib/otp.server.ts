import { prisma } from "@/lib/prisma";
import type { VerificationPurpose } from "@prisma/client";

const CODE_TTL_MINUTES = 15;

function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Creates a new verification code for a user + purpose, invalidating any
 * previous unused codes for that same user/purpose so only the latest one
 * is valid. `destination` is the email or phone the code was "sent" to —
 * there's no real email/SMS provider wired up, so admins read this from
 * the admin "Verification Codes" console and relay it to the customer over
 * support chat if they say they didn't receive it.
 */
export async function issueVerificationCode(
  userId: string,
  purpose: VerificationPurpose,
  destination: string
) {
  await prisma.verificationCode.updateMany({
    where: { userId, purpose, used: false },
    data: { used: true },
  });

  const code = generateCode();
  const verification = await prisma.verificationCode.create({
    data: {
      userId,
      purpose,
      destination,
      code,
      expiresAt: new Date(Date.now() + CODE_TTL_MINUTES * 60 * 1000),
    },
  });

  return verification;
}

export async function verifyCode(userId: string, purpose: VerificationPurpose, code: string) {
  const match = await prisma.verificationCode.findFirst({
    where: { userId, purpose, code, used: false, expiresAt: { gt: new Date() } },
    orderBy: { createdAt: "desc" },
  });

  if (!match) return false;

  await prisma.verificationCode.update({ where: { id: match.id }, data: { used: true } });
  return true;
}
