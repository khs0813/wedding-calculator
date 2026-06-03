"use client";

import { parseCurrency } from "@/lib/calculator-utils";

export type MoneyInputProps = {
  id: string;
  label: string;
  value: number;
  onChange: (value: number) => void;
  helpText?: string;
  placeholder?: string;
};

export function MoneyInput({ id, label, value, onChange, helpText, placeholder = "0" }: MoneyInputProps) {
  const display = value ? value.toLocaleString("ko-KR") : "";

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
          placeholder={placeholder}
          value={display}
          onChange={(event) => {
            const parsed = parseCurrency(event.target.value);
            onChange(parsed);
          }}
          className="min-h-10 w-full rounded-xl border border-blush-100 bg-white/95 px-3 pr-8 text-right text-sm font-bold text-slate-900 outline-none transition placeholder:text-slate-300 focus:border-blush-500 focus:ring-4 focus:ring-blush-100"
        />
        <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">원</span>
      </div>
      {helpText ? <p className="text-xs leading-5 text-slate-500">{helpText}</p> : null}
    </div>
  );
}
