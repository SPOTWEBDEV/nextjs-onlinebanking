"use client";

import * as React from "react";
import { Download, Share, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

function isIos() {
  if (typeof window === "undefined") return false;
  return /iphone|ipad|ipod/i.test(window.navigator.userAgent);
}

function isStandalone() {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia?.("(display-mode: standalone)").matches ||
    (window.navigator as unknown as { standalone?: boolean }).standalone === true
  );
}

const DISMISS_KEY = "banco-aurora-install-dismissed";

/**
 * Surfaces a visible "Install app" banner instead of relying on the
 * easy-to-miss browser address-bar icon.
 *
 * - Chrome/Edge/Android: captures `beforeinstallprompt` and triggers the
 *   real native install flow when tapped.
 * - iOS Safari: never fires `beforeinstallprompt` (Apple doesn't support
 *   it), so we show manual "Share → Add to Home Screen" instructions
 *   instead.
 * - Already installed (standalone display mode): shows nothing.
 */
export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = React.useState<BeforeInstallPromptEvent | null>(null);
  const [showIosHint, setShowIosHint] = React.useState(false);
  const [dismissed, setDismissed] = React.useState(true);

  React.useEffect(() => {
    if (isStandalone()) return;
    if (typeof window !== "undefined" && sessionStorage.getItem(DISMISS_KEY)) return;
    setDismissed(false);

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", handler);

    if (isIos()) setShowIosHint(true);

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const dismiss = () => {
    setDismissed(true);
    sessionStorage.setItem(DISMISS_KEY, "1");
  };

  if (dismissed || (!deferredPrompt && !showIosHint)) return null;

  return (
    <div className="glass fixed inset-x-4 bottom-24 z-40 mx-auto flex max-w-app items-center gap-3 rounded-2xl border p-3 shadow-card animate-fade-up">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-vault-gradient font-display text-sm font-bold text-gold-300">
        A
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium">Instalar o Banco Aurora</p>
        <p className="truncate text-xs text-muted-foreground">
          {showIosHint && !deferredPrompt
            ? "Toque em Partilhar e depois \u201cAdicionar ao Ecrã Principal\u201d"
            : "Acesso rápido a partir do seu ecrã principal"}
        </p>
      </div>
      {deferredPrompt ? (
        <Button
          size="sm"
          onClick={async () => {
            await deferredPrompt.prompt();
            const choice = await deferredPrompt.userChoice;
            if (choice.outcome !== "accepted") {
              // Keep the deferred prompt available in case they change their mind.
            }
            setDeferredPrompt(null);
            dismiss();
          }}
        >
          <Download className="h-3.5 w-3.5" /> Instalar
        </Button>
      ) : (
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted">
          <Share className="h-4 w-4" />
        </div>
      )}
      <button onClick={dismiss} aria-label="Dispensar" className="shrink-0 text-muted-foreground">
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
