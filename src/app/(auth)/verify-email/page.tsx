"use client";

import Link from "next/link";
import { MailCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function VerifyEmailPage() {
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
        <Link href="/otp?purpose=email&next=/verify-phone">Enter verification code</Link>
      </Button>
      <button className="mt-4 text-sm font-medium text-emerald-600">Resend email</button>
    </div>
  );
}
