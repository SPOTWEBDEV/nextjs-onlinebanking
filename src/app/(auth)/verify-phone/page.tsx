"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { MessageSquareText } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { resendOtp } from "@/lib/services/api";

function VerifyPhoneInner() {
  const params = useSearchParams();
  const userId = params.get("userId") ?? "";

  return (
    <div className="animate-fade-up text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-mint-100">
        <MessageSquareText className="h-6 w-6 text-emerald-600" />
      </div>
      <h1 className="mt-5 font-display text-2xl font-semibold tracking-tight">Verify your phone</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        We&apos;ve texted a verification code to your phone number. Enter it to continue.
      </p>
      <Button size="lg" className="mt-8 w-full" asChild>
        <Link href={`/otp?purpose=phone&userId=${userId}&next=${encodeURIComponent(`/two-factor?userId=${userId}`)}`}>
          Enter verification code
        </Link>
      </Button>
      <button
        className="mt-4 text-sm font-medium text-emerald-600"
        onClick={async () => {
          await resendOtp(userId, "phone");
          toast.success("A new code was issued");
        }}
      >
        Resend code
      </button>
      <p className="mt-6 text-xs text-muted-foreground">
        Didn&apos;t get a code? Open Support Chat and ask an agent — they can look
        it up for you.
      </p>
    </div>
  );
}

export default function VerifyPhonePage() {
  return (
    <Suspense>
      <VerifyPhoneInner />
    </Suspense>
  );
}
