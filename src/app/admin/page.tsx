"use client";

import { useQuery } from "@tanstack/react-query";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ArrowLeftRight, Banknote, Clock3, TrendingUp, Users, Wallet } from "lucide-react";
import { StatCard } from "@/components/ui/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchAdminCustomers, fetchAnalytics } from "@/lib/services/api";
import { adminStats } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";

export default function AdminDashboardPage() {
  const { data: analytics } = useQuery({ queryKey: ["analytics"], queryFn: fetchAnalytics });
  const { data: customers = [], isLoading: loadingCustomers } = useQuery({
    queryKey: ["admin", "customers"],
    queryFn: fetchAdminCustomers,
  });
  const spendingByMonth = analytics?.spendingByMonth ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight">Overview</h1>
        <p className="text-sm text-muted-foreground">Live snapshot of Banco Aurora&apos;s platform activity.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total customers" value={adminStats.totalCustomers.toLocaleString()} icon={Users} trend="+2.4% this month" trendUp />
        <StatCard label="Active users" value={adminStats.activeUsers.toLocaleString()} icon={TrendingUp} trend="+1.1% this month" trendUp />
        <StatCard label="Total deposits" value={formatCurrency(adminStats.totalDeposits)} icon={Wallet} />
        <StatCard label="Total withdrawals" value={formatCurrency(adminStats.totalWithdrawals)} icon={Banknote} />
        <StatCard label="Transfers today" value={adminStats.transfersToday.toLocaleString()} icon={ArrowLeftRight} />
        <StatCard label="Pending requests" value={String(adminStats.pendingRequests)} icon={Clock3} trend="Needs review" />
        <StatCard label="Revenue this month" value={formatCurrency(adminStats.revenueThisMonth)} icon={TrendingUp} trend="+8.3%" trendUp />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Platform income vs expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={spendingByMonth}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EEF2F7" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: 12, fontSize: 12 }} />
                  <Bar dataKey="income" fill="#2FAE8B" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="expenses" fill="#0F6B5C" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Deposit growth</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={spendingByMonth.map((m, i) => ({ month: m.month, deposits: 140_000_000 + i * 9_000_000 }))}>
                  <defs>
                    <linearGradient id="adminGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#0F6B5C" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="#0F6B5C" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis hide />
                  <Tooltip formatter={(v: number) => formatCurrency(v)} contentStyle={{ borderRadius: 12, fontSize: 12 }} />
                  <Area type="monotone" dataKey="deposits" stroke="#0F6B5C" fill="url(#adminGradient)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recently active customers (live from Postgres)</CardTitle>
        </CardHeader>
        <CardContent>
          {loadingCustomers ? (
            <Skeleton className="h-32 w-full" />
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
