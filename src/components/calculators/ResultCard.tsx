import type { CalculatorResult } from "@/types/calculator";
import { formatCurrency } from "@/lib/calculator-utils";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function ResultCard({ result }: { result: CalculatorResult }) {
  return (
    <Card className="overflow-hidden border-blush-200 bg-gradient-to-br from-white via-blush-50 to-sage-50">
      <CardHeader>
        <p className="text-sm font-black uppercase tracking-[0.2em] text-blush-700">Result</p>
        <h2 className="text-2xl font-black text-slate-950">{result.primaryLabel}</h2>
      </CardHeader>
      <CardContent>
        <p className="text-4xl font-black tracking-tight text-blush-800 md:text-5xl">{formatCurrency(result.total)}</p>
        {result.disclaimer ? <p className="mt-4 rounded-2xl bg-white/80 p-4 text-sm leading-6 text-slate-600">{result.disclaimer}</p> : null}
      </CardContent>
    </Card>
  );
}
