"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-porcelain px-6 text-center dark:bg-ink-950">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-coral-100">
        <AlertTriangle className="h-7 w-7 text-coral" />
      </div>
      <h1 className="mt-6 font-display text-3xl font-semibold tracking-tight">Something went wrong</h1>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        An unexpected error occurred. Try again, or contact support if it keeps happening.
      </p>
      <Button className="mt-6" onClick={reset}>
        Try again
      </Button>
    </div>
  );
}
