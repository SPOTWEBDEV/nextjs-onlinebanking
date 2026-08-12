/**
 * Synchronously checks a zustand-persisted session in localStorage,
 * without waiting for the store to rehydrate via React state/effects.
 *
 * Used so that a logged-in customer or admin who lands on a public page
 * (the marketing homepage, /login, /register, /admin/login, /admin/register)
 * gets redirected to their dashboard immediately — checked on the very
 * first render, before anything paints — instead of briefly seeing the
 * public page again.
 */
export function hasStoredSession(storageKey: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return false;
    const parsed = JSON.parse(raw);
    return !!parsed?.state?.isAuthenticated;
  } catch {
    return false;
  }
}

export const CUSTOMER_SESSION_KEY = "aurora-session";
export const ADMIN_SESSION_KEY = "aurora-admin-session";