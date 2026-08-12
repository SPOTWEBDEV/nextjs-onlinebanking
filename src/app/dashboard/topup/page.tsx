"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Loader2, Smartphone, User, Users } from "lucide-react";
import { toast } from "sonner";
import { TopNav } from "@/components/nav/top-nav";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { delay, cn } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n/context";

const amounts = [10, 20, 50, 100];

export default function TopUpPage() {
  const { t } = useLanguage();
  const [target, setTarget] = useState<"self" | "others">("self");
  const [phone, setPhone] = useState("+351 912 345 678");
  const [amount, setAmount] = useState(20);

  const mutation = useMutation({
    mutationFn: async () => {
      await delay(800);
      return { ok: true };
    },
    onSuccess: () => toast.success(`Recharged ${phone} with $${amount}`),
  });

  return (
    <div>
      <TopNav title={t.pages.mobileTopup} back />
      <div className="space-y-4 px-5 py-4">
        <div className="flex gap-2">
          <button
            onClick={() => setTarget("self")}
            className={cn(
              "flex flex-1 items-center justify-center gap-2 rounded-2xl border py-3 text-sm font-medium",
              target === "self" ? "border-emerald bg-mint-100 text-emerald-600" : "border-border"
            )}
          >
            <User className="h-4 w-4" /> Self
          </button>
          <button
            onClick={() => setTarget("others")}
            className={cn(
              "flex flex-1 items-center justify-center gap-2 rounded-2xl border py-3 text-sm font-medium",
              target === "others" ? "border-emerald bg-mint-100 text-emerald-600" : "border-border"
            )}
          >
            <Users className="h-4 w-4" /> Others
          </button>
        </div>

        <Card className="p-4">
          <Label htmlFor="phone">Phone number</Label>
          <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} disabled={target === "self"} />

          <Label className="mt-4">Amount</Label>
          <div className="grid grid-cols-4 gap-2">
            {amounts.map((a) => (
              <button
                key={a}
                onClick={() => setAmount(a)}
                className={cn(
                  "rounded-xl border py-2.5 text-sm font-semibold",
                  amount === a ? "border-emerald bg-mint-100 text-emerald-600" : "border-border"
                )}
              >
                ${a}
              </button>
            ))}
          </div>

          <Button size="lg" className="mt-5 w-full" disabled={mutation.isPending} onClick={() => mutation.mutate()}>
            {mutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Smartphone className="h-4 w-4" />}
            Recharge ${amount}
          </Button>
        </Card>
      </div>
    </div>
  );
}
