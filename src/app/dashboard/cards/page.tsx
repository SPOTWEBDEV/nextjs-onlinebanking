"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Eye, EyeOff, Lock, Settings2, Snowflake } from "lucide-react";
import { toast } from "sonner";
import { TopNav } from "@/components/nav/top-nav";
import { VaultCard } from "@/components/ui/vault-card";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog } from "@/components/ui/dialog";
import { PinKeypad } from "@/components/ui/pin-keypad";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchCards, setCardStatus } from "@/lib/services/api";
import { formatCurrency } from "@/lib/utils";
import type { BankCard } from "@/lib/types";
import { useLanguage } from "@/lib/i18n/context";

function CardView({ card }: { card: BankCard }) {
  const queryClient = useQueryClient();
  const [revealed, setRevealed] = useState(false);
  const [pinModalOpen, setPinModalOpen] = useState(false);

  const statusMutation = useMutation({
    mutationFn: (status: "active" | "frozen") => setCardStatus(card.id, status),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ["cards"] });
      toast.success(updated.status === "frozen" ? "Card frozen" : "Card unfrozen");
    },
  });

  const spentPct = (card.spentThisMonth / card.spendLimit) * 100;

  return (
    <Card className="overflow-hidden">
      <VaultCard
        label={card.type === "virtual" ? "Virtual Card" : "Physical Card"}
        variant="card"
        numberMasked={revealed ? card.fullNumber : card.numberMasked}
        holder={card.holder}
        expiry={card.expiry}
        frozen={card.status === "frozen"}
        className="rounded-none"
      />
      <div className="space-y-4 p-4">
        <div className="flex items-center justify-between">
          <Badge variant={card.status === "active" ? "success" : "danger"} className="capitalize">
            {card.status}
          </Badge>
          <button
            onClick={() => setRevealed((r) => !r)}
            className="flex items-center gap-1 text-xs font-medium text-emerald-600"
          >
            {revealed ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
            {revealed ? "Hide card number" : "Show card number"}
          </button>
        </div>

        {revealed && (
          <div className="flex items-center justify-between rounded-xl bg-muted px-3 py-2 text-xs">
            <span className="text-muted-foreground">CVV</span>
            <span className="font-mono font-semibold tabular">{card.cvv}</span>
          </div>
        )}

        <div>
          <div className="mb-1.5 flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Monthly spend limit</span>
            <span className="font-mono font-medium tabular">
              {formatCurrency(card.spentThisMonth)} / {formatCurrency(card.spendLimit)}
            </span>
          </div>
          <Progress value={spentPct} barClassName={spentPct > 85 ? "bg-coral" : undefined} />
        </div>

        <div className="grid grid-cols-3 gap-2">
          <Button
            variant={card.status === "frozen" ? "default" : "outline"}
            size="sm"
            className="flex-col gap-1 py-3"
            onClick={() => statusMutation.mutate(card.status === "frozen" ? "active" : "frozen")}
          >
            <Snowflake className="h-4 w-4" />
            <span className="text-[11px]">{card.status === "frozen" ? "Unfreeze" : "Freeze"}</span>
          </Button>
          <Button variant="outline" size="sm" className="flex-col gap-1 py-3" onClick={() => setPinModalOpen(true)}>
            <Lock className="h-4 w-4" />
            <span className="text-[11px]">Change PIN</span>
          </Button>
          <Button variant="outline" size="sm" className="flex-col gap-1 py-3" onClick={() => toast.info("Spend limit editor — demo")}>
            <Settings2 className="h-4 w-4" />
            <span className="text-[11px]">Limits</span>
          </Button>
        </div>
      </div>

      <Dialog open={pinModalOpen} onClose={() => setPinModalOpen(false)}>
        <div className="text-center">
          <h2 className="font-display text-lg font-semibold">Set a new card PIN</h2>
          <p className="mt-1 text-sm text-muted-foreground">Enter a new 4-digit PIN for this card.</p>
          <div className="mt-6">
            <PinKeypad
              onComplete={() => {
                toast.success("Card PIN updated");
                setPinModalOpen(false);
              }}
            />
          </div>
        </div>
      </Dialog>
    </Card>
  );
}

export default function CardsPage() {
  const { t } = useLanguage();
  const { data: cards, isLoading } = useQuery({ queryKey: ["cards"], queryFn: fetchCards });

  return (
    <div>
      <TopNav title={t.pages.cards} />
      <div className="space-y-4 px-5 py-4">
        {isLoading && (
          <>
            <Skeleton className="h-72 w-full rounded-2xl" />
            <Skeleton className="h-72 w-full rounded-2xl" />
          </>
        )}
        {cards?.map((c) => (
          <CardView key={c.id} card={c} />
        ))}
        <Button variant="outline" size="lg" className="w-full" onClick={() => toast.info("New virtual card issued — demo")}>
          + Issue new virtual card
        </Button>
      </div>
    </div>
  );
}
