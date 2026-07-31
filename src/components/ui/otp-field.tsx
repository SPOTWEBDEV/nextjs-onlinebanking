"use client";

import * as React from "react";
import { OTPInput, SlotProps } from "input-otp";
import { cn } from "@/lib/utils";

function Slot(props: SlotProps) {
  return (
    <div
      className={cn(
        "flex h-14 w-12 items-center justify-center rounded-xl border border-input bg-background font-mono text-xl tabular",
        props.isActive && "border-emerald ring-2 ring-emerald/20"
      )}
    >
      {props.char ?? ""}
    </div>
  );
}

export function OtpField({
  value,
  onChange,
  length = 6,
}: {
  value: string;
  onChange: (value: string) => void;
  length?: number;
}) {
  return (
    <OTPInput
      value={value}
      onChange={onChange}
      maxLength={length}
      containerClassName="flex items-center gap-2 justify-center"
      render={({ slots }) => (
        <>
          {slots.map((slot, idx) => (
            <Slot key={idx} {...slot} />
          ))}
        </>
      )}
    />
  );
}
