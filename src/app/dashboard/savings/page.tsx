"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { addFundsToGoal, createSavingsGoal, fetchAccounts, fetchSavingsGoals } from "@/lib/services/api";
import { savingsGoalSchema, type SavingsGoalValues } from "@/lib/validations";
import { formatCurrency } from "@/lib/utils";
import type { SavingsGoal } from "@/lib/types";
import { useLanguage } from "@/lib/i18n/context";

const EMOJI_OPTIONS = ["🎯", "🛟", "🏠", "✈️", "🚗", "💻", "🎓", "👶"];
const TYPE_LABELS: Record<string, string> = { flexible: "Flexible", fixed: "Fixed", auto: "Auto Save" };

export default function SavingsPage() {
  const { t } = useLanguage();
  const queryClient = useQueryClient();
  const [active, setActive] = useState<SavingsGoal | null>(null);
  const [amount, setAmount] = useState("100");
  const [sourceAccountId, setSourceAccountId] = useState<string>("");
  const [createOpen, setCreateOpen] = useState(false);

  const { data: goals, isLoading } = useQuery({ queryKey: ["savingsGoals"], queryFn: fetchSavingsGoals });
  const { data: accounts } = useQuery({ queryKey: ["accounts"], queryFn: fetchAccounts });

  const addFundsMutation = useMutation({
    mutationFn: ({ id, amount, accountId }: { id: string; amount: number; accountId: string }) =>
      addFundsToGoal(id, amount, accountId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["savingsGoals"] });
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      toast.success("Funds added to goal");
      setActive(null);
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : "Could not add funds"),
  });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SavingsGoalValues>({
    resolver: zodResolver(savingsGoalSchema),
    defaultValues: { emoji: "🎯", type: "flexible" },
  });

  const createMutation = useMutation({
    mutationFn: createSavingsGoal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["savingsGoals"] });
      toast.success("Savings goal created");
      reset({ name: "", target: undefined, emoji: "🎯", type: "flexible" });
      setCreateOpen(false);
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : "Could not create goal"),
  });

  return (
    <div>
      <TopNav title={t.pages.savings} back />

      <div className="px-5 py-4">
        <div className="mb-4 grid grid-cols-3 gap-2">
          {["Flexible", "Fixed", "Auto Save"].map((label) => (
            <Card key={label} className="p-3 text-center text-xs font-medium">
              {label}
            </Card>
          ))}
        </div>

        <Button className="mb-4 w-full" onClick={() => setCreateOpen(true)}>
          <Plus className="h-4 w-4" /> New savings goal
        </Button>

        <div className="space-y-3">
          {isLoading && <p className="text-sm text-muted-foreground">Loading goals…</p>}
          {goals?.length === 0 && !isLoading && (
            <p className="text-sm text-muted-foreground">No savings goals yet — create your first one above.</p>
          )}
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
                  onClick={() => {
                    setActive(g);
                    setSourceAccountId(accounts?.[0]?.id ?? "");
                  }}
                  disabled={g.saved >= g.target}
                >
                  {g.saved >= g.target ? "Goal reached 🎉" : "Add funds"}
                </Button>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Add funds dialog */}
      <Dialog open={!!active} onClose={() => setActive(null)}>
        {active && (
          <div>
            <h2 className="font-display text-lg font-semibold">Add funds to {active.name}</h2>

            <Label htmlFor="source-account" className="mt-4">
              From account
            </Label>
            <select
              id="source-account"
              value={sourceAccountId}
              onChange={(e) => setSourceAccountId(e.target.value)}
              className="h-12 w-full rounded-xl border border-input bg-background px-3 text-sm"
            >
              {accounts?.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.nickname} — {formatCurrency(a.availableBalance, a.currency)} available
                </option>
              ))}
            </select>

            <Label htmlFor="amount" className="mt-4">
              Amount
            </Label>
            <Input id="amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />

            <Button
              size="lg"
              className="mt-5 w-full"
              disabled={addFundsMutation.isPending || !sourceAccountId}
              onClick={() =>
                addFundsMutation.mutate({ id: active.id, amount: Number(amount), accountId: sourceAccountId })
              }
            >
              Add {formatCurrency(Number(amount) || 0)}
            </Button>
          </div>
        )}
      </Dialog>

      {/* Create goal dialog */}
      <Dialog open={createOpen} onClose={() => setCreateOpen(false)}>
        <h2 className="font-display text-lg font-semibold">New savings goal</h2>
        <form className="mt-4 space-y-4" onSubmit={handleSubmit((v) => createMutation.mutate(v))}>
          <div>
            <Label htmlFor="goal-name">Goal name</Label>
            <Input id="goal-name" placeholder="e.g. Emergency Fund" {...register("name")} />
            {errors.name && <p className="mt-1 text-xs text-coral">{errors.name.message}</p>}
          </div>
          <div>
            <Label htmlFor="goal-target">Target amount</Label>
            <Input id="goal-target" type="number" step="0.01" placeholder="0.00" {...register("target")} />
            {errors.target && <p className="mt-1 text-xs text-coral">{errors.target.message}</p>}
          </div>
          <div>
            <Label>Icon</Label>
            <div className="grid grid-cols-8 gap-2">
              {EMOJI_OPTIONS.map((e) => (
                <button
                  key={e}
                  type="button"
                  onClick={() => setValue("emoji", e)}
                  className={`flex h-10 items-center justify-center rounded-xl border text-lg ${
                    watch("emoji") === e ? "border-emerald bg-mint-100" : "border-border"
                  }`}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>
          <div>
            <Label htmlFor="goal-type">Type</Label>
            <select
              id="goal-type"
              className="h-12 w-full rounded-xl border border-input bg-background px-3 text-sm"
              {...register("type")}
            >
              {Object.entries(TYPE_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
          <Button type="submit" size="lg" className="w-full" disabled={createMutation.isPending}>
            Create goal
          </Button>
        </form>
      </Dialog>
    </div>
  );
}
