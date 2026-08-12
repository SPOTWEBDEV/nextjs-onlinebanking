/**
 * Masks a customer's email/phone for display in admin tables — e.g. a
 * support agent browsing the customer list shouldn't see full contact
 * details unless they actually open that specific customer's record.
 */
export function maskEmail(email: string): string {
  const [local, domain] = email.split("@");
  if (!domain) return email;
  if (local.length <= 2) return `${local[0] ?? ""}***@${domain}`;
  return `${local[0]}${"*".repeat(Math.max(local.length - 2, 3))}${local[local.length - 1]}@${domain}`;
}

export function maskPhone(phone: string): string {
  const trimmed = phone.trim();
  if (trimmed.length <= 6) return trimmed;
  const start = trimmed.slice(0, 4);
  const end = trimmed.slice(-4);
  return `${start}${"*".repeat(4)}${end}`;
}
