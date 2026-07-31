"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeftRight, Grid2x2, Home, PiggyBank, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n/context";

export function BottomNav() {
  const pathname = usePathname();
  const { t } = useLanguage();

  const items = [
    { href: "/dashboard", label: t.nav.home, icon: Home },
    { href: "/dashboard/accounts", label: t.nav.accounts, icon: Wallet },
    { href: "/dashboard/transfer", label: t.nav.transfer, icon: ArrowLeftRight },
    { href: "/dashboard/savings", label: t.nav.savings, icon: PiggyBank },
    { href: "/dashboard/settings", label: t.nav.more, icon: Grid2x2 },
  ];

  return (
    <nav className="glass fixed inset-x-0 bottom-0 z-40 mx-auto flex w-full max-w-app items-center justify-between rounded-t-3xl border-t px-3 pb-[calc(env(safe-area-inset-bottom)+0.5rem)] pt-2">
      {items.map(({ href, label, icon: Icon }) => {
        const active = href === "/dashboard" ? pathname === href : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex flex-1 flex-col items-center gap-1 rounded-xl px-2 py-1.5 text-[11px] font-medium transition-colors",
              active ? "text-emerald-600" : "text-muted-foreground"
            )}
          >
            <Icon className={cn("h-5 w-5", active && "fill-mint-100")} />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
