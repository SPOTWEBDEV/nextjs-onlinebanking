"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Banknote, Calculator, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { TopNav } from "@/components/nav/top-nav";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { applyForLoan, fetchLoans } from "@/lib/services/api";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { LoanProduct } from "@/lib/types";
import { useLanguage } from "@/lib/i18n/context";

function EmiCalculator({
  product,
  onApply,
  pending,
}: {
  product: LoanProduct;
  onApply: (amount: number, term: number) => void;
  pending?: boolean;
}) {
  const [amount, setAmount] = useState(Math.round(product.maxAmount / 3));
  const [term, setTerm] = useState(Math.min(24, product.maxTermMonths));

  const monthlyRate = product.rate / 100 / 12;
  const emi = useMemo(() => {
    if (!amount || !term) return 0;
    const r = monthlyRate;
    return (amount * r * Math.pow(1 + r, term)) / (Math.pow(1 + r, term) - 1);
  }, [amount, term, monthlyRate]);

  return (
    <div className="space-y-4">
      <div>
        <div className="mb-1.5 flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Loan amount</span>
          <span className="font-mono font-semibold tabular">{formatCurrency(amount)}</span>
        </div>
        <input
          type="range"
          min={500}
          max={product.maxAmount}
          step={100}
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          className="w-full accent-emerald-500"
        />
      </div>
      <div>
        <div className="mb-1.5 flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Term</span>
          <span className="font-mono font-semibold tabular">{term} months</span>
        </div>
        <input
          type="range"
          min={6}
          max={product.maxTermMonths}
          step={6}
          value={term}
          onChange={(e) => setTerm(Number(e.target.value))}
          className="w-full accent-emerald-500"
        />
      </div>
      <div className="rounded-2xl bg-muted p-4 text-center">
        <p className="text-xs text-muted-foreground">Estimated monthly payment</p>
        <p className="mt-1 font-mono text-2xl font-semibold tabular">{formatCurrency(emi)}</p>
        <p className="mt-1 text-xs text-muted-foreground">at {product.rate}% APR</p>
      </div>
      <Button size="lg" className="w-full" disabled={pending} onClick={() => onApply(amount, term)}>
        {pending ? "Submitting…" : `Apply for ${formatCurrency(amount)}`}
      </Button>
    </div>
  );
}

export default function LoansPage() {
  const { t } = useLanguage();
  const queryClient = useQueryClient();
  const [selectedProduct, setSelectedProduct] = useState<LoanProduct | null>(null);

  const { data: loans, isLoading, error } = useQuery({ queryKey: ["loans"], queryFn: fetchLoans });
  const applications = loans?.applications ?? [];
  const products = loans?.products ?? [];

  const mutation = useMutation({
    mutationFn: ({ amount, term }: { amount: number; term: number }) =>
      applyForLoan(selectedProduct!.id, amount, term),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["loans"] });
      toast.success("Loan application submitted");
      setSelectedProduct(null);
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "Could not submit loan application");
    },
  });

  return (
    <div>
      <TopNav title={t.pages.loans} back />

      <div className="space-y-6 px-5 py-4">
        {applications && applications.length > 0 && (
          <div>
            <h2 className="mb-2 font-display text-base font-semibold">Active loans</h2>
            <div className="space-y-2">
              {applications.map((a) => (
                <Card key={a.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{a.productName}</p>
                    <Badge variant={a.status === "active" ? "success" : "warning"} className="capitalize">
                      {a.status}
                    </Badge>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Next payment {formatCurrency(a.nextPaymentAmount)} due {formatDate(a.nextPaymentDate)}
                  </p>
                  <div className="mt-3">
                    <Progress value={((a.amount - a.remainingBalance) / a.amount) * 100} />
                    <p className="mt-1 text-[11px] text-muted-foreground">
                      {formatCurrency(a.remainingBalance)} remaining of {formatCurrency(a.amount)}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        <div>
          <h2 className="mb-2 font-display text-base font-semibold">Loan products</h2>
          {isLoading && (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="h-20 animate-pulse p-4" />
              ))}
            </div>
          )}
          {error && (
            <p className="text-sm text-coral">Could not load loan products. Pull to refresh or try again shortly.</p>
          )}
          {!isLoading && !error && products.length === 0 && (
            <p className="text-sm text-muted-foreground">No loan products are available right now.</p>
          )}
          <div className="space-y-2">
            {products.map((p) => (
              <Card key={p.id} className="flex items-center justify-between p-4">
                <div>
                  <p className="text-sm font-medium">{p.name}</p>
                  <p className="text-xs text-muted-foreground">{p.description}</p>
                  <p className="mt-1 text-xs font-medium text-emerald-600">
                    From {p.rate}% APR · up to {formatCurrency(p.maxAmount)}
                  </p>
                </div>
                <Button size="sm" variant="outline" onClick={() => setSelectedProduct(p)}>
                  <Calculator className="h-3.5 w-3.5" /> Calculate
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <Dialog open={!!selectedProduct} onClose={() => setSelectedProduct(null)}>
        {selectedProduct && (
          <div>
            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl bg-mint-100">
              <Banknote className="h-5 w-5 text-emerald-600" />
            </div>
            <h2 className="mt-3 text-center font-display text-lg font-semibold">{selectedProduct.name}</h2>
            <div className="mt-5">
              <EmiCalculator
                product={selectedProduct}
                onApply={(amount, term) => mutation.mutate({ amount, term })}
                pending={mutation.isPending}
              />
            </div>
            {mutation.isPending && (
              <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                <Loader2 className="h-3.5 w-3.5 animate-spin" /> Submitting application…
              </p>
            )}
          </div>
        )}
      </Dialog>
    </div>
  );
}
