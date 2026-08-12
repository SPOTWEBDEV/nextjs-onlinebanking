"use client";

import * as React from "react";
import { Delete, Fingerprint, ScanFace } from "lucide-react";
import { cn } from "@/lib/utils";

export function PinKeypad({
  length = 4,
  onComplete,
  onBiometric,
  error,
}: {
  length?: number;
  onComplete: (pin: string) => void;
  onBiometric?: () => void;
  error?: string;
}) {
  const [pin, setPin] = React.useState("");

  const handlePress = (digit: string) => {
    if (pin.length >= length) return;
    const next = pin + digit;
    setPin(next);
    if (next.length === length) {
      onComplete(next);
      setTimeout(() => setPin(""), 350);
    }
  };

  const handleBackspace = () => setPin((p) => p.slice(0, -1));

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex items-center gap-3">
        {Array.from({ length }).map((_, i) => (
          <span
            key={i}
            className={cn(
              "h-3.5 w-3.5 rounded-full border-2 transition-all",
              i < pin.length ? "scale-110 border-emerald bg-emerald" : "border-border bg-transparent",
              error && "border-coral"
            )}
          />
        ))}
      </div>
      {error && <p className="-mt-4 text-xs font-medium text-coral">{error}</p>}

      <div className="grid grid-cols-3 gap-3">
        {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((d) => (
          <button
            key={d}
            type="button"
            onClick={() => handlePress(d)}
            className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted font-display text-lg font-semibold transition-transform active:scale-90"
          >
            {d}
          </button>
        ))}
        <button
          type="button"
          onClick={onBiometric}
          className="flex h-14 w-14 items-center justify-center rounded-2xl text-emerald transition-transform active:scale-90"
          aria-label="Use Face ID"
        >
          <ScanFace className="h-6 w-6" />
        </button>
        <button
          type="button"
          onClick={() => handlePress("0")}
          className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted font-display text-lg font-semibold transition-transform active:scale-90"
        >
          0
        </button>
        <button
          type="button"
          onClick={handleBackspace}
          className="flex h-14 w-14 items-center justify-center rounded-2xl text-muted-foreground transition-transform active:scale-90"
          aria-label="Delete"
        >
          <Delete className="h-5 w-5" />
        </button>
      </div>

      {onBiometric && (
        <button
          type="button"
          onClick={onBiometric}
          className="flex items-center gap-2 text-xs font-medium text-muted-foreground"
        >
          <Fingerprint className="h-4 w-4" /> Use fingerprint instead
        </button>
      )}
    </div>
  );
}
