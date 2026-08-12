"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Bell,
  CreditCard,
  FileText,
  KeyRound,
  LandmarkIcon,
  LayoutDashboard,
  Megaphone,
  ScrollText,
  Shield,
  ShieldAlert,
  UserCog,
  Users,
  UserX,
  Wallet,
  Banknote,
} from "lucide-react";
import { cn } from "@/lib/utils";

const baseItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/suspended", label: "Suspended Users", icon: UserX },
  { href: "/admin/accounts", label: "Accounts", icon: Wallet },
  { href: "/admin/transactions", label: "Transactions", icon: ScrollText },
  { href: "/admin/kyc", label: "KYC Verification", icon: FileText },
  { href: "/admin/cards", label: "Cards", icon: CreditCard },
  { href: "/admin/loans", label: "Loans", icon: Banknote },
  { href: "/admin/payment-accounts", label: "Payment Accounts", icon: LandmarkIcon },
  { href: "/admin/verification-codes", label: "Verification Codes", icon: KeyRound },
  { href: "/admin/notifications", label: "Notifications", icon: Bell },
  { href: "/admin/cms", label: "CMS", icon: Megaphone },
  { href: "/admin/security", label: "Security", icon: Shield },
  { href: "/admin/reports", label: "Reports", icon: BarChart3 },
];

const superAdminItems = [
  { href: "/admin/super", label: "Super Admin", icon: ShieldAlert },
  { href: "/admin/super/admins", label: "Manage Admins", icon: UserCog },
];

export function AdminSidebar({ role }: { role: "super_admin" | "admin" }) {
  const pathname = usePathname();
  const items = role === "super_admin" ? [...baseItems, ...superAdminItems] : baseItems;

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-card px-4 py-6 lg:flex overflow-y-auto">
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
