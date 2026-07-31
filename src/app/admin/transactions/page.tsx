"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Search, ShieldAlert, CheckCircle2, XCircle, RotateCcw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchTransactions } from "@/lib/services/api";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function AdminTransactionsPage() {
  const [query, setQuery] = useState("");
  const { data: allTransactions = [], isLoading } = useQuery({
    queryKey: ["transactions", "all"],
    queryFn: () => fetchTransactions(),
  });
  const transactions = allTransactions.filter(
    (t) => t.description.toLowerCase().includes(query.toLowerCase()) || t.reference.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight">Transaction Management</h1>
        <p className="text-sm text-muted-foreground">Approve, reject, and monitor transactions across the platform.</p>
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
                      <div className="flex gap-1">
                        <Button size="sm" variant="ghost" onClick={() => toast.success("Transaction approved")}>
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => toast.error("Transaction rejected")}>
                          <XCircle className="h-3.5 w-3.5 text-coral" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => toast.info("Transaction reversed")}>
                          <RotateCcw className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card className="border-gold/30 bg-gold-300/10">
        <CardContent className="flex items-center gap-3 p-4">
          <ShieldAlert className="h-5 w-5 text-gold" />
          <p className="text-sm">3 transactions flagged for suspicious activity review in the last 24 hours.</p>
        </CardContent>
      </Card>
    </div>
  );
}
