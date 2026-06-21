"use client";

export type NumberInputProps = {
  id: string;
  label: string;
  value: number;
  onChange: (value: number) => void;
  suffix?: string;
  helpText?: string;
  min?: number;
  max?: number;
};

export function NumberInput({ id, label, value, onChange, suffix, helpText, min = 0, max }: NumberInputProps) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block h-5 text-sm font-bold leading-5 text-slate-800">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type="number"
          inputMode="numeric"
          min={min}
          max={max}
          value={value || ""}
          placeholder="입력"
          onChange={(event) => {
            const parsed = Number(event.target.value);
            const bounded = Number.isFinite(parsed) ? Math.max(min, Math.round(parsed)) : 0;
            onChange(typeof max === "number" ? Math.min(max, bounded) : bounded);
          }}
          className="h-10 w-full min-w-0 rounded-xl border border-blush-100 bg-white/95 px-3 pr-8 text-right text-sm font-bold text-slate-900 outline-none transition placeholder:text-slate-300 focus:border-blush-500 focus:ring-4 focus:ring-blush-100"
        />
        {suffix ? <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">{suffix}</span> : null}
      </div>
      {helpText ? <p className="text-xs leading-5 text-slate-500">{helpText}</p> : null}
    </div>
  );
}
