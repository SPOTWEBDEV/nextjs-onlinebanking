"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/ui/stat-card";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { Wallet, Landmark, Lock, Ban } from "lucide-react";
import { fetchAllAccounts } from "@/lib/services/admin-api";
import { formatCurrency } from "@/lib/utils";

export default function AdminAccountsPage() {
  const { data, isLoading, error } = useQuery({ queryKey: ["admin", "all-accounts"], queryFn: fetchAllAccounts });

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight">Account Management</h1>
        <p className="text-sm text-muted-foreground">Account types, balances, and statuses across every customer.</p>
      </div>

      {error && <p className="text-sm text-coral">{error instanceof Error ? error.message : "Could not load accounts."}</p>}

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {isLoading || !data ? (
          [1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-24 w-full rounded-2xl" />)
        ) : (
          <>
            <StatCard label="Current accounts" value={data.stats.current.toLocaleString()} icon={Wallet} />
            <StatCard label="Savings accounts" value={data.stats.savings.toLocaleString()} icon={Landmark} />
            <StatCard label="Frozen accounts" value={data.stats.frozen.toLocaleString()} icon={Lock} />
            <StatCard label="Closed accounts" value={data.stats.closed.toLocaleString()} icon={Ban} />
          </>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All accounts ({data?.stats.total ?? 0})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : !data || data.accounts.length === 0 ? (
            <EmptyState icon={Wallet} title="No accounts yet" description="Accounts appear here as customers register." />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-border text-xs text-muted-foreground">
                    <th className="pb-2 font-medium">Account</th>
                    <th className="pb-2 font-medium">Owner</th>
                    <th className="pb-2 font-medium">Type</th>
                    <th className="pb-2 font-medium">Status</th>
                    <th className="pb-2 font-medium">Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {data.accounts.map((a) => (
                    <tr key={a.id} className="border-b border-border last:border-0">
                      <td className="py-2.5">
                        <p className="font-medium">{a.nickname}</p>
                        <p className="font-mono text-xs text-muted-foreground">{a.accountNumber}</p>
                      </td>
                      <td className="py-2.5">
                        <p className="font-medium">{a.ownerName}</p>
                        <p className="text-xs text-muted-foreground">{a.ownerEmail}</p>
                      </td>
                      <td className="py-2.5 capitalize">{a.type.replace("-", " ")}</td>
                      <td className="py-2.5">
                        <Badge variant={a.status === "active" ? "success" : "neutral"} className="capitalize">
                          {a.status}
                        </Badge>
                      </td>
                      <td className="py-2.5 font-mono tabular">{formatCurrency(a.balance, a.currency)}</td>
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
