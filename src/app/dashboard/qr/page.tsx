"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, QrCode, ScanLine } from "lucide-react";
import { toast } from "sonner";
import { TopNav } from "@/components/nav/top-nav";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

function QrPattern({ seed }: { seed: string }) {
  const cells = useMemo(() => {
    let h = 0;
    for (const c of seed) h = (h * 31 + c.charCodeAt(0)) >>> 0;
    return Array.from({ length: 121 }, (_, i) => {
      h = (h * 1103515245 + 12345) >>> 0;
      return (h >> (i % 16)) % 3 === 0;
    });
  }, [seed]);

  return (
    <div className="grid grid-cols-11 gap-[3px] rounded-xl bg-white p-3">
      {cells.map((on, i) => (
        <div key={i} className={cn("aspect-square rounded-[2px]", on ? "bg-ink-950" : "bg-transparent")} />
      ))}
    </div>
  );
}

export default function QrPaymentsPage() {
  const [tab, setTab] = useState<"generate" | "scan">("generate");
  const [amount, setAmount] = useState("25.00");
  const [confirmOpen, setConfirmOpen] = useState(false);

  return (
    <div>
      <TopNav title="QR Payments" back />

      <div className="px-5 py-4">
        <div className="mb-5 flex gap-2">
          <button
            onClick={() => setTab("generate")}
            className={cn(
              "flex flex-1 items-center justify-center gap-2 rounded-2xl border py-3 text-sm font-medium",
              tab === "generate" ? "border-emerald bg-mint-100 text-emerald-600" : "border-border"
            )}
          >
            <QrCode className="h-4 w-4" /> Generate
          </button>
          <button
            onClick={() => setTab("scan")}
            className={cn(
              "flex flex-1 items-center justify-center gap-2 rounded-2xl border py-3 text-sm font-medium",
              tab === "scan" ? "border-emerald bg-mint-100 text-emerald-600" : "border-border"
            )}
          >
            <ScanLine className="h-4 w-4" /> Scan
          </button>
        </div>

        {tab === "generate" ? (
          <Card className="p-5 text-center">
            <QrPattern seed={amount} />
            <div className="mt-4 text-left">
              <Label htmlFor="amount">Amount to request</Label>
              <Input id="amount" type="number" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} />
            </div>
            <p className="mt-3 text-xs text-muted-foreground">Share this code to receive ${amount} instantly.</p>
          </Card>
        ) : (
          <Card className="flex flex-col items-center gap-4 p-5 text-center">
            <div className="relative flex h-56 w-56 items-center justify-center rounded-2xl border-2 border-dashed border-emerald/40 bg-muted">
              <ScanLine className="h-8 w-8 text-emerald-600" />
              <div className="absolute inset-4 rounded-xl border-2 border-emerald/60" />
            </div>
            <p className="text-sm text-muted-foreground">Point your camera at a Banco Aurora QR code</p>
            <Button onClick={() => setConfirmOpen(true)}>Simulate scan</Button>
          </Card>
        )}
      </div>

      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-mint-100">
            <CheckCircle2 className="h-6 w-6 text-emerald-600" />
          </div>
          <h2 className="mt-4 font-display text-lg font-semibold">Confirm payment</h2>
          <p className="mt-1 text-sm text-muted-foreground">Pay $25.00 to Orbit Studio LLC</p>
          <Button
            className="mt-6 w-full"
            onClick={() => {
              toast.success("Payment of $25.00 sent");
              setConfirmOpen(false);
            }}
          >
            Confirm & Pay
          </Button>
        </div>
      </Dialog>
    </div>
  );
}
