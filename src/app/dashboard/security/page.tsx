"use client";

import Link from "next/link";
import { Laptop, MapPin, Smartphone, ShieldCheck } from "lucide-react";
import { TopNav } from "@/components/nav/top-nav";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { currentUser } from "@/lib/mock-data";

const devices = [
  { name: "iPhone 16 Pro", location: "Lisboa, PT", lastActive: "Active now", icon: Smartphone, current: true },
  { name: "Chrome on Windows", location: "Lisboa, PT", lastActive: "2 hours ago", icon: Laptop, current: false },
  { name: "Safari on MacBook", location: "Porto, PT", lastActive: "3 days ago", icon: Laptop, current: false },
];

const loginHistory = [
  { event: "Successful login", location: "Lisboa, PT", date: "Jul 28, 2026 · 9:41 PM" },
  { event: "Successful login", location: "Lisboa, PT", date: "Jul 27, 2026 · 8:02 AM" },
  { event: "Failed login attempt", location: "Unknown location", date: "Jul 24, 2026 · 3:14 AM" },
];

export default function SecurityCentrePage() {
  return (
    <div>
      <TopNav title="Security Centre" back />
      <div className="space-y-4 px-5 py-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <ShieldCheck className="h-4 w-4 text-emerald-600" /> Security score
            </div>
            <span className="font-mono text-sm font-semibold tabular">{currentUser.securityScore}/100</span>
          </div>
          <div className="mt-3">
            <Progress value={currentUser.securityScore} />
          </div>
          <p className="mt-2 text-xs text-muted-foreground">Enable two-factor authentication to reach 95+.</p>
          <Button size="sm" className="mt-3" asChild>
            <Link href="/two-factor">Enable 2FA</Link>
          </Button>
        </Card>

        <div>
          <p className="mb-2 text-xs font-medium text-muted-foreground">Active devices</p>
          <div className="space-y-2">
            {devices.map((d) => (
              <Card key={d.name} className="flex items-center gap-3 p-3.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-mint-100 text-emerald-600">
                  <d.icon className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">{d.name}</p>
                  <p className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" /> {d.location} · {d.lastActive}
                  </p>
                </div>
                {d.current ? <Badge variant="success">This device</Badge> : <button className="text-xs font-medium text-coral">Log out</button>}
              </Card>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 text-xs font-medium text-muted-foreground">Recent login activity</p>
          <Card className="divide-y divide-border p-0">
            {loginHistory.map((h, i) => (
              <div key={i} className="flex items-center justify-between px-4 py-3 text-sm">
                <div>
                  <p className={h.event.includes("Failed") ? "font-medium text-coral" : "font-medium"}>{h.event}</p>
                  <p className="text-xs text-muted-foreground">{h.location}</p>
                </div>
                <span className="text-xs text-muted-foreground">{h.date}</span>
              </div>
            ))}
          </Card>
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
