"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Search, ShieldAlert, CheckCircle2, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchTransactions, resolveTransaction } from "@/lib/services/api";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function AdminTransactionsPage() {
  const queryClient = useQueryClient();
  const [query, setQuery] = useState("");
  const { data: allTransactions = [], isLoading } = useQuery({
    queryKey: ["transactions", "all"],
    queryFn: () => fetchTransactions(),
  });
  const transactions = allTransactions.filter(
    (t) => t.description.toLowerCase().includes(query.toLowerCase()) || t.reference.toLowerCase().includes(query.toLowerCase())
  );
  const pendingCount = allTransactions.filter((t) => t.status === "pending").length;

  const mutation = useMutation({
    mutationFn: ({ id, action }: { id: string; action: "approve" | "reject" }) => resolveTransaction(id, action),
    onSuccess: (_data, vars) => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      toast[vars.action === "approve" ? "success" : "error"](
        vars.action === "approve" ? "Transaction approved and balance updated" : "Transaction rejected"
      );
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : "Could not resolve transaction"),
  });

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight">Transaction Management</h1>
        <p className="text-sm text-muted-foreground">Approve or reject pending transactions — live from Postgres.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative mb-4 max-w-sm">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search by description or reference" className="pl-10" value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
          {isLoading ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-border text-xs text-muted-foreground">
                    <th className="pb-2 font-medium">Reference</th>
                    <th className="pb-2 font-medium">Description</th>
                    <th className="pb-2 font-medium">Date</th>
                    <th className="pb-2 font-medium">Amount</th>
                    <th className="pb-2 font-medium">Status</th>
                    <th className="pb-2 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((t) => (
                    <tr key={t.id} className="border-b border-border last:border-0">
                      <td className="py-2.5 font-mono text-xs">{t.reference}</td>
                      <td className="py-2.5">{t.description}</td>
                      <td className="py-2.5 text-muted-foreground">{formatDate(t.date)}</td>
                      <td className="py-2.5 font-mono tabular">{formatCurrency(t.amount, t.currency)}</td>
                      <td className="py-2.5">
                        <Badge variant={t.status === "completed" ? "success" : t.status === "pending" ? "warning" : "danger"} className="capitalize">
                          {t.status}
                        </Badge>
                      </td>
                      <td className="py-2.5">
                        {t.status === "pending" ? (
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              disabled={mutation.isPending}
                              onClick={() => mutation.mutate({ id: t.id, action: "approve" })}
                            >
                              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              disabled={mutation.isPending}
                              onClick={() => mutation.mutate({ id: t.id, action: "reject" })}
                            >
                              <XCircle className="h-3.5 w-3.5 text-coral" />
                            </Button>
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {pendingCount > 0 && (
        <Card className="border-gold/30 bg-gold-300/10">
          <CardContent className="flex items-center gap-3 p-4">
            <ShieldAlert className="h-5 w-5 text-gold" />
            <p className="text-sm">
              {pendingCount} transaction{pendingCount === 1 ? "" : "s"} pending review — including any unconfirmed crypto deposits.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
