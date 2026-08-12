"use client";

import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/ui/stat-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Banknote, CheckCircle2, Clock3, XCircle } from "lucide-react";
import { fetchLoans } from "@/lib/services/api";
import { formatCurrency } from "@/lib/utils";

export default function AdminLoansPage() {
  const { data, isLoading } = useQuery({ queryKey: ["loans"], queryFn: fetchLoans });
  const loanApplications = data?.applications ?? [];
  const loanProducts = data?.products ?? [];

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight">Loan Management</h1>
        <p className="text-sm text-muted-foreground">Approve loan requests, monitor repayments, and manage products.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Active loans" value="9,204" icon={Banknote} />
        <StatCard label="Pending approval" value="42" icon={Clock3} />
        <StatCard label="Approved this month" value="318" icon={CheckCircle2} />
        <StatCard label="Rejected this month" value="28" icon={XCircle} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Loan applications (live from Postgres)</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-24 w-full" />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-border text-xs text-muted-foreground">
                    <th className="pb-2 font-medium">Product</th>
                    <th className="pb-2 font-medium">Amount</th>
                    <th className="pb-2 font-medium">Status</th>
                    <th className="pb-2 font-medium">Remaining</th>
                    <th className="pb-2 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loanApplications.map((l) => (
                    <tr key={l.id} className="border-b border-border last:border-0">
                      <td className="py-2.5">{l.productName}</td>
                      <td className="py-2.5 font-mono tabular">{formatCurrency(l.amount)}</td>
                      <td className="py-2.5">
                        <Badge variant={l.status === "active" ? "success" : "warning"} className="capitalize">{l.status}</Badge>
                      </td>
                      <td className="py-2.5 font-mono tabular">{formatCurrency(l.remainingBalance)}</td>
                      <td className="py-2.5">
                        <Button size="sm" variant="outline" onClick={() => toast.success("Loan approved")}>
                          Review
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Loan products</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-3">
          {loanProducts.map((p) => (
            <div key={p.id} className="rounded-2xl border border-border p-4">
              <p className="text-sm font-medium">{p.name}</p>
              <p className="mt-1 text-xs text-muted-foreground">{p.rate}% APR · up to {formatCurrency(p.maxAmount)}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
