import type { CalculatorResult } from "@/types/calculator";
import { formatCurrency } from "@/lib/calculator-utils";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ProgressBar } from "@/components/calculators/ProgressBar";

export function BudgetSummary({ result, hasInput }: { result: CalculatorResult; hasInput: boolean }) {
  const visibleItems = result.items.filter((item) => item.amount > 0);
  const keySummaries = result.summary.slice(0, 3);

  if (!hasInput) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        {keySummaries.map((summary) => (
          <Card key={summary.label} className="p-5 shadow-none">
            <p className="text-sm font-bold text-slate-500">{summary.label}</p>
            <p className="mt-2 text-xl font-black text-slate-950">{summary.value}</p>
            {summary.description ? <p className="mt-2 text-xs leading-5 text-slate-500">{summary.description}</p> : null}
          </Card>
        ))}
      </div>

      {result.summary.length > keySummaries.length ? (
        <div className="grid gap-4 md:grid-cols-2">
          {result.summary.slice(keySummaries.length).map((summary) => (
            <Card key={summary.label} className="p-5 shadow-none">
              <p className="text-sm font-bold text-slate-500">{summary.label}</p>
              <p className="mt-2 text-lg font-black text-slate-950">{summary.value}</p>
              {summary.description ? <p className="mt-2 text-xs leading-5 text-slate-500">{summary.description}</p> : null}
            </Card>
          ))}
        </div>
      ) : null}

      <Card>
        <CardHeader>
          <h3 className="text-xl font-black text-slate-950">항목별 비용표</h3>
          <p className="text-sm text-slate-500">금액이 입력된 항목만 표시됩니다.</p>
        </CardHeader>
        <CardContent>
          {visibleItems.length > 0 ? (
            <div className="table-scroll overflow-x-auto">
              <table className="w-full min-w-[520px] border-collapse text-sm">
                <caption className="sr-only">항목별 입력 비용과 분류</caption>
                <thead>
                  <tr className="border-b border-blush-100 text-left text-slate-500">
                    <th scope="col" className="py-3 pr-3">항목</th>
                    <th scope="col" className="py-3 pr-3">분류</th>
                    <th scope="col" className="py-3 pr-3 text-right">금액</th>
                    <th scope="col" className="py-3 text-right">구분</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleItems.map((entry) => (
                    <tr key={entry.id} className="border-b border-blush-100/70 last:border-0">
                      <th scope="row" className="py-3 pr-3 text-left font-bold text-slate-800">{entry.label}</th>
                      <td className="py-3 pr-3 text-slate-500">{entry.category}</td>
                      <td className="py-3 pr-3 text-right font-bold text-slate-900">{formatCurrency(entry.amount)}</td>
                      <td className="py-3 text-right text-slate-500">{entry.required ? "필수" : "선택"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="rounded-2xl bg-blush-50 p-5 text-sm text-slate-600">아직 입력된 비용이 없습니다. 왼쪽 입력 영역에서 금액을 입력해보세요.</p>
          )}
        </CardContent>
      </Card>

      {visibleItems.length > 0 ? (
        <Card>
          <CardHeader>
            <h3 className="text-xl font-black text-slate-950">항목별 비중</h3>
            <p className="text-sm text-slate-500">총액 대비 각 항목의 비율입니다.</p>
          </CardHeader>
          <CardContent className="space-y-4">
            {visibleItems.map((entry) => (
              <ProgressBar key={entry.id} label={entry.label} amount={entry.amount} total={result.total} />
            ))}
          </CardContent>
        </Card>
      ) : null}

      <Card>
        <CardHeader>
          <h3 className="text-xl font-black text-slate-950">예산 절약 팁</h3>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3 text-sm leading-7 text-slate-600">
            {result.advice.map((tip) => (
              <li key={tip} className="flex gap-3">
                <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-blush-500" aria-hidden="true" />
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
