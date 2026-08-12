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

export function LanguageProvider({
  children,
  initialLang = "pt",
}: {
  children: React.ReactNode;
  initialLang?: Lang;
}) {
  // initialLang comes from the `banco-aurora-lang` cookie, read server-side
  // in the root layout — so the very first HTML the server sends already
  // matches the visitor's stored preference. localStorage alone can't do
  // this because it's only readable after JS loads on the client, which is
  // too late to avoid a flash on a fresh page load / direct URL visit.
  const [lang, setLangState] = React.useState<Lang>(initialLang);

  // useLayoutEffect (not useEffect) so localStorage is checked before the
  // browser paints — this covers client-side navigation within the app,
  // where the cookie-based initialLang doesn't get a chance to update.
  React.useLayoutEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as Lang | null;
    if (stored && stored !== lang && (stored === "pt" || stored === "en")) {
      setLangState(stored);
    }

    // Keep multiple open tabs in sync with each other.
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && (e.newValue === "pt" || e.newValue === "en")) {
        setLangState(e.newValue);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setLang = React.useCallback((next: Lang) => {
    setLangState(next);
    localStorage.setItem(STORAGE_KEY, next);
    // Also set a cookie (1 year) so the *next* full page load is
    // server-rendered in the right language from the first byte.
    document.cookie = `${STORAGE_KEY}=${next}; path=/; max-age=31536000; samesite=lax`;
  }, []);

  const value = React.useMemo(() => ({ lang, setLang, t: dictionaries[lang] }), [lang, setLang]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = React.useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within a LanguageProvider");
  return ctx;
}
