"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Download, FileText, Search, SlidersHorizontal } from "lucide-react";
import { toast } from "sonner";
import { TopNav } from "@/components/nav/top-nav";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog } from "@/components/ui/dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { TransactionIcon } from "@/components/ui/transaction-row";
import { fetchTransactions } from "@/lib/services/api";
import { cn, formatCurrency, formatDate } from "@/lib/utils";
import type { Transaction, TransactionCategory } from "@/lib/types";

const categories: (TransactionCategory | "all")[] = [
  "all",
  "transfer",
  "bills",
  "shopping",
  "food",
  "transport",
  "income",
  "entertainment",
  "subscription",
  "loan",
  "savings",
  "atm",
];

const PAGE_SIZE = 6;

export default function TransactionsPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<(typeof categories)[number]>("all");
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [selected, setSelected] = useState<Transaction | null>(null);

  const { data: transactions, isLoading } = useQuery({
    queryKey: ["transactions", "all"],
    queryFn: () => fetchTransactions(),
  });

  const filtered = useMemo(() => {
    let result = transactions ?? [];
    if (category !== "all") result = result.filter((t) => t.category === category);
    if (query) {
      const q = query.toLowerCase();
      result = result.filter(
        (t) => t.description.toLowerCase().includes(q) || t.counterparty.toLowerCase().includes(q)
      );
    }
    return result;
  }, [transactions, category, query]);

  return (
    <div>
      <TopNav title="Transaction History" back />

      <div className="space-y-3 px-5 py-3">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search transactions"
            className="pl-10"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <div className="no-scrollbar flex items-center gap-2 overflow-x-auto">
          <SlidersHorizontal className="h-4 w-4 shrink-0 text-muted-foreground" />
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={cn(
                "shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium capitalize transition-colors",
                category === c ? "border-emerald bg-mint-100 text-emerald-600" : "border-border text-muted-foreground"
              )}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex-1" onClick={() => toast.success("Exported as PDF")}>
            <FileText className="h-3.5 w-3.5" /> Export PDF
          </Button>
          <Button variant="outline" size="sm" className="flex-1" onClick={() => toast.success("Exported as CSV")}>
            <Download className="h-3.5 w-3.5" /> Export CSV
          </Button>
        </div>
      </div>

      <div className="px-5 pb-4">
        <Card className="p-2">
          {isLoading && (
            <div className="space-y-2 p-2">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          )}

          {!isLoading && filtered.length === 0 && (
            <EmptyState icon={Search} title="No transactions found" description="Try a different search or filter." />
          )}

          {filtered.slice(0, visible).map((t) => (
            <button
              key={t.id}
              onClick={() => setSelected(t)}
              className="flex w-full items-center gap-3 rounded-xl px-2 py-2.5 text-left transition-colors hover:bg-muted"
            >
              <div
                className={cn(
                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
                  t.type === "credit" ? "bg-mint-100 text-emerald-600" : "bg-muted text-ink-600"
                )}
              >
                <TransactionIcon category={t.category} className="h-4.5 w-4.5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{t.description}</p>
                <p className="truncate text-xs text-muted-foreground">{formatDate(t.date)} · {t.reference}</p>
              </div>
              <p className={cn("font-mono text-sm font-semibold tabular", t.type === "credit" ? "text-emerald-600" : "text-foreground")}>
                {t.type === "credit" ? "+" : "-"}
                {formatCurrency(t.amount, t.currency)}
              </p>
            </button>
          ))}

          {visible < filtered.length && (
            <button
              onClick={() => setVisible((v) => v + PAGE_SIZE)}
              className="mt-2 w-full rounded-xl py-3 text-center text-xs font-medium text-emerald-600 hover:bg-muted"
            >
              Load more
            </button>
          )}
        </Card>
      </div>

      <Dialog open={!!selected} onClose={() => setSelected(null)}>
        {selected && (
          <div>
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-mint-100">
              <TransactionIcon category={selected.category} className="h-5 w-5 text-emerald-600" />
            </div>
            <p className="mt-4 text-center font-display text-xl font-semibold tabular">
              {selected.type === "credit" ? "+" : "-"}
              {formatCurrency(selected.amount, selected.currency)}
            </p>
            <p className="text-center text-sm text-muted-foreground">{selected.description}</p>

            <div className="mt-5 space-y-2 rounded-2xl bg-muted p-4 text-sm">
              {[
                ["Counterparty", selected.counterparty],
                ["Date", formatDate(selected.date, true)],
                ["Reference", selected.reference],
                ["Category", selected.category],
                ["Status", selected.status],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between">
                  <span className="text-muted-foreground">{label}</span>
                  <span className="font-medium capitalize">{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
}
