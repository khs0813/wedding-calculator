import type { CalculatorResult } from "@/types/calculator";
import { formatCurrency } from "@/lib/calculator-utils";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function ResultCard({ result, hasInput }: { result: CalculatorResult; hasInput: boolean }) {
  if (!hasInput) {
    return (
      <Card className="overflow-hidden border-blush-200 bg-white">
        <CardHeader>
          <p className="text-sm font-black uppercase tracking-[0.2em] text-blush-700">Result</p>
          <h2 className="text-2xl font-black text-slate-950">계산 결과 대기 중</h2>
        </CardHeader>
        <CardContent>
          <p className="rounded-2xl bg-blush-50 p-5 text-sm leading-7 text-slate-600">
            왼쪽에 금액을 입력하면 총 예산과 실제 부담액이 표시됩니다.
          </p>
        </CardContent>
      </Card>
    );
  }

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
