"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { MailCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { resendOtp } from "@/lib/services/api";

function VerifyEmailInner() {
  const params = useSearchParams();
  const userId = params.get("userId") ?? "";

  return (
    <div className="animate-fade-up text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-mint-100">
        <MailCheck className="h-6 w-6 text-emerald-600" />
      </div>
      <h1 className="mt-5 font-display text-2xl font-semibold tracking-tight">Verify your email</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        We&apos;ve sent a verification code to your email address. Enter it to activate your account.
      </p>
      <Button size="lg" className="mt-8 w-full" asChild>
        <Link href={`/otp?purpose=email&userId=${userId}&next=${encodeURIComponent(`/verify-phone?userId=${userId}`)}`}>
          Enter verification code
        </Link>
      </Button>
      <button
        className="mt-4 text-sm font-medium text-emerald-600"
        onClick={async () => {
          await resendOtp(userId, "email");
          toast.success("A new code was issued");
        }}
      >
        Resend email
      </button>
      <p className="mt-6 text-xs text-muted-foreground">
        Didn&apos;t get a code? Open Support Chat and ask an agent — they can look
        it up for you.
      </p>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense>
      <VerifyEmailInner />
    </Suspense>
  );
}
