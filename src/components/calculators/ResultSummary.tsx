"use client";

import { useMemo } from "react";
import type { CalculatorResult, CalculatorSlug, SummaryItem } from "@/types/calculator";
import { formatCurrency, formatKoreanAmount } from "@/lib/calculator-utils";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Sparkles, PieChart, Lightbulb, ArrowRight } from "lucide-react";

type SummaryMetric = {
  label: string;
  value: string;
  description?: string;
};

const summaryPatterns: Record<CalculatorSlug, Array<{ label: string; patterns: RegExp[] }>> = {
  "wedding-cost": [
    { label: "총 결혼 예산", patterns: [] },
    { label: "축의금 예상 회수액", patterns: [/축의금 예상 회수액/] },
    { label: "실제 부담 예상액", patterns: [/실제 부담 예상/] },
    { label: "목표 예산 대비 차이", patterns: [/예산 비교/] },
  ],
  "newlywed-home-budget": [
    { label: "초기 현금 필요액", patterns: [/초기 현금/] },
    { label: "월 고정 주거비", patterns: [/월 고정 주거비/] },
    { label: "대출 월 상환액", patterns: [/대출 월 상환액/] },
    { label: "권장 여유자금", patterns: [/권장 여유자금/] },
  ],
  "wedding-hall-cost": [
    { label: "청구 기준 인원", patterns: [/식대 총액/] },
    { label: "식대 총액", patterns: [/식대 총액/] },
    { label: "웨딩홀 총액", patterns: [/부가세\/봉사료 포함 총액/] },
    { label: "축의금 반영 순부담액", patterns: [/축의금 비교 순부담액/] },
  ],
  "studio-dress-makeup-cost": [
    { label: "기본 패키지", patterns: [/기본 패키지/] },
    { label: "추가 옵션", patterns: [/추가 옵션/] },
    { label: "총액", patterns: [] },
    { label: "옵션 비중", patterns: [/옵션 비중/] },
  ],
  "honsu-budget": [
    { label: "필수 품목 합계", patterns: [/필수 항목 비용/] },
    { label: "선택 품목 합계", patterns: [] },
    { label: "전체 혼수비", patterns: [] },
    { label: "목표 예산 차이", patterns: [/예산 초과 여부/] },
  ],
  "wedding-gift-budget": [
    { label: "예물 총액", patterns: [] },
    { label: "양가 선물 합계", patterns: [/양가 선물/] },
    { label: "전체 결혼 예산 대비 비중", patterns: [/전체 결혼 예산 대비 비중/] },
    { label: "신랑 측 예상 예산", patterns: [/신랑 측 예상/] },
  ],
  "honeymoon-budget": [
    { label: "신혼여행 총액", patterns: [] },
    { label: "1인당 비용", patterns: [/1인당 비용/] },
    { label: "1일 평균 비용", patterns: [/1일 평균 비용/] },
    { label: "비상금", patterns: [/비상금 비중/] },
  ],
  "congratulatory-money": [
    { label: "추천 금액 범위", patterns: [/추천 축의금 범위/] },
    { label: "대표 참고 금액", patterns: [/일반 추천 금액/] },
    { label: "주요 조정 사유", patterns: [/관계별 안내/] },
  ],
};

const emptyStateByCalculator: Record<CalculatorSlug, string> = {
  "wedding-cost": "금액과 하객 수를 입력하면 총 결혼 예산, 축의금 예상 회수액, 실제 부담 예상액이 표시됩니다.",
  "newlywed-home-budget": "보증금, 월세, 대출, 이사비와 가전·가구 비용을 입력하면 초기 현금 필요액과 월 고정비가 표시됩니다.",
  "wedding-hall-cost": "보증 인원, 예상 하객 수, 식대와 대관료를 입력하면 웨딩홀 총액과 최소 청구 기준이 표시됩니다.",
  "studio-dress-makeup-cost": "기본 패키지와 추가 옵션을 입력하면 스드메 총액과 옵션 비중이 표시됩니다.",
  "honsu-budget": "가전과 가구 비용을 입력하면 혼수 총액과 품목별 비중이 표시됩니다.",
  "wedding-gift-budget": "반지, 시계, 가방, 양가 선물 등을 입력하면 예물·예단 관련 총액이 표시됩니다.",
  "honeymoon-budget": "항공, 숙박, 식비, 액티비티, 쇼핑 비용을 입력하면 여행 총액과 구성비가 표시됩니다.",
  "congratulatory-money": "관계, 친밀도, 참석 상황을 선택하면 참고용 축의금 범위가 표시됩니다.",
};

const barColors = [
  "bg-primary",
  "bg-indigo-600",
  "bg-emerald-600",
  "bg-amber-500",
  "bg-rose-500",
  "bg-slate-400",
];

export function ResultSummary({
  result,
  calculatorSlug,
  hasInput,
  onFillPreset,
}: {
  result: CalculatorResult;
  calculatorSlug: CalculatorSlug;
  hasInput: boolean;
  onFillPreset?: () => void;
}) {
  const categoryBreakdown = useMemo(() => {
    if (!result.items || result.items.length === 0 || result.total <= 0) return [];
    const map = new Map<string, number>();
    result.items.forEach((item) => {
      if (item.amount > 0) {
        map.set(item.category, (map.get(item.category) || 0) + item.amount);
      }
    });

    const list = Array.from(map.entries())
      .map(([category, amount]) => ({
        category,
        amount,
        percent: Math.max(1, Math.round((amount / result.total) * 100)),
      }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);

    return list;
  }, [result.items, result.total]);

  if (!hasInput) {
    return (
      <Card className="overflow-hidden border-border bg-card shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2 text-primary">
            <Sparkles className="h-5 w-5" aria-hidden="true" />
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">실시간 견적 계산</span>
          </div>
          <h2 className="mt-1 text-2xl font-bold text-foreground">어디서부터 시작할지 고민되시나요?</h2>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="rounded-xl border border-border/80 bg-secondary/40 p-4 text-sm leading-6 text-muted-foreground">
            {emptyStateByCalculator[calculatorSlug]}
          </p>

          {onFillPreset ? (
            <button
              type="button"
              onClick={onFillPreset}
              className="group flex min-h-12 w-full items-center justify-between rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90 active:scale-[0.99]"
            >
              <span className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" aria-hidden="true" />
                가장 많이 찾는 평균 예산으로 시작하기
              </span>
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" aria-hidden="true" />
            </button>
          ) : null}
        </CardContent>
      </Card>
    );
  }

  const metrics = buildResultSummaryMetrics(calculatorSlug, result);

  return (
    <Card className="overflow-hidden border-border bg-card shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">결과 요약</p>
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
            실시간 산출 완료
          </span>
        </div>
        <h2 className="mt-1 text-2xl font-bold text-foreground">예상 총액</h2>
      </CardHeader>

      <CardContent className="space-y-5">
        {/* Main Hero Amount */}
        <div className="rounded-2xl border border-primary/10 bg-primary/5 p-5 md:p-6">
          <p className="text-sm font-semibold text-muted-foreground">{result.primaryLabel}</p>
          <p className="mt-2 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            {formatKoreanAmount(result.total)}
          </p>
          <p className="mt-1 text-sm font-medium text-muted-foreground">
            {formatCurrency(result.total)}
          </p>
        </div>

        {/* Visual Category Breakdown Bar */}
        {categoryBreakdown.length > 0 ? (
          <div className="space-y-3 rounded-2xl border border-border bg-card p-4">
            <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <PieChart className="h-3.5 w-3.5" aria-hidden="true" />
                지출 비중 한눈에 보기
              </span>
              <span>100%</span>
            </div>

            {/* Segmented bar */}
            <div className="flex h-3 w-full overflow-hidden rounded-full bg-secondary/80">
              {categoryBreakdown.map((cat, idx) => (
                <div
                  key={cat.category}
                  className={`${barColors[idx % barColors.length]} transition-all`}
                  style={{ width: `${cat.percent}%` }}
                  title={`${cat.category}: ${cat.percent}%`}
                />
              ))}
            </div>

            {/* Legend */}
            <div className="grid grid-cols-2 gap-2 pt-1 text-xs sm:grid-cols-3">
              {categoryBreakdown.map((cat, idx) => (
                <div key={cat.category} className="flex items-center gap-1.5">
                  <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${barColors[idx % barColors.length]}`} />
                  <span className="truncate text-muted-foreground">{cat.category}</span>
                  <span className="font-semibold text-foreground">{cat.percent}%</span>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {/* Metrics Grid */}
        <section className="grid gap-2.5 sm:grid-cols-2" aria-label="핵심 결과 요약">
          {metrics.map((metric) => (
            <div key={metric.label} className="rounded-xl border border-border bg-card p-3.5">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{metric.label}</p>
              <p className="mt-1.5 text-base font-bold text-foreground">{metric.value}</p>
              {metric.description ? (
                <p className="mt-1 text-xs leading-4 text-muted-foreground">{metric.description}</p>
              ) : null}
            </div>
          ))}
        </section>

        {/* Actionable Advice */}
        {result.advice[0] ? (
          <div className="flex items-start gap-2.5 rounded-xl border border-amber-200/60 bg-amber-50/50 p-4 text-xs leading-5 text-amber-900">
            <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" aria-hidden="true" />
            <p>{result.advice[0]}</p>
          </div>
        ) : null}

        {result.disclaimer ? (
          <p className="text-xs leading-5 text-muted-foreground/80">
            {result.disclaimer}
          </p>
        ) : null}
      </CardContent>
    </Card>
  );
}

function buildResultSummaryMetrics(slug: CalculatorSlug, result: CalculatorResult): SummaryMetric[] {
  return summaryPatterns[slug]
    .map((definition) => toMetric(slug, result, definition.label, definition.patterns))
    .filter((metric): metric is SummaryMetric => Boolean(metric))
    .slice(0, 5);
}

function toMetric(slug: CalculatorSlug, result: CalculatorResult, label: string, patterns: RegExp[]): SummaryMetric | null {
  if (patterns.length) {
    const summary = findSummary(result.summary, patterns);
    if (!summary) {
      return null;
    }

    if (slug === "wedding-hall-cost" && label === "청구 기준 인원") {
      return {
        label,
        value: summary.description || "인원 입력 시 표시",
        description: "식대 청구에 반영한 인원 기준",
      };
    }

    return { label, value: summary.value, description: summary.description };
  }

  if (slug === "honsu-budget" && label === "선택 품목 합계") {
    const optionalTotal = result.items
      .filter((item) => !item.required)
      .reduce((sum, item) => sum + item.amount, 0);
    return { label, value: formatCurrency(optionalTotal), description: "필수 표시가 없는 혼수 항목 합계" };
  }

  if (slug === "honeymoon-budget" && label === "비상금") {
    const emergency = result.items.find((item) => item.id === "emergency");
    const emergencyRatio = findSummary(result.summary, [/비상금 비중/]);
    return {
      label,
      value: formatCurrency(emergency?.amount || 0),
      description: emergencyRatio ? `총액 대비 ${emergencyRatio.value}` : undefined,
    };
  }

  return { label, value: formatCurrency(result.total), description: result.primaryLabel };
}

function findSummary(summaries: SummaryItem[], patterns: RegExp[]) {
  return summaries.find((summary) => patterns.some((pattern) => pattern.test(summary.label)));
}
