"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeftRight,
  QrCode,
  Receipt,
  Smartphone,
  ArrowRight,
} from "lucide-react";
import { TopNav } from "@/components/nav/top-nav";
import { VaultCard } from "@/components/ui/vault-card";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TransactionRow } from "@/components/ui/transaction-row";
import { fetchAccounts, fetchTransactions } from "@/lib/services/api";
import { currentUser } from "@/lib/mock-data";
import { greetingForTime, formatCurrency } from "@/lib/utils";

const quickActions = [
  { href: "/dashboard/transfer", label: "Transfer", icon: ArrowLeftRight },
  { href: "/dashboard/bills", label: "Pay Bills", icon: Receipt },
  { href: "/dashboard/topup", label: "Top Up", icon: Smartphone },
  { href: "/dashboard/qr", label: "QR Pay", icon: QrCode },
];

export default function DashboardHomePage() {
  const { data: accounts, isLoading: loadingAccounts } = useQuery({
    queryKey: ["accounts"],
    queryFn: fetchAccounts,
  });
  const { data: transactions, isLoading: loadingTx } = useQuery({
    queryKey: ["transactions", "recent"],
    queryFn: () => fetchTransactions(),
  });

  const primary = accounts?.[0];
  const totalBalance = accounts?.reduce((sum, a) => sum + a.balance, 0) ?? 0;

  return (
    <div>
      <TopNav />
      <div className="px-5 pb-4 pt-2">
        <p className="text-sm text-muted-foreground">
          {greetingForTime()}, {currentUser.fullName.split(" ")[0]} 👋
        </p>
      </div>

      <div className="px-5">
        {loadingAccounts || !primary ? (
          <Skeleton className="h-40 w-full rounded-3xl" />
        ) : (
          <VaultCard label={primary.nickname} amount={primary.balance} currency={primary.currency} />
        )}
        <div className="mt-3 flex items-center justify-between rounded-2xl bg-muted px-4 py-2.5 text-xs">
          <span className="text-muted-foreground">Total across all accounts</span>
          <span className="font-mono font-semibold tabular">{formatCurrency(totalBalance)}</span>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-4 gap-2 px-5">
        {quickActions.map((a) => (
          <Link
            key={a.href}
            href={a.href}
            className="flex flex-col items-center gap-2 rounded-2xl bg-card py-4 text-center shadow-soft"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-mint-100 text-emerald-600">
              <a.icon className="h-4.5 w-4.5" />
            </div>
            <span className="text-[11px] font-medium">{a.label}</span>
          </Link>
        ))}
      </div>

      <div className="mt-7 px-5">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-base font-semibold">Spending insight</h2>
          <Link href="/dashboard/analytics" className="text-xs font-medium text-emerald-600">
            See analytics
          </Link>
        </div>
        <Card className="p-4">
          <div className="flex items-end justify-between gap-2">
            {["Feb", "Mar", "Apr", "May", "Jun", "Jul"].map((m, i) => {
              const heights = [55, 68, 48, 74, 60, 44];
              return (
                <div key={m} className="flex flex-1 flex-col items-center gap-1.5">
                  <div className="flex h-20 w-full items-end">
                    <div
                      className="w-full rounded-md bg-gradient-to-t from-emerald to-mint-500"
                      style={{ height: `${heights[i]}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-muted-foreground">{m}</span>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      <div className="mt-7 px-5">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="font-display text-base font-semibold">Recent transactions</h2>
          <Link
            href="/dashboard/transactions"
            className="flex items-center gap-1 text-xs font-medium text-emerald-600"
          >
            View all <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        <Card className="p-2">
          {loadingTx && (
            <div className="space-y-2 p-2">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          )}
          {transactions?.slice(0, 5).map((t) => (
            <TransactionRow key={t.id} transaction={t} />
          ))}
        </Card>
      </div>
    </div>
  );
}
