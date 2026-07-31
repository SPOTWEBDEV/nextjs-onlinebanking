"use client";

import * as React from "react";
import { dictionaries, type Dictionary, type Lang } from "./dictionaries";

interface LanguageContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: Dictionary;
}

const LanguageContext = React.createContext<LanguageContextValue | null>(null);

const STORAGE_KEY = "banco-aurora-lang";

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  // Portuguese is the default language for a Portuguese bank; the toggle is
  // a free, built-in translator — no external API calls, no cost.
  const [lang, setLangState] = React.useState<Lang>("pt");

  React.useEffect(() => {
    const stored = typeof window !== "undefined" ? (localStorage.getItem(STORAGE_KEY) as Lang | null) : null;
    if (stored === "pt" || stored === "en") setLangState(stored);
  }, []);

  const setLang = React.useCallback((next: Lang) => {
    setLangState(next);
    if (typeof window !== "undefined") localStorage.setItem(STORAGE_KEY, next);
  }, []);

  const value = React.useMemo(() => ({ lang, setLang, t: dictionaries[lang] }), [lang, setLang]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = React.useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within a LanguageProvider");
  return ctx;
}
