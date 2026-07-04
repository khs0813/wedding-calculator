"use client";

import { useState } from "react";
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
  const [error, setError] = useState("");
  const unitLabel = unit === "manwon" ? "만원" : "원";
  const unitMultiplier = unit === "manwon" ? 10000 : 1;
  const displayValue = unit === "manwon" ? Math.round(value / unitMultiplier) : value;
  const display = displayValue ? displayValue.toLocaleString("ko-KR") : "";
  const inputPlaceholder = placeholder || (unit === "manwon" ? "예: 300" : "예: 3,000,000");

  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block min-h-5 text-sm font-medium leading-5 text-foreground">
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
            const rawValue = event.target.value;
            const hasInvalidText = /[^\d,\s만원.]/.test(rawValue);
            setError(hasInvalidText ? "숫자, 콤마, 만원 단위만 입력할 수 있습니다." : "");
            const parsed = parseCurrency(rawValue);
            onChange(rawValue.includes("만") ? parsed : parsed * unitMultiplier);
          }}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : helpText ? `${id}-help` : undefined}
          className="flex h-11 w-full min-w-0 rounded-xl border border-input bg-background px-3 pr-10 text-right text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
        />
        <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-medium text-muted-foreground">{unitLabel}</span>
      </div>
      {error ? <p id={`${id}-error`} className="text-xs font-medium leading-5 text-red-700">{error}</p> : null}
      {helpText ? <p id={`${id}-help`} className="text-xs leading-5 text-muted-foreground">{helpText}</p> : null}
    </div>
  );
}
