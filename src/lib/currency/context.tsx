"use client";

import * as React from "react";

export type DisplayCurrency = "EUR" | "USD";

// Static demo FX rate — a real app would fetch this from a live rates API.
const EUR_TO_USD = 1.08;

interface CurrencyContextValue {
  displayCurrency: DisplayCurrency;
  setDisplayCurrency: (c: DisplayCurrency) => void;
  /** Converts an amount stored in EUR into the selected display currency. */
  convert: (amountInEur: number) => number;
}

const CurrencyContext = React.createContext<CurrencyContextValue | null>(null);
const STORAGE_KEY = "banco-aurora-currency";

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [displayCurrency, setDisplayCurrencyState] = React.useState<DisplayCurrency>("EUR");

  React.useLayoutEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as DisplayCurrency | null;
    if (stored === "EUR" || stored === "USD") setDisplayCurrencyState(stored);

    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && (e.newValue === "EUR" || e.newValue === "USD")) {
        setDisplayCurrencyState(e.newValue);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const setDisplayCurrency = React.useCallback((c: DisplayCurrency) => {
    setDisplayCurrencyState(c);
    localStorage.setItem(STORAGE_KEY, c);
  }, []);

  const convert = React.useCallback(
    (amountInEur: number) => (displayCurrency === "USD" ? amountInEur * EUR_TO_USD : amountInEur),
    [displayCurrency]
  );

  const value = React.useMemo(
    () => ({ displayCurrency, setDisplayCurrency, convert }),
    [displayCurrency, setDisplayCurrency, convert]
  );

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}

export function useCurrency() {
  const ctx = React.useContext(CurrencyContext);
  if (!ctx) throw new Error("useCurrency must be used within a CurrencyProvider");
  return ctx;
}
