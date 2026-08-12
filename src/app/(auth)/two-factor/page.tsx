"use client";

import { useRouter } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

export default function TwoFactorSetupPage() {
  const router = useRouter();

  return (
    <div className="animate-fade-up text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-mint-100">
        <ShieldCheck className="h-6 w-6 text-emerald-600" />
      </div>
      <h1 className="mt-5 font-display text-2xl font-semibold tracking-tight">Set up two-factor authentication</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Scan this code with an authenticator app like Google Authenticator or Authy.
      </p>

      <Card className="mx-auto mt-6 flex h-48 w-48 items-center justify-center p-4">
        <div
          className="h-full w-full rounded-lg"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, #0B1220 0, #0B1220 6px, transparent 6px, transparent 12px), repeating-linear-gradient(-45deg, #0B1220 0, #0B1220 6px, transparent 6px, transparent 12px)",
            backgroundBlendMode: "multiply",
            opacity: 0.85,
          }}
        />
      </Card>
      <p className="mt-3 font-mono text-xs tracking-widest text-muted-foreground">AURA-7X2K-9QLF-3A0Z</p>

      <Button
        size="lg"
        className="mt-8 w-full"
        onClick={() => {
          toast.success("Two-factor authentication enabled");
          router.push("/dashboard");
        }}
      >
        I&apos;ve scanned the code
      </Button>
      <button
        className="mt-4 text-sm font-medium text-muted-foreground"
        onClick={() => router.push("/dashboard")}
      >
        Skip for now
      </button>
    </div>
  );
}
