"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { hasStoredSession } from "./session-check";

/**
 * Checks localStorage synchronously on first render (no flash of the
 * public page's content) and redirects away if a session already exists.
 * Returns true while the redirect is pending, so the caller can render
 * nothing instead of the public page content.
 */
export function useRedirectIfAuthenticated(storageKey: string, target: string): boolean {
  const router = useRouter();
  const [alreadyLoggedIn] = useState(() => hasStoredSession(storageKey));

  useEffect(() => {
    if (alreadyLoggedIn) router.replace(target);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [alreadyLoggedIn]);

  return alreadyLoggedIn;
}
