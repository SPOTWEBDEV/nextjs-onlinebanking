import { Wifi } from "lucide-react";
import { cn, formatCurrency, maskNumber } from "@/lib/utils";

/**
 * The signature visual of Banco Aurora: a foil-textured gradient card used for
 * the landing hero, the dashboard balance card, and the physical/virtual
 * card views. Reusing the same object across contexts is the through-line
 * that makes the "vault" metaphor legible.
 */
export function VaultCard({
  label,
  numberMasked,
  holder,
  expiry,
  amount,
  currency = "USD",
  variant = "balance",
  frozen = false,
  className,
}: {
  label: string;
  numberMasked?: string;
  holder?: string;
  expiry?: string;
  amount?: number;
  currency?: string;
  variant?: "balance" | "card";
  frozen?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-3xl bg-vault-gradient p-6 text-white shadow-card",
        frozen && "saturate-0",
        className
      )}
    >
      <div className="absolute inset-0 bg-vault-foil opacity-40" />
      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gold/10 blur-2xl" />

      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-white/70">{label}</p>
          {variant === "balance" && amount !== undefined && (
            <p className="mt-2 font-mono text-3xl font-semibold tabular">
              {formatCurrency(amount, currency)}
            </p>
          )}
        </div>
        <span className="font-display text-sm font-bold tracking-tight text-gold-300">AURORA</span>
      </div>

      {variant === "card" && (
        <div className="relative mt-8">
          <Wifi className="mb-3 h-5 w-5 rotate-90 text-white/70" />
          <p className="font-mono text-lg tracking-widest tabular">{numberMasked ?? maskNumber("0000000000000000")}</p>
          <div className="mt-4 flex items-center justify-between text-xs text-white/70">
            <span className="uppercase">{holder}</span>
            <span>{expiry}</span>
          </div>
        </div>
      )}

      {frozen && (
        <div className="absolute inset-0 flex items-center justify-center bg-ink-950/40 backdrop-blur-[2px]">
          <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-ink-950">Frozen</span>
        </div>
      )}
    </div>
  );
}
