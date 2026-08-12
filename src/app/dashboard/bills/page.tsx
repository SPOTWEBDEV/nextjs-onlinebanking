"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import {
  Droplets,
  Lightbulb,
  Receipt,
  Shield,
  Smartphone,
  Tv,
  Wifi,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { TopNav } from "@/components/nav/top-nav";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { billPaymentSchema, type BillPaymentValues } from "@/lib/validations";
import { delay, cn } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n/context";

const billers = [
  { id: "electricity", label: "Electricity", icon: Lightbulb },
  { id: "water", label: "Water", icon: Droplets },
  { id: "internet", label: "Internet", icon: Wifi },
  { id: "tv", label: "TV Subscription", icon: Tv },
  { id: "airtime", label: "Mobile Airtime", icon: Smartphone },
  { id: "data", label: "Data Bundles", icon: Wifi },
  { id: "tax", label: "Taxes", icon: Receipt },
  { id: "insurance", label: "Insurance", icon: Shield },
];

export default function BillsPage() {
  const { t } = useLanguage();
  const [selected, setSelected] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<BillPaymentValues>({ resolver: zodResolver(billPaymentSchema) });

  const mutation = useMutation({
    mutationFn: async (_v: BillPaymentValues) => {
      await delay(900);
      return { ok: true };
    },
    onSuccess: () => toast.success("Bill payment successful"),
  });

  return (
    <div>
      <TopNav title={t.pages.payBills} back />

      <div className="px-5 py-4">
        <div className="grid grid-cols-4 gap-3">
          {billers.map((b) => (
            <button
              key={b.id}
              onClick={() => {
                setSelected(b.id);
                setValue("biller", b.id);
              }}
              className={cn(
                "flex flex-col items-center gap-2 rounded-2xl border p-3 text-center transition-colors",
                selected === b.id ? "border-emerald bg-mint-100" : "border-border bg-card"
              )}
            >
              <b.icon className={cn("h-5 w-5", selected === b.id ? "text-emerald-600" : "text-muted-foreground")} />
              <span className="text-[10px] font-medium leading-tight">{b.label}</span>
            </button>
          ))}
        </div>

        {selected && (
          <Card className="mt-5 p-4">
            <form className="space-y-4" onSubmit={handleSubmit((v) => mutation.mutate(v))}>
              <div>
                <Label htmlFor="accountOrMeter">Account / meter number</Label>
                <Input id="accountOrMeter" placeholder="e.g. 0022441" {...register("accountOrMeter")} />
                {errors.accountOrMeter && <p className="mt-1 text-xs text-coral">{errors.accountOrMeter.message}</p>}
              </div>
              <div>
                <Label htmlFor="amount">Amount</Label>
                <Input id="amount" type="number" step="0.01" placeholder="0.00" {...register("amount")} />
                {errors.amount && <p className="mt-1 text-xs text-coral">{errors.amount.message}</p>}
              </div>
              <Button type="submit" size="lg" className="w-full" disabled={mutation.isPending}>
                {mutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                Pay bill
              </Button>
            </form>
          </Card>
        )}
      </div>
    </div>
  );
}
