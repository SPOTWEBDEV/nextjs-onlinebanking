"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, Menu } from "lucide-react";
import { AdminSidebar } from "@/components/nav/admin-sidebar";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useAdminSessionStore } from "@/lib/admin-store";
import { initials } from "@/lib/utils";

const PUBLIC_ADMIN_PATHS = ["/admin/login", "/admin/register"];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isPublicPath = PUBLIC_ADMIN_PATHS.includes(pathname);

  const isAuthenticated = useAdminSessionStore((s) => s.isAuthenticated);
  const admin = useAdminSessionStore((s) => s.admin);
  const logout = useAdminSessionStore((s) => s.logout);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setChecked(true), 0);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (checked && !isPublicPath && !isAuthenticated) {
      router.replace("/admin/login");
    }
  }, [checked, isPublicPath, isAuthenticated, router]);

  if (isPublicPath) {
    return <>{children}</>;
  }

  if (!isAuthenticated || !admin) {
    return <div className="flex min-h-dvh items-center justify-center bg-porcelain dark:bg-ink-950" />;
  }

  return (
    <div className="flex min-h-dvh bg-porcelain dark:bg-ink-950">
      <AdminSidebar role={admin.role} />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="glass sticky top-0 z-30 flex items-center justify-between border-b px-5 py-3.5">
          <button className="lg:hidden" aria-label="Menu">
            <Menu className="h-5 w-5" />
          </button>
          <div className="hidden lg:block" />
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <div className="hidden items-center gap-2 sm:flex">
              <span className="text-sm font-medium">{admin.fullName}</span>
              <Badge variant={admin.role === "super_admin" ? "warning" : "neutral"} className="capitalize">
                {admin.role.replace("_", " ")}
              </Badge>
            </div>
            <Avatar initials={initials(admin.fullName)} className="h-8 w-8 text-xs" />
            <button
              onClick={() => {
                logout();
                router.push("/admin/login");
              }}
              aria-label="Sign out"
              className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground hover:text-coral"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </header>
        <main className="flex-1 p-5 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
