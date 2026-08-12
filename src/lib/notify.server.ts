import { prisma } from "@/lib/prisma";
import type { NotificationCategory } from "@prisma/client";

/**
 * Creates a Notification row for a user. This is the single source that
 * both the in-app Notification Centre and the PWA push system
 * (NotificationPoller, which polls /api/notifications and fires a real
 * device notification for anything new) read from — so logging an
 * activity here is what makes "every activity gets a popup notification"
 * actually true, rather than scattering one-off client-side push calls
 * around that only fire if the tab happens to be open at that exact
 * moment and don't persist for later viewing.
 *
 * Fire-and-forget: a notification failing to write should never break the
 * activity that triggered it.
 */
export async function notifyUser(
  userId: string,
  title: string,
  body: string,
  category: NotificationCategory
) {
  try {
    await prisma.notification.create({ data: { userId, title, body, category } });
  } catch (err) {
    console.error("[notifyUser] failed to create notification", err);
  }
}
