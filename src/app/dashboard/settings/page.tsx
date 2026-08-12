"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Bell,
  BellRing,
  ChevronRight,
  FileCheck2,
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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { LanguageToggle } from "@/components/ui/language-toggle";
import { CurrencyToggle } from "@/components/ui/currency-toggle";
import { useSessionStore } from "@/lib/store";
import { useLanguage } from "@/lib/i18n/context";
import { useRouter } from "next/navigation";
import { getPermissionState, isPushSupported, requestNotificationPermission, showLocalNotification } from "@/lib/push";

export default function SettingsPage() {
  const router = useRouter();
  const logout = useSessionStore((s) => s.logout);
  const { t } = useLanguage();
  const [pushPermission, setPushPermission] = useState<NotificationPermission | "unsupported">("unsupported");

  useEffect(() => {
    setPushPermission(getPermissionState());
  }, []);

  const items: { label: string; icon: typeof User; href?: string; toggle?: boolean }[] = [
    { label: t.pages.profile, icon: User, href: "/dashboard/profile" },
    { label: t.pages.kyc, icon: FileCheck2, href: "/dashboard/kyc" },
    { label: t.settings.changePassword, icon: KeyRound, href: "/reset-password" },
    { label: t.settings.transferPin, icon: KeyRound, href: "/dashboard/settings" },
    { label: t.settings.biometrics, icon: Fingerprint, toggle: true },
    { label: t.settings.notificationPreferences, icon: Bell, href: "/dashboard/notifications" },
    { label: t.pages.securityCentre, icon: ShieldCheck, href: "/dashboard/security" },
    { label: t.settings.linkedDevices, icon: Laptop, href: "/dashboard/security" },
  ];

  return (
    <div>
      <TopNav title={t.nav.settings} />
      <div className="space-y-4 px-5 py-4">
        <Card className="flex items-center justify-between p-4">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Moon className="h-4 w-4" /> {t.settings.darkMode}
          </div>
          <ThemeToggle />
        </Card>

        <Card className="flex items-center justify-between p-4">
          <span className="text-sm font-medium">{t.common.language} · Free translator</span>
          <LanguageToggle />
        </Card>

        <Card className="flex items-center justify-between p-4">
          <div>
            <span className="text-sm font-medium">Display currency</span>
            <p className="text-xs text-muted-foreground">Fixed demo rate — not a live exchange rate</p>
          </div>
          <CurrencyToggle />
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-medium">
              <BellRing className="h-4 w-4" /> Push notifications
            </div>
            {pushPermission === "granted" && <Badge variant="success">Enabled</Badge>}
            {pushPermission === "denied" && <Badge variant="danger">Blocked</Badge>}
            {pushPermission === "default" && <Badge variant="neutral">Not enabled</Badge>}
            {pushPermission === "unsupported" && <Badge variant="neutral">Unsupported</Badge>}
          </div>
          {pushPermission === "default" && isPushSupported() && (
            <Button
              size="sm"
              className="mt-3 w-full"
              onClick={async () => {
                const result = await requestNotificationPermission();
                setPushPermission(result);
                if (result === "granted") {
                  toast.success("Push notifications enabled");
                  showLocalNotification("Banco Aurora", "You'll now get real device notifications for account activity.");
                } else {
                  toast.error("Notifications weren't enabled");
                }
              }}
            >
              Enable device notifications
            </Button>
          )}
          {pushPermission === "denied" && (
            <p className="mt-2 text-xs text-muted-foreground">
              Notifications are blocked at the browser level. Enable them in your browser/device settings for this site.
            </p>
          )}
          {pushPermission === "unsupported" && (
            <p className="mt-2 text-xs text-muted-foreground">Your browser doesn&apos;t support push notifications.</p>
          )}
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
          <LogOut className="h-4 w-4" /> {t.settings.signOut}
        </button>
      </div>
    </div>
  );
}
