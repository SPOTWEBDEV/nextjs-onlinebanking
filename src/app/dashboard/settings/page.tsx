"use client";

import Link from "next/link";
import {
  Bell,
  ChevronRight,
  Fingerprint,
  KeyRound,
  Laptop,
  LogOut,
  Moon,
  ShieldCheck,
  User,
} from "lucide-react";
import { toast } from "sonner";
import { TopNav } from "@/components/nav/top-nav";
import { Card } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { LanguageToggle } from "@/components/ui/language-toggle";
import { useSessionStore } from "@/lib/store";
import { useLanguage } from "@/lib/i18n/context";
import { useRouter } from "next/navigation";

const items: { label: string; icon: typeof User; href?: string; toggle?: boolean }[] = [
  { label: "Profile", icon: User, href: "/dashboard/profile" },
  { label: "Change password", icon: KeyRound, href: "/reset-password" },
  { label: "Transfer PIN", icon: KeyRound, href: "/dashboard/settings" },
  { label: "Biometrics", icon: Fingerprint, toggle: true },
  { label: "Notification preferences", icon: Bell, href: "/dashboard/notifications" },
  { label: "Security", icon: ShieldCheck, href: "/dashboard/security" },
  { label: "Linked devices", icon: Laptop, href: "/dashboard/security" },
];

export default function SettingsPage() {
  const router = useRouter();
  const logout = useSessionStore((s) => s.logout);
  const { t } = useLanguage();

  return (
    <div>
      <TopNav title={t.nav.settings} />
      <div className="space-y-4 px-5 py-4">
        <Card className="flex items-center justify-between p-4">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Moon className="h-4 w-4" /> Dark mode
          </div>
          <ThemeToggle />
        </Card>

        <Card className="flex items-center justify-between p-4">
          <span className="text-sm font-medium">{t.common.language} · Free translator</span>
          <LanguageToggle />
        </Card>

        <Card className="divide-y divide-border">
          {items.map((item) => (
            <Link
              key={item.label}
              href={item.href ?? "#"}
              className="flex items-center justify-between px-4 py-3.5 text-sm"
            >
              <span className="flex items-center gap-3">
                <item.icon className="h-4 w-4 text-muted-foreground" />
                {item.label}
              </span>
              {item.toggle ? (
                <span className="h-6 w-10 rounded-full bg-emerald p-0.5">
                  <span className="block h-5 w-5 translate-x-4 rounded-full bg-white transition-transform" />
                </span>
              ) : (
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              )}
            </Link>
          ))}
        </Card>

        <button
          onClick={() => {
            logout();
            toast.success("Signed out");
            router.push("/login");
          }}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-coral/30 py-3.5 text-sm font-medium text-coral"
        >
          <LogOut className="h-4 w-4" /> {t.nav.logout}
        </button>
      </div>
    </div>
  );
}
