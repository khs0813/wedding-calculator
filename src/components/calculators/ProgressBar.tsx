import { calculatePercentage, formatCurrency } from "@/lib/calculator-utils";

export function ProgressBar({ label, amount, total }: { label: string; amount: number; total: number }) {
  const percent = calculatePercentage(amount, total);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3 text-sm">
        <span className="font-bold text-slate-700">{label}</span>
        <span className="shrink-0 text-slate-500">{formatCurrency(amount)} · {percent}%</span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-blush-50" aria-hidden="true">
        <div className="h-full rounded-full bg-blush-500" style={{ width: `${Math.min(100, percent)}%` }} />
      </div>
    </div>
  );
}
