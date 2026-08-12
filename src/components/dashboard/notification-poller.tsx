"use client";

import { useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchNotifications } from "@/lib/services/api";
import { showLocalNotification } from "@/lib/push";

const POLL_INTERVAL_MS = 20_000;

/**
 * Polls for new notifications while the app is open and fires a real
 * device notification (via the service worker) for any that weren't seen
 * yet — e.g. an admin-sent broadcast, a KYC status change, a new
 * transaction alert. The first poll only records what already exists; it
 * doesn't re-notify for a user's entire notification history.
 */
export function NotificationPoller() {
  const seenIds = useRef<Set<string> | null>(null);

  const { data } = useQuery({
    queryKey: ["notifications", "poll"],
    queryFn: fetchNotifications,
    refetchInterval: POLL_INTERVAL_MS,
  });

  useEffect(() => {
    if (!data) return;

    if (seenIds.current === null) {
      // First load: just record what's already there, don't notify for history.
      seenIds.current = new Set(data.map((n) => n.id));
      return;
    }

    for (const n of data) {
      if (!seenIds.current.has(n.id)) {
        seenIds.current.add(n.id);
        showLocalNotification(n.title, n.body, n.id);
      }
    }
  }, [data]);

  return null;
}
