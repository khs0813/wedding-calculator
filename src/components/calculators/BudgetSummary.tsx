import type { CalculatorResult } from "@/types/calculator";
import { formatCurrency } from "@/lib/calculator-utils";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ProgressBar } from "@/components/calculators/ProgressBar";
import { Lightbulb, PieChart, Table2 } from "lucide-react";

export function BudgetSummary({ result, hasInput }: { result: CalculatorResult; hasInput: boolean }) {
  const visibleItems = result.items.filter((item) => item.amount > 0);
  const keySummaries = result.summary.slice(0, 3);
  const secondarySummaries = result.summary.slice(keySummaries.length);

  if (!hasInput) {
    return null;
  }

  return (
    <div className="space-y-6">
      <section className="grid gap-3 md:grid-cols-3" aria-label="핵심 지표">
        {keySummaries.map((summary) => (
          <Card key={summary.label} className="p-5 shadow-none">
            <p className="text-sm font-bold text-slate-500">{summary.label}</p>
            <p className="mt-2 text-xl font-black text-slate-950">{summary.value}</p>
            {summary.description ? <p className="mt-2 text-xs leading-5 text-slate-500">{summary.description}</p> : null}
          </Card>
        ))}
      </section>

      {secondarySummaries.length ? (
        <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-3" aria-label="보조 지표">
          {secondarySummaries.map((summary) => (
            <div key={summary.label} className="rounded-2xl border border-blush-100 bg-white px-4 py-3">
              <p className="text-sm font-bold text-slate-500">{summary.label}</p>
              <p className="mt-1 text-lg font-black text-slate-950">{summary.value}</p>
              {summary.description ? <p className="mt-2 text-xs leading-5 text-slate-500">{summary.description}</p> : null}
            </div>
          ))}
        </section>
      ) : null}

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1.05fr)_minmax(20rem,0.95fr)]" aria-label="예산 진단">
        <Card className="overflow-hidden">
          <CardHeader>
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blush-50 text-blush-800">
                <PieChart className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <h3 className="text-xl font-black text-slate-950">항목별 비중</h3>
                <p className="text-sm text-slate-500">총액에서 어디가 가장 큰지 먼저 봅니다.</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {visibleItems.length > 0 ? (
              visibleItems.map((entry) => (
                <ProgressBar key={entry.id} label={entry.label} amount={entry.amount} total={result.total} />
              ))
            ) : (
              <p className="rounded-2xl bg-blush-50 p-5 text-sm text-slate-600">아직 입력된 비용이 없습니다. 왼쪽 입력 영역에서 금액을 입력해보세요.</p>
            )}
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-sage-100 bg-sage-50/50">
          <CardHeader>
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-sage-800">
                <Lightbulb className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <h3 className="text-xl font-black text-slate-950">예산 절약 팁</h3>
                <p className="text-sm text-slate-500">큰 비중 항목부터 조정합니다.</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-sm leading-7 text-slate-700">
              {result.advice.map((tip) => (
                <li key={tip} className="flex gap-3 rounded-2xl bg-white/80 p-3">
                  <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-sage-600" aria-hidden="true" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </section>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blush-50 text-blush-800">
              <Table2 className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <h3 className="text-xl font-black text-slate-950">상세 비용표</h3>
              <p className="text-sm text-slate-500">금액이 입력된 항목만 표시됩니다.</p>
            </div>
          </div>
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
    </div>
  );
}
