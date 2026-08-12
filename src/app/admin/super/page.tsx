"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { Download, Loader2, ShieldAlert, ShieldCheck, UserCog, Users, UserX, Clock3, Landmark } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/ui/stat-card";
import { Skeleton } from "@/components/ui/skeleton";
import { downloadBackup, fetchAdmins, fetchSuperStats } from "@/lib/services/admin-api";
import { useAdminSessionStore } from "@/lib/admin-store";

export default function SuperAdminDashboardPage() {
  const currentAdmin = useAdminSessionStore((s) => s.admin);
  const [downloading, setDownloading] = useState(false);

  const { data: stats, isLoading: loadingStats } = useQuery({
    queryKey: ["admin", "super", "stats"],
    queryFn: fetchSuperStats,
  });
  const { data: admins = [], isLoading: loadingAdmins } = useQuery({
    queryKey: ["admin", "admins"],
    queryFn: fetchAdmins,
  });

  const handleDownload = async () => {
    setDownloading(true);
    try {
      await downloadBackup();
      toast.success("Backup downloaded");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not download backup");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight">Super Admin Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Platform-wide oversight of admins and customers — visible only to super admins.
          </p>
        </div>
        <Button onClick={handleDownload} disabled={downloading}>
          {downloading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
          Download backup
        </Button>
      </div>

      {loadingStats ? (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-24 w-full rounded-2xl" />
          ))}
        </div>
      ) : stats ? (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard label="Total admins" value={String(stats.totalAdmins)} icon={UserCog} />
          <StatCard label="Total customers" value={String(stats.totalUsers)} icon={Users} />
          <StatCard label="Active customers" value={String(stats.activeUsers)} icon={ShieldCheck} />
          <StatCard label="Suspended" value={String(stats.suspendedUsers)} icon={UserX} />
          <StatCard label="Frozen" value={String(stats.frozenUsers)} icon={ShieldAlert} />
          <StatCard label="Pending KYC" value={String(stats.pendingKyc)} icon={Clock3} />
          <StatCard label="Payment accounts" value={String(stats.totalPaymentAccounts)} icon={Landmark} />
        </div>
      ) : null}

      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>Admins</CardTitle>
          <Button size="sm" variant="outline" asChild>
            <a href="/admin/super/admins">Manage admins</a>
          </Button>
        </CardHeader>
        <CardContent>
          {loadingAdmins ? (
            <div className="space-y-2">
              {[1, 2].map((i) => (
                <Skeleton key={i} className="h-14 w-full" />
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-border text-xs text-muted-foreground">
                    <th className="pb-2 font-medium">Admin</th>
                    <th className="pb-2 font-medium">Role</th>
                    <th className="pb-2 font-medium">Customers created</th>
                    <th className="pb-2 font-medium">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {admins.map((a) => (
                    <tr key={a.id} className="border-b border-border last:border-0">
                      <td className="py-2.5">
                        <p className="font-medium">
                          {a.fullName} {a.id === currentAdmin?.id && <span className="text-xs text-muted-foreground">(you)</span>}
                        </p>
                        <p className="text-xs text-muted-foreground">{a.email}</p>
                      </td>
                      <td className="py-2.5">
                        <Badge variant={a.role === "super_admin" ? "warning" : "neutral"} className="capitalize">
                          {a.role.replace("_", " ")}
                        </Badge>
                      </td>
                      <td className="py-2.5 font-mono tabular">{a.usersCreated}</td>
                      <td className="py-2.5 text-muted-foreground">{a.createdAt}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-gold/30 bg-gold-300/10">
        <CardContent className="p-4 text-sm">
          As a super admin, you can view full details for every customer regardless of which
          admin created them — the ownership restriction that applies to regular admins doesn&apos;t
          apply to you.
        </CardContent>
      </Card>
    </div>
  );
}
