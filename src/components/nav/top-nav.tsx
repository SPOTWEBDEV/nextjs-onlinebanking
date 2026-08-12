"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, Bell } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { currentUser } from "@/lib/mock-data";
import { useSessionStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export function TopNav({
  title,
  back = false,
  transparent = false,
}: {
  title?: string;
  back?: boolean;
  transparent?: boolean;
}) {
  const router = useRouter();
  const sessionUser = useSessionStore((s) => s.user);
  const avatarInitials = sessionUser?.avatarInitials ?? currentUser.avatarInitials;

  return (
    <header
      className={cn(
        "sticky top-0 z-30 flex items-center justify-between px-5 py-4",
        transparent ? "bg-transparent" : "glass border-b"
      )}
    >
      <div className="flex items-center gap-3">
        {back && (
          <button
            onClick={() => router.back()}
            aria-label="Go back"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-muted"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        )}
        {title && <h1 className="font-display text-lg font-semibold tracking-tight">{title}</h1>}
      </div>
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard/notifications"
          aria-label="Notifications"
          className="relative flex h-9 w-9 items-center justify-center rounded-full bg-muted"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-coral" />
        </Link>
        <Link href="/dashboard/profile">
          <Avatar initials={avatarInitials} className="h-9 w-9 text-xs" />
        </Link>
      </div>
    </header>
  );
}
