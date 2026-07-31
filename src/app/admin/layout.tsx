"use client";

import { Menu } from "lucide-react";
import { AdminSidebar } from "@/components/nav/admin-sidebar";
import { Avatar } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh bg-porcelain dark:bg-ink-950">
      <AdminSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="glass sticky top-0 z-30 flex items-center justify-between border-b px-5 py-3.5">
          <button className="lg:hidden" aria-label="Menu">
            <Menu className="h-5 w-5" />
          </button>
          <div className="hidden lg:block" />
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Avatar initials="AD" className="h-8 w-8 text-xs" />
          </div>
        </header>
        <main className="flex-1 p-5 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
