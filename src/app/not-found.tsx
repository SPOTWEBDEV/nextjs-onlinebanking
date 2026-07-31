import Link from "next/link";
import { Compass } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-porcelain px-6 text-center dark:bg-ink-950">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-mint-100">
        <Compass className="h-7 w-7 text-emerald-600" />
      </div>
      <h1 className="mt-6 font-display text-3xl font-semibold tracking-tight">Page not found</h1>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        The page you&apos;re looking for doesn&apos;t exist or may have moved.
      </p>
      <Button className="mt-6" asChild>
        <Link href="/">Back to home</Link>
      </Button>
    </div>
  );
}
