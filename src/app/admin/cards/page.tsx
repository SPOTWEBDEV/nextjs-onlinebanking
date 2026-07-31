"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/ui/stat-card";
import { Skeleton } from "@/components/ui/skeleton";
import { CreditCard, Snowflake, ShieldCheck } from "lucide-react";
import { fetchCards, setCardStatus } from "@/lib/services/api";
import { formatCurrency } from "@/lib/utils";

export default function AdminCardsPage() {
  const queryClient = useQueryClient();
  const { data: cards = [], isLoading } = useQuery({ queryKey: ["cards"], queryFn: fetchCards });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: "active" | "frozen" }) => setCardStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cards"] });
      toast.success("Card status updated");
    },
  });

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight">Card Management</h1>
        <p className="text-sm text-muted-foreground">Manage physical and virtual cards, limits, and freezes.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Physical cards issued" value="41,208" icon={CreditCard} />
        <StatCard label="Virtual cards issued" value="22,745" icon={CreditCard} />
        <StatCard label="Frozen cards" value="318" icon={Snowflake} />
        <StatCard label="Fraud holds" value="12" icon={ShieldCheck} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Card records (live from Postgres)</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              {[1, 2].map((i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-border text-xs text-muted-foreground">
                    <th className="pb-2 font-medium">Card</th>
                    <th className="pb-2 font-medium">Type</th>
                    <th className="pb-2 font-medium">Status</th>
                    <th className="pb-2 font-medium">Spend limit</th>
                    <th className="pb-2 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {cards.map((c) => (
                    <tr key={c.id} className="border-b border-border last:border-0">
                      <td className="py-2.5">
                        <p className="font-mono text-xs">{c.numberMasked}</p>
                        <p className="text-xs text-muted-foreground">{c.holder}</p>
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
