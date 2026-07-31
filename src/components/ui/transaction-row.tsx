import {
  ArrowDownLeft,
  ArrowUpRight,
  Banknote,
  Car,
  Clapperboard,
  Landmark,
  PiggyBank,
  Repeat,
  ShoppingBag,
  UtensilsCrossed,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import type { Transaction, TransactionCategory } from "@/lib/types";
import { cn, formatCurrency, formatDate } from "@/lib/utils";

const categoryIcon: Record<TransactionCategory, LucideIcon> = {
  transfer: Repeat,
  bills: Landmark,
  shopping: ShoppingBag,
  food: UtensilsCrossed,
  transport: Car,
  income: ArrowDownLeft,
  entertainment: Clapperboard,
  subscription: Repeat,
  loan: Banknote,
  savings: PiggyBank,
  atm: Wallet,
};

export function TransactionRow({ transaction, onClick }: { transaction: Transaction; onClick?: () => void }) {
  const Icon = categoryIcon[transaction.category];
  const isCredit = transaction.type === "credit";

  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-xl px-2 py-2.5 text-left transition-colors hover:bg-muted"
    >
      <div
        className={cn(
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
          isCredit ? "bg-mint-100 text-emerald-600" : "bg-muted text-ink-600"
        )}
      >
        <Icon className="h-4.5 w-4.5" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{transaction.description}</p>
        <p className="truncate text-xs text-muted-foreground">
          {formatDate(transaction.date)} · {transaction.status === "pending" ? "Pending" : transaction.reference}
        </p>
      </div>
      <div className="text-right">
        <p className={cn("font-mono text-sm font-semibold tabular", isCredit ? "text-emerald-600" : "text-foreground")}>
          {isCredit ? "+" : "-"}
          {formatCurrency(transaction.amount, transaction.currency)}
        </p>
      </div>
    </button>
  );
}

export function TransactionIcon({ category, className }: { category: TransactionCategory; className?: string }) {
  const Icon = categoryIcon[category];
  return <Icon className={className} />;
}
