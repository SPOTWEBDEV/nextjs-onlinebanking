"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Laptop, ShieldCheck } from "lucide-react";
import { TopNav } from "@/components/nav/top-nav";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { currentUser } from "@/lib/mock-data";
import { useSessionStore } from "@/lib/store";
import { fetchMe, fetchMyLoginHistory } from "@/lib/services/api";
import { formatDate } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n/context";

function describeBrowser(ua: string) {
  const browser = /Edg\//.test(ua) ? "Edge" : /Chrome\//.test(ua) ? "Chrome" : /Firefox\//.test(ua) ? "Firefox" : /Safari\//.test(ua) ? "Safari" : "Browser";
  const os = /Windows/.test(ua) ? "Windows" : /Mac OS/.test(ua) ? "macOS" : /Android/.test(ua) ? "Android" : /iPhone|iPad/.test(ua) ? "iOS" : "this device";
  return `${browser} on ${os}`;
}

export default function SecurityCentrePage() {
  const { t } = useLanguage();
  const sessionUser = useSessionStore((s) => s.user);
  const { data: me } = useQuery({ queryKey: ["me"], queryFn: fetchMe });
  const user = me ?? sessionUser ?? currentUser;

  const { data: loginHistory, isLoading } = useQuery({
    queryKey: ["security", "login-history"],
    queryFn: fetchMyLoginHistory,
  });

  const [deviceLabel, setDeviceLabel] = useState("This device");
  useEffect(() => {
    if (typeof navigator !== "undefined") setDeviceLabel(describeBrowser(navigator.userAgent));
  }, []);

  return (
    <div>
      <TopNav title={t.pages.securityCentre} back />
      <div className="space-y-4 px-5 py-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <ShieldCheck className="h-4 w-4 text-emerald-600" /> Security score
            </div>
            <span className="font-mono text-sm font-semibold tabular">{user.securityScore}/100</span>
          </div>
          <div className="mt-3">
            <Progress value={user.securityScore} />
          </div>
          <p className="mt-2 text-xs text-muted-foreground">Enable two-factor authentication to reach 95+.</p>
          <Button size="sm" className="mt-3" asChild>
            <Link href="/two-factor">Enable 2FA</Link>
          </Button>
        </Card>

        <div>
          <p className="mb-2 text-xs font-medium text-muted-foreground">This session</p>
          <Card className="flex items-center gap-3 p-3.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-mint-100 text-emerald-600">
              <Laptop className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium">{deviceLabel}</p>
              <p className="text-xs text-muted-foreground">Active now</p>
            </div>
            <Badge variant="success">This device</Badge>
          </Card>
          <p className="mt-2 text-[11px] text-muted-foreground">
            This demo doesn&apos;t implement real multi-device session tracking, so only your current
            browser session is shown here — no fabricated device list.
          </p>
        </div>

        <div>
          <p className="mb-2 text-xs font-medium text-muted-foreground">Recent login activity (live from Postgres)</p>
          {isLoading && (
            <div className="space-y-2">
              {[1, 2].map((i) => (
                <Skeleton key={i} className="h-14 w-full rounded-2xl" />
              ))}
            </div>
          )}
          {!isLoading && (!loginHistory || loginHistory.length === 0) && (
            <EmptyState icon={ShieldCheck} title="No login activity yet" description="Your login history will appear here." />
          )}
          {loginHistory && loginHistory.length > 0 && (
            <Card className="divide-y divide-border p-0">
              {loginHistory.map((h) => (
                <div key={h.id} className="flex items-center justify-between px-4 py-3 text-sm">
                  <div>
                    <p className={h.success ? "font-medium" : "font-medium text-coral"}>
                      {h.success ? "Successful login" : "Failed login attempt"}
                    </p>
                    <p className="font-mono text-xs text-muted-foreground">{h.ip}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{formatDate(h.createdAt, true)}</span>
                </div>
              ))}
            </Card>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" asChild>
            <Link href="/reset-password">Change password</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/dashboard/cards">Change transfer PIN</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
