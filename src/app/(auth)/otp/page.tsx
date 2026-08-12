"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { KeyRound, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { OtpField } from "@/components/ui/otp-field";
import { resendOtp, verifyOtp } from "@/lib/services/api";
import { useSessionStore } from "@/lib/store";
import { useLanguage } from "@/lib/i18n/context";
import type { User } from "@/lib/types";

const purposeCopy: Record<string, { title: string; description: string }> = {
  login: { title: "Two-factor authentication", description: "Enter the 6-digit code sent for this sign-in." },
  email: { title: "Verify your email", description: "Enter the 6-digit code we sent to your email address." },
  phone: { title: "Verify your phone", description: "Enter the 6-digit code we texted to your phone number." },
  default: { title: "Enter verification code", description: "Enter the 6-digit code to continue." },
};

function OtpPageInner() {
  const { t } = useLanguage();
  const router = useRouter();
  const params = useSearchParams();
  const purpose = (params.get("purpose") ?? "default") as "login" | "email" | "phone" | "default";
  const userId = params.get("userId") ?? "";
  const next = params.get("next") ?? "/dashboard";
  const copy = purposeCopy[purpose] ?? purposeCopy.default;
  const login = useSessionStore((s) => s.login);

  const [code, setCode] = useState("");

  const mutation = useMutation({
    mutationFn: (value: string) => verifyOtp(userId, value, purpose === "default" ? "login" : purpose),
    onSuccess: (data) => {
      if (purpose === "login" || purpose === "phone") {
        login(data.user as User);
      }
      toast.success("Verified");
      router.push(next);
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : "Incorrect code, try again"),
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
        disabled={code.length !== 6 || mutation.isPending || !userId}
        onClick={() => mutation.mutate(code)}
      >
        {mutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
        {t.auth.verifyCode}
      </Button>

      <button
        className="mx-auto mt-5 block text-sm font-medium text-emerald-600"
        onClick={async () => {
          await resendOtp(userId, purpose === "default" ? "login" : purpose);
          toast.success("A new code was issued");
        }}
      >
        {t.auth.resendCode}
      </button>
      <p className="mt-6 text-center text-xs text-muted-foreground">{t.auth.demoCodeTip}</p>
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
