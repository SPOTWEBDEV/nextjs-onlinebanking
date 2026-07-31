"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Copy, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { TopNav } from "@/components/nav/top-nav";
import { VaultCard } from "@/components/ui/vault-card";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchAccounts } from "@/lib/services/api";
import { formatCurrency } from "@/lib/utils";
import type { Account } from "@/lib/types";

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <button
      onClick={() => {
        navigator.clipboard?.writeText(value);
        toast.success(`${label} copied`);
      }}
      className="flex w-full items-center justify-between rounded-lg px-2 py-2 text-left hover:bg-muted"
    >
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="flex items-center gap-1.5 font-mono text-xs font-medium tabular">
        {value}
        <Copy className="h-3 w-3 text-muted-foreground" />
      </span>
    </button>
  );
}

function AccountCard({ account }: { account: Account }) {
  const [revealed, setRevealed] = useState(false);
  const masked = `••••${account.accountNumber.slice(-4)}`;

  return (
    <Card className="overflow-hidden">
      <VaultCard
        label={account.nickname}
        amount={account.balance}
        currency={account.currency}
        className="rounded-none"
      />
      <div className="p-4">
        <div className="mb-2 flex items-center justify-between">
          <Badge variant={account.status === "active" ? "success" : "neutral"} className="capitalize">
            {account.status}
          </Badge>
          <button
            onClick={() => setRevealed((r) => !r)}
            className="flex items-center gap-1 text-xs font-medium text-emerald-600"
          >
            {revealed ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
            {revealed ? "Hide details" : "Show details"}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-x-3 gap-y-1 border-t border-border pt-2">
          <DetailRow label="Account number" value={revealed ? account.accountNumber : masked} />
          <DetailRow label="Currency" value={account.currency} />
          {revealed && (
            <>
              <DetailRow label="IBAN" value={account.iban} />
              <DetailRow label="NIB" value={account.nib} />
              <DetailRow label="SWIFT / BIC" value={account.swiftCode} />
            </>
          )}
          <DetailRow label="Available balance" value={formatCurrency(account.availableBalance, account.currency)} />
          <DetailRow label="Ledger balance" value={formatCurrency(account.ledgerBalance, account.currency)} />
        </div>
      </div>
    </Card>
  );
}

export default function AccountsPage() {
  const { data: accounts, isLoading } = useQuery({ queryKey: ["accounts"], queryFn: fetchAccounts });

  return (
    <div>
      <TopNav title="Accounts" />
      <div className="space-y-4 px-5 py-4">
        {isLoading && (
          <>
            <Skeleton className="h-64 w-full rounded-2xl" />
            <Skeleton className="h-64 w-full rounded-2xl" />
          </>
        )}
        {accounts?.map((a) => (
          <AccountCard key={a.id} account={a} />
        ))}
      </div>
    </div>
  );
}
