"use client";

import { parseCurrency } from "@/lib/calculator-utils";

export type MoneyInputProps = {
  id: string;
  label: string;
  value: number;
  onChange: (value: number) => void;
  helpText?: string;
  placeholder?: string;
  unit?: "won" | "manwon";
};

export function MoneyInput({ id, label, value, onChange, helpText, placeholder, unit = "won" }: MoneyInputProps) {
  const unitLabel = unit === "manwon" ? "만원" : "원";
  const unitMultiplier = unit === "manwon" ? 10000 : 1;
  const displayValue = unit === "manwon" ? Math.round(value / unitMultiplier) : value;
  const display = displayValue ? displayValue.toLocaleString("ko-KR") : "";
  const inputPlaceholder = placeholder || (unit === "manwon" ? "예: 300" : "예: 3,000,000");

  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-sm font-bold text-slate-800">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          inputMode="numeric"
          autoComplete="off"
          placeholder={inputPlaceholder}
          value={display}
          onChange={(event) => {
            const parsed = parseCurrency(event.target.value);
            onChange(parsed * unitMultiplier);
          }}
          className="min-h-10 w-full rounded-xl border border-blush-100 bg-white/95 px-3 pr-8 text-right text-sm font-bold text-slate-900 outline-none transition placeholder:text-slate-300 focus:border-blush-500 focus:ring-4 focus:ring-blush-100"
        />
        <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">{unitLabel}</span>
      </div>
      {helpText ? <p className="text-xs leading-5 text-slate-500">{helpText}</p> : null}
    </div>
  );
}
