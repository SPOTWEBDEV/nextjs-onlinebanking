"use client";

/**
 * Local/foreground push notifications for the PWA.
 *
 * This uses the browser Notification API (via the service worker's
 * `showNotification`, which renders a real OS-level notification rather
 * than an in-page toast). It works while the app is open or backgrounded
 * in a tab. It does **not** implement true background push (notifications
 * while the browser/app is fully closed) — that requires a real push
 * server, VAPID keys, and a `PushSubscription` sent to a backend, which
 * this demo doesn't have. See the README for what a production version
 * would need.
 */

export function isPushSupported() {
  return typeof window !== "undefined" && "Notification" in window && "serviceWorker" in navigator;
}

export function getPermissionState(): NotificationPermission | "unsupported" {
  if (!isPushSupported()) return "unsupported";
  return Notification.permission;
}

export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!isPushSupported()) return "denied";
  return Notification.requestPermission();
}

export async function showLocalNotification(title: string, body: string, tag?: string) {
  if (!isPushSupported() || Notification.permission !== "granted") return;

  try {
    const registration = await navigator.serviceWorker.ready;
    await registration.showNotification(title, {
      body,
      icon: "/icons/icon-192.png",
      badge: "/icons/icon-96.png",
      tag,
    });
  } catch {
    // Fallback for browsers without a ready service worker registration.
    new Notification(title, { body, icon: "/icons/icon-192.png" });
  }
}
