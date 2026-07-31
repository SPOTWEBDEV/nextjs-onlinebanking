"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/ui/stat-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Wallet, Landmark, Lock, Ban } from "lucide-react";
import { fetchAccounts } from "@/lib/services/api";
import { formatCurrency } from "@/lib/utils";

export default function AdminAccountsPage() {
  const { data: accounts = [], isLoading } = useQuery({ queryKey: ["accounts"], queryFn: fetchAccounts });

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight">Account Management</h1>
        <p className="text-sm text-muted-foreground">Account types, balances, limits, and statuses across the platform.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Current accounts" value="28,410" icon={Wallet} />
        <StatCard label="Savings accounts" value="19,880" icon={Landmark} />
        <StatCard label="Frozen accounts" value="212" icon={Lock} />
        <StatCard label="Closed accounts" value="64" icon={Ban} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Account records (live from Postgres)</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border text-xs text-muted-foreground">
                  <th className="pb-2 font-medium">Account</th>
                  <th className="pb-2 font-medium">Type</th>
                  <th className="pb-2 font-medium">Currency</th>
                  <th className="pb-2 font-medium">Status</th>
                  <th className="pb-2 font-medium">Balance</th>
                </tr>
              </thead>
              <tbody>
                {accounts.map((a) => (
                  <tr key={a.id} className="border-b border-border last:border-0">
                    <td className="py-2.5">
                      <p className="font-medium">{a.nickname}</p>
                      <p className="font-mono text-xs text-muted-foreground">{a.accountNumber}</p>
                    </td>
                    <td className="py-2.5 capitalize">{a.type.replace("-", " ")}</td>
                    <td className="py-2.5">{a.currency}</td>
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
