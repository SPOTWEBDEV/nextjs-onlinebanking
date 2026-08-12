"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/ui/stat-card";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { AlertTriangle, Globe, ShieldCheck, ShieldAlert } from "lucide-react";
import { fetchLoginAttempts } from "@/lib/services/admin-api";
import { formatDate } from "@/lib/utils";

export default function AdminSecurityPage() {
  const { data: attempts = [], isLoading } = useQuery({
    queryKey: ["admin", "login-attempts"],
    queryFn: fetchLoginAttempts,
    refetchInterval: 15_000,
  });

  const failedCount = attempts.filter((a) => !a.success).length;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight">Security Dashboard</h1>
        <p className="text-sm text-muted-foreground">Monitor real login attempts as customers sign in (live from Postgres).</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Failed logins (recent)" value={String(failedCount)} icon={ShieldAlert} />
        <StatCard label="Total recent attempts" value={String(attempts.length)} icon={Globe} />
        <StatCard label="Flagged devices" value="—" icon={AlertTriangle} />
        <StatCard label="2FA adoption" value="100%" icon={ShieldCheck} trend="Required on every login" trendUp />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent login attempts</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : attempts.length === 0 ? (
            <EmptyState icon={ShieldCheck} title="No login attempts yet" description="Attempts will appear here as customers log in." />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-border text-xs text-muted-foreground">
                    <th className="pb-2 font-medium">Email</th>
                    <th className="pb-2 font-medium">IP address</th>
                    <th className="pb-2 font-medium">Result</th>
                    <th className="pb-2 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {attempts.map((a) => (
                    <tr key={a.id} className="border-b border-border last:border-0">
                      <td className="py-2.5">{a.email}</td>
                      <td className="py-2.5 font-mono text-xs">{a.ip}</td>
                      <td className="py-2.5">
                        <Badge variant={a.success ? "success" : "danger"} className="capitalize">
                          {a.success ? "success" : "failed"}
                        </Badge>
                      </td>
                      <td className="py-2.5 text-muted-foreground">{formatDate(a.createdAt, true)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
