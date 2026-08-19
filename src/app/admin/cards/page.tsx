"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/ui/stat-card";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { CreditCard, Snowflake, ShieldCheck } from "lucide-react";
import { fetchAllCards, setAdminCardStatus } from "@/lib/services/admin-api";
import { formatCurrency } from "@/lib/utils";

export default function AdminCardsPage() {
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useQuery({ queryKey: ["admin", "all-cards"], queryFn: fetchAllCards });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: "active" | "frozen" }) => setAdminCardStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "all-cards"] });
      toast.success("Card status updated");
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : "Could not update card"),
  });

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight">Card Management</h1>
        <p className="text-sm text-muted-foreground">Manage physical and virtual cards across every customer.</p>
      </div>

      {error && <p className="text-sm text-coral">{error instanceof Error ? error.message : "Could not load cards."}</p>}

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {isLoading || !data ? (
          [1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-24 w-full rounded-2xl" />)
        ) : (
          <>
            <StatCard label="Physical cards" value={data.stats.physical.toLocaleString()} icon={CreditCard} />
            <StatCard label="Virtual cards" value={data.stats.virtual.toLocaleString()} icon={CreditCard} />
            <StatCard label="Frozen cards" value={data.stats.frozen.toLocaleString()} icon={Snowflake} />
            <StatCard label="Blocked cards" value={data.stats.blocked.toLocaleString()} icon={ShieldCheck} />
          </>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All cards ({data?.stats.total ?? 0})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              {[1, 2].map((i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : !data || data.cards.length === 0 ? (
            <EmptyState icon={CreditCard} title="No cards yet" description="Cards appear here once customers issue one." />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-border text-xs text-muted-foreground">
                    <th className="pb-2 font-medium">Card</th>
                    <th className="pb-2 font-medium">Owner</th>
                    <th className="pb-2 font-medium">Type</th>
                    <th className="pb-2 font-medium">Status</th>
                    <th className="pb-2 font-medium">Spend limit</th>
                    <th className="pb-2 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data.cards.map((c) => (
                    <tr key={c.id} className="border-b border-border last:border-0">
                      <td className="py-2.5 font-mono text-xs">{c.numberMasked}</td>
                      <td className="py-2.5">
                        <p className="font-medium">{c.ownerName}</p>
                        <p className="text-xs text-muted-foreground">{c.ownerEmail}</p>
                      </td>
                      <td className="py-2.5 capitalize">{c.type}</td>
                      <td className="py-2.5">
                        <Badge variant={c.status === "active" ? "success" : "danger"} className="capitalize">{c.status}</Badge>
                      </td>
                      <td className="py-2.5 font-mono tabular">{formatCurrency(c.spendLimit, c.currency)}</td>
                      <td className="py-2.5">
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={statusMutation.isPending}
                          onClick={() => statusMutation.mutate({ id: c.id, status: c.status === "active" ? "frozen" : "active" })}
                        >
                          {c.status === "active" ? "Freeze" : "Unfreeze"}
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
    </div>
  );
}
