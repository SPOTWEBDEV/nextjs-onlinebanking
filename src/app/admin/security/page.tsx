"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/ui/stat-card";
import { AlertTriangle, Globe, ShieldCheck, ShieldAlert } from "lucide-react";

const loginAttempts = [
  { user: "mariana.costa@example.com", ip: "197.210.28.14", location: "Lisboa, PT", result: "success", date: "Jul 29, 2026 · 8:12 PM" },
  { user: "unknown", ip: "45.132.90.7", location: "Bucharest, RO", result: "failed", date: "Jul 29, 2026 · 6:44 PM" },
  { user: "daniel.reyes@example.com", ip: "102.89.44.201", location: "Austin, US", result: "success", date: "Jul 29, 2026 · 4:03 PM" },
  { user: "unknown", ip: "185.220.101.4", location: "Unknown (Tor exit)", result: "failed", date: "Jul 29, 2026 · 2:18 PM" },
];

export default function AdminSecurityPage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight">Security Dashboard</h1>
        <p className="text-sm text-muted-foreground">Monitor login attempts, device history, and suspicious activity.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Failed logins (24h)" value="184" icon={ShieldAlert} />
        <StatCard label="Flagged devices" value="9" icon={AlertTriangle} />
        <StatCard label="Blocked IPs" value="37" icon={Globe} />
        <StatCard label="2FA adoption" value="68%" icon={ShieldCheck} trend="+3.2% this month" trendUp />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent login attempts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border text-xs text-muted-foreground">
                  <th className="pb-2 font-medium">User</th>
                  <th className="pb-2 font-medium">IP address</th>
                  <th className="pb-2 font-medium">Location</th>
                  <th className="pb-2 font-medium">Result</th>
                  <th className="pb-2 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {loginAttempts.map((a, i) => (
                  <tr key={i} className="border-b border-border last:border-0">
                    <td className="py-2.5">{a.user}</td>
                    <td className="py-2.5 font-mono text-xs">{a.ip}</td>
                    <td className="py-2.5 text-muted-foreground">{a.location}</td>
                    <td className="py-2.5">
                      <Badge variant={a.result === "success" ? "success" : "danger"} className="capitalize">
                        {a.result}
                      </Badge>
                    </td>
                    <td className="py-2.5 text-muted-foreground">{a.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
