"use client";

const CURRENCIES = ["EUR", "USD", "GBP", "BRL", "CHF"];

export function CurrencySelector({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-12 rounded-xl border border-input bg-background px-3 text-sm font-medium outline-none focus:border-emerald focus:ring-2 focus:ring-emerald/20"
    >
      {CURRENCIES.map((c) => (
        <option key={c} value={c}>
          {c}
        </option>
      ))}
    </select>
  );
}
