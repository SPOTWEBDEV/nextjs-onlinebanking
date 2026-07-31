"use client";

import { Languages } from "lucide-react";
import { useLanguage } from "@/lib/i18n/context";
import { cn } from "@/lib/utils";

export function LanguageToggle({ className }: { className?: string }) {
  const { lang, setLang } = useLanguage();

  return (
    <div className={cn("flex items-center gap-1 rounded-full border border-border bg-muted p-0.5 text-xs font-medium", className)}>
      <Languages className="ml-1.5 h-3.5 w-3.5 text-muted-foreground" />
      {(["pt", "en"] as const).map((l) => (
        <button
          key={l}
          onClick={() => setLang(l)}
          className={cn(
            "rounded-full px-2 py-1 uppercase transition-colors",
            lang === l ? "bg-emerald text-white" : "text-muted-foreground"
          )}
        >
          {l}
        </button>
      ))}
    </div>
  );
}
