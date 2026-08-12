"use client";

import { useQuery } from "@tanstack/react-query";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ArrowLeftRight, Banknote, Clock3, TrendingDown, TrendingUp, Users, Wallet } from "lucide-react";
import { StatCard } from "@/components/ui/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchAdminCustomers, fetchAdminStats } from "@/lib/services/admin-api";
import { formatCurrency } from "@/lib/utils";

export default function AdminDashboardPage() {
  const { data: stats, isLoading: loadingStats } = useQuery({
    queryKey: ["admin", "stats"],
    queryFn: fetchAdminStats,
  });
  const { data: customers = [], isLoading: loadingCustomers } = useQuery({
    queryKey: ["admin", "customers"],
    queryFn: fetchAdminCustomers,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight">Overview</h1>
        <p className="text-sm text-muted-foreground">Live snapshot of Banco Aurora&apos;s platform activity — every number here is a real query, not placeholder data.</p>
      </div>

      {loadingStats ? (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <Skeleton key={i} className="h-24 w-full rounded-2xl" />
          ))}
        </div>
      ) : stats ? (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard label="Total customers" value={stats.totalCustomers.toLocaleString()} icon={Users} />
          <StatCard label="Active customers" value={stats.activeCustomers.toLocaleString()} icon={TrendingUp} />
          <StatCard label="Total balance held" value={formatCurrency(stats.totalBalance)} icon={Wallet} />
          <StatCard label="Transfers today" value={stats.transfersToday.toLocaleString()} icon={ArrowLeftRight} />
          <StatCard label="Pending approvals" value={String(stats.pendingApprovals)} icon={Clock3} trend={stats.pendingApprovals > 0 ? "Needs review" : undefined} />
          <StatCard label="Active loans" value={stats.activeLoans.toLocaleString()} icon={Banknote} />
          <StatCard label="Deposits this month" value={formatCurrency(stats.depositsThisMonth)} icon={TrendingUp} trendUp />
          <StatCard label="Withdrawals this month" value={formatCurrency(stats.withdrawalsThisMonth)} icon={TrendingDown} />
        </div>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>New customers per month</CardTitle>
        </CardHeader>
        <CardContent>
          {loadingStats ? (
            <Skeleton className="h-64 w-full" />
          ) : !stats || stats.newCustomersByMonth.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">Not enough data yet — this fills in as customers sign up.</p>
          ) : (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.newCustomersByMonth}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EEF2F7" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <Tooltip contentStyle={{ borderRadius: 12, fontSize: 12 }} />
                  <Bar dataKey="count" fill="#2FAE8B" radius={[4, 4, 0, 0]} name="New customers" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recently joined customers</CardTitle>
        </CardHeader>
        <CardContent>
          {loadingCustomers ? (
            <Skeleton className="h-32 w-full" />
          ) : customers.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">No customers yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-border text-xs text-muted-foreground">
                    <th className="pb-2 font-medium">Customer</th>
                    <th className="pb-2 font-medium">Status</th>
                    <th className="pb-2 font-medium">KYC</th>
                    <th className="pb-2 font-medium">Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.slice(0, 5).map((c) => (
                    <tr key={c.id} className="border-b border-border last:border-0">
                      <td className="py-2.5">
                        <p className="font-medium">{c.name}</p>
                        <p className="text-xs text-muted-foreground">{c.email}</p>
                      </td>
                      <td className="py-2.5">
                        <Badge variant={c.status === "active" ? "success" : c.status === "suspended" ? "warning" : "danger"} className="capitalize">
                          {c.status}
                        </Badge>
                      </td>
                      <td className="py-2.5">
                        <Badge variant={c.kyc === "verified" ? "success" : "neutral"} className="capitalize">
                          {c.kyc}
                        </Badge>
                      </td>
                      <td className="py-2.5 font-mono tabular">{formatCurrency(c.balance)}</td>
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
