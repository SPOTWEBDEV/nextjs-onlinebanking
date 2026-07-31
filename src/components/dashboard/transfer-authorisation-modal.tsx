"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Fingerprint, Loader2, ShieldCheck } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Dialog } from "@/components/ui/dialog";
import { PinKeypad } from "@/components/ui/pin-keypad";
import { Button } from "@/components/ui/button";
import { verifyTransferPin } from "@/lib/services/api";
import { formatCurrency } from "@/lib/utils";

export function TransferAuthorisationModal({
  open,
  onClose,
  amount,
  currency,
  recipientName,
  reference,
  fee = 0,
  onConfirmed,
}: {
  open: boolean;
  onClose: () => void;
  amount: number;
  currency: string;
  recipientName: string;
  reference: string;
  fee?: number;
  onConfirmed: () => void | Promise<void>;
}) {
  const [stage, setStage] = React.useState<"pin" | "processing" | "success">("pin");
  const [error, setError] = React.useState<string | undefined>();

  const verifyMutation = useMutation({
    mutationFn: (pin: string) => verifyTransferPin(pin),
    onSuccess: async (valid) => {
      if (!valid) {
        setError("Incorrect PIN, try again");
        return;
      }
      setError(undefined);
      setStage("processing");
      await onConfirmed();
      setStage("success");
    },
    onError: () => setError("Something went wrong, try again"),
  });

  React.useEffect(() => {
    if (open) {
      setStage("pin");
      setError(undefined);
    }
  }, [open]);

  return (
    <Dialog open={open} onClose={onClose}>
      {stage === "pin" && (
        <div className="text-center">
          <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl bg-vault-gradient font-display text-sm font-bold text-gold-300">
            M
          </div>
          <h2 className="mt-4 font-display text-lg font-semibold tracking-tight">Authorise transfer</h2>

          <div className="mt-4 space-y-2 rounded-2xl bg-muted p-4 text-left text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Amount</span>
              <span className="font-mono font-semibold tabular">{formatCurrency(amount, currency)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">To</span>
              <span className="font-medium">{recipientName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Transfer fee</span>
              <span className="font-mono tabular">{fee === 0 ? "Free" : formatCurrency(fee, currency)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Reference</span>
              <span className="font-mono text-xs tabular">{reference}</span>
            </div>
          </div>

          <p className="mt-5 text-xs font-medium text-muted-foreground">Enter your 4-digit transfer PIN</p>
          <div className="mt-4">
            <PinKeypad
              onComplete={(pin) => verifyMutation.mutate(pin)}
              onBiometric={() => {
                toast.info("Face ID / fingerprint placeholder — enter PIN 1234 to continue");
              }}
              error={error}
            />
          </div>
          <p className="mt-4 text-[11px] text-muted-foreground">Demo PIN: 1234</p>
        </div>
      )}

      {stage === "processing" && (
        <div className="flex flex-col items-center py-10 text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            className="flex h-14 w-14 items-center justify-center rounded-full bg-mint-100"
          >
            <Loader2 className="h-6 w-6 text-emerald-600" />
          </motion.div>
          <p className="mt-4 font-display text-base font-semibold">Sending your transfer…</p>
          <p className="mt-1 text-sm text-muted-foreground">This usually takes a few seconds.</p>
        </div>
      )}

      {stage === "success" && (
        <div className="flex flex-col items-center py-6 text-center">
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="flex h-16 w-16 items-center justify-center rounded-full bg-mint-100"
          >
            <CheckCircle2 className="h-8 w-8 text-emerald-600" />
          </motion.div>
          <p className="mt-4 font-display text-lg font-semibold">Transfer sent</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {formatCurrency(amount, currency)} to {recipientName}
          </p>
          <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
            <ShieldCheck className="h-3.5 w-3.5" /> Secured with 256-bit encryption
          </div>
          <Button className="mt-6 w-full" onClick={onClose}>
            Done
          </Button>
        </div>
      )}
    </Dialog>
  );
}
