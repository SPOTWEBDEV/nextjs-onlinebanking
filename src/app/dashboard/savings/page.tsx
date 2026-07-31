"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { TopNav } from "@/components/nav/top-nav";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { addFundsToGoal, fetchSavingsGoals } from "@/lib/services/api";
import { formatCurrency } from "@/lib/utils";
import type { SavingsGoal } from "@/lib/types";

export default function SavingsPage() {
  const queryClient = useQueryClient();
  const [active, setActive] = useState<SavingsGoal | null>(null);
  const [amount, setAmount] = useState("100");

  const { data: goals, isLoading } = useQuery({ queryKey: ["savingsGoals"], queryFn: fetchSavingsGoals });

  const mutation = useMutation({
    mutationFn: ({ id, amount }: { id: string; amount: number }) => addFundsToGoal(id, amount),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["savingsGoals"] });
      toast.success("Funds added to goal");
      setActive(null);
    },
  });

  return (
    <div>
      <TopNav title="Savings" back />

      <div className="px-5 py-4">
        <div className="mb-4 grid grid-cols-3 gap-2">
          {["Flexible", "Fixed", "Auto Save"].map((t) => (
            <Card key={t} className="p-3 text-center text-xs font-medium">
              {t}
            </Card>
          ))}
        </div>

        <Button className="mb-4 w-full" onClick={() => toast.info("Goal creation form — demo")}>
          <Plus className="h-4 w-4" /> New savings goal
        </Button>

        <div className="space-y-3">
          {isLoading && <p className="text-sm text-muted-foreground">Loading goals…</p>}
          {goals?.map((g) => {
            const pct = (g.saved / g.target) * 100;
            return (
              <Card key={g.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{g.emoji}</span>
                    <div>
                      <p className="text-sm font-medium">{g.name}</p>
                      <Badge variant="neutral" className="mt-0.5 capitalize">{g.type}</Badge>
                    </div>
                  </div>
                  <p className="font-mono text-sm font-semibold tabular">{Math.round(pct)}%</p>
                </div>
                <div className="mt-3">
                  <Progress value={pct} />
                  <p className="mt-1.5 text-xs text-muted-foreground">
                    {formatCurrency(g.saved)} of {formatCurrency(g.target)}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3 w-full"
                  onClick={() => setActive(g)}
                  disabled={g.saved >= g.target}
                >
                  {g.saved >= g.target ? "Goal reached 🎉" : "Add funds"}
                </Button>
              </Card>
            );
          })}
        </div>
      </div>

      <Dialog open={!!active} onClose={() => setActive(null)}>
        {active && (
          <div>
            <h2 className="font-display text-lg font-semibold">Add funds to {active.name}</h2>
            <Label htmlFor="amount" className="mt-4">
              Amount
            </Label>
            <Input id="amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
            <Button
              size="lg"
              className="mt-5 w-full"
              disabled={mutation.isPending}
              onClick={() => mutation.mutate({ id: active.id, amount: Number(amount) })}
            >
              Add {formatCurrency(Number(amount) || 0)}
            </Button>
          </div>
        )}
      </Dialog>
    </div>
  );
}
