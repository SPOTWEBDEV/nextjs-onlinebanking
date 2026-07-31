"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CalendarClock, Repeat, Star, Users, Building2, Globe2 } from "lucide-react";
import { toast } from "sonner";
import { TopNav } from "@/components/nav/top-nav";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TransferAuthorisationModal } from "@/components/dashboard/transfer-authorisation-modal";
import { fetchAccounts, fetchBeneficiaries, submitTransfer } from "@/lib/services/api";
import { transferSchema, type TransferValues } from "@/lib/validations";
import { cn, formatCurrency } from "@/lib/utils";

const transferTypes = [
  { id: "internal", label: "Internal", icon: Repeat },
  { id: "local", label: "Local Bank", icon: Building2 },
  { id: "international", label: "International", icon: Globe2 },
  { id: "beneficiary", label: "Beneficiary", icon: Users },
  { id: "scheduled", label: "Scheduled", icon: CalendarClock },
  { id: "recurring", label: "Recurring", icon: Repeat },
] as const;

export default function TransferPage() {
  const queryClient = useQueryClient();
  const [type, setType] = useState<(typeof transferTypes)[number]["id"]>("internal");
  const [modalOpen, setModalOpen] = useState(false);
  const [pendingValues, setPendingValues] = useState<TransferValues | null>(null);
  const [scheduleDate, setScheduleDate] = useState("");
  const [frequency, setFrequency] = useState("monthly");

  const { data: accounts } = useQuery({ queryKey: ["accounts"], queryFn: fetchAccounts });
  const { data: beneficiaries } = useQuery({ queryKey: ["beneficiaries"], queryFn: fetchBeneficiaries });

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<TransferValues>({ resolver: zodResolver(transferSchema) });

  const transferMutation = useMutation({
    mutationFn: submitTransfer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });

  const beneficiary = beneficiaries?.find((b) => b.id === watch("beneficiaryId"));
  const fromAccount = accounts?.find((a) => a.id === watch("fromAccountId"));
  const amount = Number(watch("amount") || 0);

  const onSubmit = (values: TransferValues) => {
    setPendingValues(values);
    setModalOpen(true);
  };

  return (
    <div>
      <TopNav title="Transfer Money" back />

      <div className="no-scrollbar flex gap-2 overflow-x-auto px-5 py-3">
        {transferTypes.map((t) => (
          <button
            key={t.id}
            onClick={() => setType(t.id)}
            className={cn(
              "flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-2 text-xs font-medium transition-colors",
              type === t.id
                ? "border-emerald bg-mint-100 text-emerald-600"
                : "border-border bg-card text-muted-foreground"
            )}
          >
            <t.icon className="h-3.5 w-3.5" />
            {t.label}
          </button>
        ))}
      </div>

      <form className="space-y-4 px-5 pb-6" onSubmit={handleSubmit(onSubmit)}>
        <Card className="p-4">
          <Label htmlFor="fromAccountId">From account</Label>
          <select
            id="fromAccountId"
            className="h-12 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none focus:border-emerald focus:ring-2 focus:ring-emerald/20"
            {...register("fromAccountId")}
          >
            <option value="">Select account</option>
            {accounts?.map((a) => (
              <option key={a.id} value={a.id}>
                {a.nickname} — {formatCurrency(a.availableBalance, a.currency)}
              </option>
            ))}
          </select>
          {errors.fromAccountId && <p className="mt-1 text-xs text-coral">{errors.fromAccountId.message}</p>}
        </Card>

        <Card className="p-4">
          <div className="mb-2 flex items-center justify-between">
            <Label htmlFor="beneficiaryId" className="mb-0">
              Beneficiary
            </Label>
            <a href="/dashboard/beneficiaries" className="text-xs font-medium text-emerald-600">
              + Add new
            </a>
          </div>
          <select
            id="beneficiaryId"
            className="h-12 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none focus:border-emerald focus:ring-2 focus:ring-emerald/20"
            {...register("beneficiaryId")}
          >
            <option value="">Select beneficiary</option>
            {beneficiaries?.map((b) => (
              <option key={b.id} value={b.id}>
                {b.favourite ? "★ " : ""}
                {b.name} — {b.bank}
              </option>
            ))}
          </select>
          {errors.beneficiaryId && <p className="mt-1 text-xs text-coral">{errors.beneficiaryId.message}</p>}
          {beneficiaries && beneficiaries.filter((b) => b.favourite).length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {beneficiaries
                .filter((b) => b.favourite)
                .map((b) => (
                  <span key={b.id} className="inline-flex items-center gap-1 rounded-full bg-mint-100 px-2.5 py-1 text-[11px] font-medium text-emerald-600">
                    <Star className="h-3 w-3 fill-emerald-600" /> {b.name}
                  </span>
                ))}
            </div>
          )}
        </Card>

        <Card className="p-4">
          <Label htmlFor="amount">Amount</Label>
          <Input id="amount" type="number" step="0.01" placeholder="0.00" {...register("amount")} />
          {errors.amount && <p className="mt-1 text-xs text-coral">{errors.amount.message}</p>}

          <Label htmlFor="note" className="mt-4">
            Reference / note (optional)
          </Label>
          <Input id="note" placeholder="e.g. Rent, invoice #221" {...register("note")} />
        </Card>

        {(type === "scheduled" || type === "recurring") && (
          <Card className="p-4">
            <Label htmlFor="scheduleDate">{type === "scheduled" ? "Send on" : "Starts on"}</Label>
            <Input id="scheduleDate" type="date" value={scheduleDate} onChange={(e) => setScheduleDate(e.target.value)} />
            {type === "recurring" && (
              <>
                <Label htmlFor="frequency" className="mt-4">
                  Frequency
                </Label>
                <select
                  id="frequency"
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value)}
                  className="h-12 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none focus:border-emerald focus:ring-2 focus:ring-emerald/20"
                >
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                </select>
              </>
            )}
          </Card>
        )}

        <Button type="submit" size="lg" className="w-full">
          Review transfer
        </Button>
      </form>

      {pendingValues && beneficiary && fromAccount && (
        <TransferAuthorisationModal
          open={modalOpen}
          onClose={() => {
            setModalOpen(false);
            if (transferMutation.isSuccess) {
              reset();
              setPendingValues(null);
              transferMutation.reset();
            }
          }}
          amount={amount}
          currency={fromAccount.currency}
          recipientName={beneficiary.name}
          reference={`TRF-${Date.now().toString().slice(-8)}`}
          fee={type === "international" ? 4.99 : 0}
          onConfirmed={async () => {
            try {
              await transferMutation.mutateAsync(pendingValues);
            } catch (e) {
              toast.error(e instanceof Error ? e.message : "Transfer failed");
              throw e;
            }
          }}
        />
      )}
    </div>
  );
}
