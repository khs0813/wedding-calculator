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
      <label htmlFor={id} className="block min-h-5 text-sm font-medium leading-5 text-foreground">
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
          placeholder="예: 150"
          onChange={(event) => {
            const parsed = Number(event.target.value);
            const bounded = Number.isFinite(parsed) ? Math.max(min, Math.round(parsed)) : 0;
            onChange(typeof max === "number" ? Math.min(max, bounded) : bounded);
          }}
          className="flex h-11 w-full min-w-0 rounded-xl border border-input bg-background px-3 pr-8 text-right text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
        />
        {suffix ? <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-medium text-muted-foreground">{suffix}</span> : null}
      </div>
      {helpText ? <p className="text-xs leading-5 text-muted-foreground">{helpText}</p> : null}
    </div>
  );
}
