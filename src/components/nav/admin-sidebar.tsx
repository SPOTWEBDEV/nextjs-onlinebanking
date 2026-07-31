"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Bell,
  CreditCard,
  FileText,
  LayoutDashboard,
  Megaphone,
  ScrollText,
  Shield,
  Users,
  Wallet,
  Banknote,
} from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/accounts", label: "Accounts", icon: Wallet },
  { href: "/admin/transactions", label: "Transactions", icon: ScrollText },
  { href: "/admin/kyc", label: "KYC Verification", icon: FileText },
  { href: "/admin/cards", label: "Cards", icon: CreditCard },
  { href: "/admin/loans", label: "Loans", icon: Banknote },
  { href: "/admin/notifications", label: "Notifications", icon: Bell },
  { href: "/admin/cms", label: "CMS", icon: Megaphone },
  { href: "/admin/security", label: "Security", icon: Shield },
  { href: "/admin/reports", label: "Reports", icon: BarChart3 },
];

export function AdminSidebar() {
  const pathname = usePathname();
  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-card px-4 py-6 lg:flex">
      <Link href="/admin" className="mb-8 flex items-center gap-2 px-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-vault-gradient font-display text-sm font-bold text-gold-300">A</span>
        <span className="font-display text-base font-semibold">Banco Aurora Admin</span>
      </Link>
      <nav className="flex flex-1 flex-col gap-1">
        {items.map(({ href, label, icon: Icon }) => {
          const active = href === "/admin" ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                active ? "bg-mint-100 text-emerald-600" : "text-muted-foreground hover:bg-muted"
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
