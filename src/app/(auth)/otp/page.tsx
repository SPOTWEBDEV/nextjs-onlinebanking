"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { KeyRound, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { OtpField } from "@/components/ui/otp-field";
import { mockVerifyOtp } from "@/lib/services/api";
import { useSessionStore } from "@/lib/store";

const purposeCopy: Record<string, { title: string; description: string }> = {
  login: { title: "Two-factor authentication", description: "Enter the 6-digit code from your authenticator app." },
  email: { title: "Verify your email", description: "Enter the 6-digit code we sent to your email address." },
  phone: { title: "Verify your phone", description: "Enter the 6-digit code we texted to your phone number." },
  default: { title: "Enter verification code", description: "Enter the 6-digit code to continue." },
};

function OtpPageInner() {
  const router = useRouter();
  const params = useSearchParams();
  const purpose = params.get("purpose") ?? "default";
  const next = params.get("next") ?? "/dashboard";
  const copy = purposeCopy[purpose] ?? purposeCopy.default;
  const login = useSessionStore((s) => s.login);

  const [code, setCode] = useState("");

  const mutation = useMutation({
    mutationFn: (value: string) => mockVerifyOtp(value),
    onSuccess: () => {
      login();
      toast.success("Verified");
      router.push(next);
    },
    onError: () => toast.error("Incorrect code, try again"),
  });

  return (
    <div className="animate-fade-up">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-mint-100">
        <KeyRound className="h-6 w-6 text-emerald-600" />
      </div>
      <h1 className="mt-5 text-center font-display text-2xl font-semibold tracking-tight">{copy.title}</h1>
      <p className="mt-1.5 text-center text-sm text-muted-foreground">{copy.description}</p>

      <div className="mt-8">
        <OtpField value={code} onChange={setCode} />
      </div>

      <Button
        size="lg"
        className="mt-8 w-full"
        disabled={code.length !== 6 || mutation.isPending}
        onClick={() => mutation.mutate(code)}
      >
        {mutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
        Verify
      </Button>

      <button
        className="mx-auto mt-5 block text-sm font-medium text-emerald-600"
        onClick={() => toast.info("A new code was sent (demo — use any 6 digits)")}
      >
        Resend code
      </button>
      <p className="mt-6 text-center text-xs text-muted-foreground">Demo tip: any 6 digits will verify successfully.</p>
    </div>
  );
}

export default function OtpPage() {
  return (
    <Suspense>
      <OtpPageInner />
    </Suspense>
  );
}
