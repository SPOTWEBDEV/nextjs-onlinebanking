"use client";

import { useCurrency } from "@/lib/currency/context";
import { cn } from "@/lib/utils";

export function CurrencyToggle({ className }: { className?: string }) {
  const { displayCurrency, setDisplayCurrency } = useCurrency();

  return (
    <div className={cn("flex items-center gap-1 rounded-full border border-border bg-muted p-0.5 text-xs font-medium", className)}>
      {(["EUR", "USD"] as const).map((c) => (
        <button
          key={c}
          onClick={() => setDisplayCurrency(c)}
          className={cn(
            "rounded-full px-2.5 py-1 transition-colors",
            displayCurrency === c ? "bg-emerald text-white" : "text-muted-foreground"
          )}
        >
          {c === "EUR" ? "€ EUR" : "$ USD"}
        </button>
      ))}
    </div>
  );
}
