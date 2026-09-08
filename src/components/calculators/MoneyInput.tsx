"use client";

import { useState } from "react";
import { parseCurrency, formatKoreanAmount } from "@/lib/calculator-utils";
import { X } from "lucide-react";

export type MoneyInputProps = {
  id: string;
  label: string;
  value: number;
  onChange: (value: number) => void;
  helpText?: string;
  placeholder?: string;
  unit?: "won" | "manwon";
  showQuickButtons?: boolean;
};

export function MoneyInput({
  id,
  label,
  value,
  onChange,
  helpText,
  placeholder,
  unit = "won",
  showQuickButtons = true,
}: MoneyInputProps) {
  const [error, setError] = useState("");
  const unitLabel = unit === "manwon" ? "만원" : "원";
  const unitMultiplier = unit === "manwon" ? 10000 : 1;
  const displayValue = unit === "manwon" ? Math.round(value / unitMultiplier) : value;
  const display = displayValue ? displayValue.toLocaleString("ko-KR") : "";
  const inputPlaceholder = placeholder || (unit === "manwon" ? "예: 300" : "예: 3,000,000");

  const quickChips = [
    { label: "+10만", amount: 100_000 },
    { label: "+100만", amount: 1_000_000 },
    { label: "+500만", amount: 5_000_000 },
    { label: "+1000만", amount: 10_000_000 },
  ];

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between gap-2">
        <label htmlFor={id} className="block min-h-5 text-sm font-medium leading-5 text-foreground">
          {label}
        </label>
        {value > 0 ? (
          <span className="text-xs font-semibold text-primary/90 bg-primary/5 px-2 py-0.5 rounded-md">
            {formatKoreanAmount(value)}
          </span>
        ) : null}
      </div>

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
          className="flex h-11 w-full min-w-0 rounded-xl border border-input bg-background px-3 pr-16 text-right text-sm font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
        />
        <div className="absolute right-2.5 top-1/2 flex -translate-y-1/2 items-center gap-1.5">
          {value > 0 ? (
            <button
              type="button"
              onClick={() => onChange(0)}
              aria-label={`${label} 금액 지우기`}
              className="flex h-5 w-5 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          ) : null}
          <span className="pointer-events-none text-xs font-medium text-muted-foreground">
            {unitLabel}
          </span>
        </div>
      </div>

      {showQuickButtons ? (
        <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
          {quickChips.map((chip) => (
            <button
              key={chip.label}
              type="button"
              onClick={() => onChange(Math.max(0, value + chip.amount))}
              className="inline-flex min-h-[30px] items-center rounded-lg border border-border/80 bg-secondary/40 px-2 py-0.5 text-xs font-medium text-foreground transition hover:bg-secondary active:scale-95"
            >
              {chip.label}
            </button>
          ))}
        </div>
      ) : null}

      {error ? (
        <p id={`${id}-error`} className="text-xs font-medium leading-5 text-red-700">
          {error}
        </p>
      ) : null}
      {helpText ? (
        <p id={`${id}-help`} className="text-xs leading-5 text-muted-foreground">
          {helpText}
        </p>
      ) : null}
    </div>
  );
}
