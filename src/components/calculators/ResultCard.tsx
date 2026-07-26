import type { CalculatorResult } from "@/types/calculator";
import { formatCurrency } from "@/lib/calculator-utils";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

function pickSummary(result: CalculatorResult, patterns: RegExp[]) {
  return result.summary.find((item) => patterns.some((pattern) => pattern.test(item.label)));
}

export function ResultCard({
  result,
  hasInput,
  emptyState,
}: {
  result: CalculatorResult;
  hasInput: boolean;
  emptyState: string;
}) {
  if (!hasInput) {
    return (
      <Card className="overflow-hidden border-border bg-card">
        <CardHeader>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">결과</p>
          <h2 className="text-2xl font-semibold text-foreground">계산 결과 대기 중</h2>
        </CardHeader>
        <CardContent>
          <p className="rounded-2xl bg-secondary p-5 text-sm leading-7 text-muted-foreground">
            {emptyState}
          </p>
        </CardContent>
      </Card>
    );
  }

  const netBurden = pickSummary(result, [/부담|초기 현금|추천 축의금 범위/]);
  const budgetStatus = pickSummary(result, [/예산|초과|잔여|여유/]);
  const biggestItem = result.items
    .filter((item) => item.amount > 0)
    .sort((a, b) => b.amount - a.amount)[0];
  const recommendation = result.advice[0] || "큰 비용 항목부터 둘이 조정할 수 있는 범위를 정해보세요.";

  return (
    <Card className="overflow-hidden border-border bg-card">
      <CardHeader>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">판단</p>
        <h2 className="text-2xl font-semibold text-foreground">둘이 같이 볼 예산 결과</h2>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-2xl border border-border bg-muted p-5">
          <p className="text-sm font-semibold text-muted-foreground">예상 총액</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-foreground [overflow-wrap:anywhere] sm:text-4xl md:text-5xl">{formatCurrency(result.total)}</p>
          <p className="mt-2 text-sm font-bold text-muted-foreground">{result.primaryLabel}</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">회수 반영 후</p>
            <h3 className="mt-2 text-sm font-semibold text-foreground">축의금/회수액 반영 후 예상 부담</h3>
            <p className="mt-2 text-lg font-semibold text-foreground">{netBurden?.value || "관련 항목 입력 시 표시"}</p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">예산</p>
            <h3 className="mt-2 text-sm font-semibold text-foreground">목표 예산 대비 초과/여유</h3>
            <p className="mt-2 text-sm font-bold leading-6 text-muted-foreground">{budgetStatus?.value || "목표 예산을 입력하면 표시됩니다."}</p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">가장 큰 항목</p>
            <h3 className="mt-2 text-sm font-semibold text-foreground">가장 큰 비용 항목</h3>
            <p className="mt-2 text-lg font-semibold text-foreground">{biggestItem ? `${biggestItem.label} · ${formatCurrency(biggestItem.amount)}` : "입력 후 표시"}</p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">조정</p>
            <h3 className="mt-2 text-sm font-semibold text-foreground">조정 추천 항목</h3>
            <p className="mt-2 text-sm font-bold leading-6 text-muted-foreground">{recommendation}</p>
          </div>
        </div>
        {result.disclaimer ? <p className="mt-4 rounded-2xl bg-card p-4 text-sm leading-6 text-muted-foreground">{result.disclaimer}</p> : null}
      </CardContent>
    </Card>
  );
}
