"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Controller, type Resolver, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { CalculatorConfig, FieldValue } from "@/types/calculator";
import { calculateResult } from "@/lib/calculations";
import {
  formatCurrency,
  getDefaultValues,
  sanitizeValues,
  safeNumber,
} from "@/lib/calculator-utils";
import {
  loadCalculatorState,
  removeCalculatorState,
  saveCalculatorState,
} from "@/lib/storage";
import { decodeShareData, getSharedDataFromLocation } from "@/lib/share-url";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { MoneyInput } from "@/components/calculators/MoneyInput";
import { NumberInput } from "@/components/calculators/NumberInput";
import { ResultSummary } from "@/components/calculators/ResultSummary";
import { ResultDetails } from "@/components/calculators/ResultDetails";
import { ShareButton } from "@/components/calculators/ShareButton";
import { PrintButton } from "@/components/calculators/PrintButton";
import { ResetButton } from "@/components/calculators/ResetButton";
import { InputSummary } from "@/components/calculators/InputSummary";
import { ExcelActions } from "@/components/calculators/ExcelActions";
import { NextCalculatorSection } from "@/components/calculators/NextCalculatorSection";
import { SdmeQuoteComparison } from "@/components/calculators/SdmeQuoteComparison";
import { AdFitSlot } from "@/components/monetization/AdFitSlot";
import { ChevronDown, HeartHandshake, LayoutDashboard, ShieldCheck } from "lucide-react";

type FormValues = Record<string, FieldValue>;

const formSchema = z.record(
  z.string(),
  z.union([z.number().min(0), z.string(), z.boolean()]),
);

const congratulatoryPresets: Array<{ label: string; values: FormValues }> = [
  {
    label: "지인/가벼운 관계",
    values: { relation: "acquaintance", closeness: "low", attendMeal: true, withCompanion: false, region: "metro", income: "middle", receivedBefore: false, receivedAmount: 0 },
  },
  {
    label: "일반 친구/동료",
    values: { relation: "friend", closeness: "normal", attendMeal: true, withCompanion: false, region: "metro", income: "middle", receivedBefore: false, receivedAmount: 0 },
  },
  {
    label: "가까운 친구/가족",
    values: { relation: "friend-close", closeness: "high", attendMeal: true, withCompanion: false, region: "metro", income: "high", receivedBefore: false, receivedAmount: 0 },
  },
];

const presetLabelsByCalculator: Record<CalculatorConfig["slug"], [string, string, string]> = {
  "wedding-cost": ["소규모", "평균형", "넉넉한 예산"],
  "newlywed-home-budget": ["월세 중심", "전세 중심", "입주비 넉넉형"],
  "wedding-hall-cost": ["100명 기준", "150명 기준", "200명 기준"],
  "studio-dress-makeup-cost": ["기본 패키지형", "균형형", "옵션 포함형"],
  "honsu-budget": ["필수 가전형", "균형형", "풀옵션형"],
  "wedding-gift-budget": ["간소화형", "보통형", "넉넉형"],
  "honeymoon-budget": ["국내/근거리", "아시아권", "장거리/휴양형"],
  "congratulatory-money": ["지인/가벼운 관계", "일반 친구/동료", "가까운 친구/가족"],
};

const agreementFieldPattern = /(gift|yedan|honsu|home|appliance|furniture|family|rings|watch|bag|jewelry|hanbok|loan|rent|maintenance|interior)/i;
const calculatorResultRenderedEvent = "wedding-budget:calculator-result-rendered";

export function CalculatorClient({ config }: { config: CalculatorConfig }) {
  const [hydrated, setHydrated] = useState(false);
  const [moneyUnit, setMoneyUnit] = useState<"won" | "manwon">("won");
  const [generatedAt, setGeneratedAt] = useState<Date | null>(null);
  const [shareRestoreMessage, setShareRestoreMessage] = useState("");
  const defaultValues = useMemo(() => getDefaultValues(config), [config]);

  const { control, reset, formState } = useForm<FormValues>({
    defaultValues,
    resolver: zodResolver(formSchema) as Resolver<FormValues>,
    mode: "onChange",
  });

  const watchedValues = useWatch({ control });
  const values = useMemo(
    () => sanitizeValues(config, watchedValues),
    [config, watchedValues],
  );
  const result = useMemo(
    () => calculateResult(config.slug, values),
    [config.slug, values],
  );

  useEffect(() => {
    const dataParam = getSharedDataFromLocation(window.location);
    const sharedValues = dataParam ? decodeShareData(dataParam) : null;
    const storedValues = sharedValues
      ? null
      : loadCalculatorState(config);
    const nextValues = sanitizeValues(
      config,
      sharedValues || storedValues || defaultValues,
    );
    reset(nextValues);
    if (sharedValues || window.location.search || window.location.hash) {
      replaceCleanUrl();
    }
    if (dataParam) {
      setShareRestoreMessage(
        sharedValues
          ? "공유 URL의 입력값을 복원했습니다. URL은 대표 주소로 정리했습니다."
          : "공유 URL 값이 올바르지 않아 저장값 또는 기본값으로 열었습니다.",
      );
    }
    setHydrated(true);
  }, [config, defaultValues, reset]);

  useEffect(() => {
    if (!hydrated) return;
    const timeout = window.setTimeout(() => {
      saveCalculatorState(config.storageKey, values);
    }, 250);

    return () => window.clearTimeout(timeout);
  }, [config.storageKey, hydrated, values]);

  function replaceCleanUrl() {
    const cleanUrl = `${window.location.origin}${window.location.pathname}`;
    window.history.replaceState(null, "", cleanUrl);
  }

  function handleReset() {
    removeCalculatorState(config.storageKey);
    reset(defaultValues);
    setGeneratedAt(null);
    replaceCleanUrl();
  }

  const groups = useMemo(() => {
    const map = new Map<string, typeof config.fields>();
    config.fields.forEach((field) => {
      const group = field.group || "기본 입력";
      const current = map.get(group) || [];
      current.push(field);
      map.set(group, current);
    });
    return Array.from(map.entries());
  }, [config]);

  const quickFieldIds = useMemo(() => new Set(config.fields.slice(0, Math.min(6, config.fields.length)).map((field) => field.id)), [config.fields]);
  const quickFields = useMemo(() => config.fields.filter((field) => quickFieldIds.has(field.id)), [config.fields, quickFieldIds]);
  const detailGroups = useMemo(
    () => groups
      .map(([groupName, fields]) => [groupName, fields.filter((field) => !quickFieldIds.has(field.id))] as const)
      .filter(([, fields]) => fields.length > 0),
    [groups, quickFieldIds],
  );

  const exampleValues = useMemo(() => {
    const nextValues: FormValues = { ...defaultValues };
    config.fields.forEach((field) => {
      if (field.type === "money" && safeNumber(field.defaultValue) === 0) {
        nextValues[field.id] = field.id.toLowerCase().includes("meal")
          ? 70000
          : field.id.toLowerCase().includes("target")
            ? 30000000
            : 1000000;
      }
      if (field.type === "number" && safeNumber(field.defaultValue) === 0) {
        nextValues[field.id] = field.id.toLowerCase().includes("guest") ? 150 : 1;
      }
      if (field.type === "percent" && safeNumber(field.defaultValue) === 0) {
        nextValues[field.id] = 5;
      }
    });
    return sanitizeValues(config, nextValues);
  }, [config, defaultValues]);

  const examplePresets = useMemo(() => {
    const makePreset = (scale: number) => {
      const nextValues: FormValues = { ...exampleValues };
      config.fields.forEach((field) => {
        if (field.type === "money") {
          nextValues[field.id] = safeNumber(safeNumber(exampleValues[field.id]) * scale);
        }
      });
      return sanitizeValues(config, nextValues);
    };

    if (config.slug === "congratulatory-money") {
      return congratulatoryPresets.map((preset) => ({
        label: preset.label,
        values: sanitizeValues(config, { ...defaultValues, ...preset.values }),
      }));
    }

    const labels = presetLabelsByCalculator[config.slug];

    return [
      { label: labels[0], values: makePreset(0.7) },
      { label: labels[1], values: exampleValues },
      { label: labels[2], values: makePreset(1.4) },
    ];
  }, [config, defaultValues, exampleValues]);

  const hasMeaningfulInput = useMemo(() => {
    if (formState.isDirty) return true;

    return config.fields.some((field) => {
      const current = values[field.id];
      const defaultValue = field.defaultValue;

      if (field.type === "money" || field.type === "number" || field.type === "percent") {
        return safeNumber(current) !== safeNumber(defaultValue) && safeNumber(current) > 0;
      }

      if (field.type === "checkbox") {
        return Boolean(current) !== Boolean(defaultValue);
      }

      return String(current ?? "") !== String(defaultValue ?? "");
    });
  }, [config.fields, formState.isDirty, values]);
  const hasInputErrors = Object.keys(formState.errors).length > 0;
  const canShowResultAds = hydrated && hasMeaningfulInput && !hasInputErrors && result.summary.length > 0;

  useEffect(() => {
    if (!canShowResultAds) return;

    window.sessionStorage.setItem(`weddingbudget:result-rendered:${config.slug}`, "true");
    window.dispatchEvent(new CustomEvent(calculatorResultRenderedEvent, { detail: { slug: config.slug } }));
  }, [canShowResultAds, config.slug]);

  function fillExampleValues(presetValues = exampleValues) {
    reset(presetValues, { keepDirty: true });
  }

  function markGeneratedAt() {
    setGeneratedAt(new Date());
  }

  function renderField(fieldDef: CalculatorConfig["fields"][number]) {
    const agreementNote = agreementFieldPattern.test(fieldDef.id) || /예물|예단|혼수|신혼집|가전|가구|대출|월세|관리비|양가/.test(fieldDef.label);

    return (
      <Controller
        key={fieldDef.id}
        control={control}
        name={fieldDef.id}
        render={({ field }) => {
          const help = [fieldDef.helpText, agreementNote ? "둘이 합의할 항목" : ""].filter(Boolean).join(" · ");

          if (fieldDef.type === "money") {
            return (
              <MoneyInput
                id={fieldDef.id}
                label={fieldDef.label}
                helpText={help}
                placeholder={fieldDef.placeholder}
                value={safeNumber(field.value)}
                onChange={field.onChange}
                unit={moneyUnit}
              />
            );
          }

          if (
            fieldDef.type === "number" ||
            fieldDef.type === "percent"
          ) {
            return (
              <NumberInput
                id={fieldDef.id}
                label={fieldDef.label}
                helpText={help}
                suffix={fieldDef.suffix}
                value={safeNumber(field.value)}
                max={
                  fieldDef.type === "percent" ? 100 : undefined
                }
                onChange={field.onChange}
              />
            );
          }

          if (fieldDef.type === "checkbox") {
            const checked = Boolean(field.value);
            return (
              <div className="space-y-1.5">
                <span id={`${fieldDef.id}-label`} className="block min-h-5 text-sm font-medium leading-5 text-foreground">
                  {fieldDef.label}
                </span>
                <button
                  type="button"
                  id={fieldDef.id}
                  onClick={() => field.onChange(!checked)}
                  aria-pressed={checked}
                  aria-labelledby={`${fieldDef.id}-label`}
                  className={
                    checked
                      ? "flex h-11 w-full items-center justify-between rounded-xl border border-input bg-secondary px-3 py-2 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      : "flex h-11 w-full items-center justify-between rounded-xl border border-input bg-background px-3 py-2 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  }
                >
                  <span>{checked ? "예" : "아니오"}</span>
                  <span
                    className={
                      checked
                        ? "flex h-6 w-11 items-center justify-end rounded-xl bg-primary p-1"
                        : "flex h-6 w-11 items-center justify-start rounded-full bg-slate-200 p-1"
                    }
                    aria-hidden="true"
                  >
                    <span className="h-4 w-4 rounded-full bg-card shadow-sm" />
                  </span>
                </button>
                {help ? (
                  <p className="text-xs leading-5 text-muted-foreground">
                    {help}
                  </p>
                ) : null}
              </div>
            );
          }

          return (
            <div className="space-y-2">
              <label
                htmlFor={fieldDef.id}
                className="block min-h-5 text-sm font-medium leading-5 text-foreground"
              >
                {fieldDef.label}
              </label>
              <select
                id={fieldDef.id}
                value={String(
                  field.value ?? fieldDef.defaultValue,
                )}
                onChange={(event) =>
                  field.onChange(event.target.value)
                }
                className="flex h-11 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {fieldDef.options?.map((option) => (
                  <option
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </option>
                ))}
              </select>
              {help ? (
                <p className="text-xs leading-5 text-muted-foreground">
                  {help}
                </p>
              ) : null}
            </div>
          );
        }}
      />
    );
  }

  const mobileSecondarySummary = result.summary.find((summary) => /부담|초기|월 고정|추천|범위/.test(summary.label)) || result.summary[0];

  return (
    <div id="calculator" className={`calculator-workspace scroll-mt-24 ${hasMeaningfulInput ? "pb-24 lg:pb-0" : ""}`}>
      <div className="grid gap-8 lg:grid-cols-[minmax(22rem,0.82fr)_minmax(0,1.18fr)]">
        <section className="no-print space-y-5" aria-label="계산기 입력 영역">
          <Card>
            <CardHeader>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                입력
              </p>
              <h2 className="text-2xl font-semibold text-foreground">예산 입력</h2>
              <div className="inline-flex w-fit items-center gap-2 rounded-full bg-muted px-3 py-2 text-xs font-semibold text-muted-foreground">
                <ShieldCheck className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                서버 저장 없음 · 현재 브라우저에만 보관
              </div>
              <p className="text-sm leading-6 text-muted-foreground">
                정확히 모르는 항목은 비워도 계산할 수 있습니다. 먼저 빠른 계산으로 큰 흐름을 확인하세요.
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <div className="inline-flex rounded-xl border border-border bg-card p-1" aria-label="금액 입력 단위">
                  {[
                    { value: "won", label: "원 단위" },
                    { value: "manwon", label: "만원 단위" },
                  ].map((item) => (
                    <button
                      key={item.value}
                      type="button"
                      onClick={() => setMoneyUnit(item.value as "won" | "manwon")}
                      className={
                        moneyUnit === item.value
                          ? "min-h-11 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground"
                          : "min-h-11 rounded-xl px-4 py-2 text-xs font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                      }
                      aria-pressed={moneyUnit === item.value}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2" aria-label="예시값 프리셋">
                  {examplePresets.map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => fillExampleValues(preset.values)}
                      className="min-h-11 rounded-xl border border-border bg-card px-4 py-2 text-xs font-semibold text-foreground transition hover:bg-secondary"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <fieldset className="space-y-3">
                  <legend className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-foreground">
                    빠른 계산
                  </legend>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {quickFields.map((fieldDef) => renderField(fieldDef))}
                  </div>
                </fieldset>

                <details className="group rounded-2xl border border-border bg-muted p-4">
                  <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 text-sm font-semibold text-foreground">
                    <span>상세 항목 열기</span>
                    <ChevronDown className="h-4 w-4 transition group-open:rotate-180" aria-hidden="true" />
                  </summary>
                  <div className="mt-5 space-y-6">
                    {detailGroups.map(([groupName, fields]) => (
                      <fieldset key={groupName} className="space-y-3">
                        <legend className="rounded-full bg-card px-3 py-1 text-xs font-semibold text-foreground">
                          {groupName}
                        </legend>
                        <div className="grid gap-3 sm:grid-cols-2">
                          {fields.map((fieldDef) => renderField(fieldDef))}
                        </div>
                      </fieldset>
                    ))}
                  </div>
                </details>

                <div className="flex items-start gap-3 rounded-2xl border border-border bg-card p-4 text-sm leading-6 text-muted-foreground">
                  <HeartHandshake className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" aria-hidden="true" />
                  <p>예물, 예단, 혼수, 신혼집처럼 금액 차이가 커지는 항목은 결과를 공유한 뒤 둘이 합의할 항목으로 표시해 두세요.</p>
                </div>
              </div>
            </CardContent>
          </Card>

        </section>

        <section className="space-y-5 lg:sticky lg:top-24 lg:self-start" aria-label="계산 결과 영역" aria-live="polite">
          <div className="print-area">
            <ResultSummary result={result} calculatorSlug={config.slug} hasInput={hasMeaningfulInput} />
          </div>
          {shareRestoreMessage ? (
            <p className="no-print rounded-2xl border border-border bg-card px-4 py-3 text-sm leading-6 text-muted-foreground" role="status">
              {shareRestoreMessage}
            </p>
          ) : null}
          {hasMeaningfulInput ? (
            <div className="no-print rounded-2xl border border-border bg-card p-4 shadow-sm">
              <h2 className="text-lg font-semibold text-foreground">결과 저장과 공유</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">현재 입력 기준과 결과 표를 파일이나 링크로 남길 수 있습니다.</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <PrintButton onAction={markGeneratedAt} />
                <ExcelActions
                  config={config}
                  values={values}
                  result={result}
                  onAction={markGeneratedAt}
                />
                <ShareButton config={config} values={values} onAction={markGeneratedAt} />
                <Link href="/summary/" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-border bg-card px-5 py-2.5 text-sm font-semibold text-foreground transition hover:bg-secondary">
                  <LayoutDashboard className="h-4 w-4" aria-hidden="true" />
                  내 예산표에 저장
                </Link>
              </div>
              <Link href="#budget-insights" className="mt-4 inline-flex min-h-11 items-center justify-center rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90">
                예산 분석 표 보기
              </Link>
            </div>
          ) : null}
        </section>
      </div>

      {config.slug === "studio-dress-makeup-cost" ? (
        <SdmeQuoteComparison />
      ) : null}

      {canShowResultAds ? (
        <AdFitSlot placement="calc.primaryAfterSummary" className="mt-16 mb-16" />
      ) : null}

      {hasMeaningfulInput ? (
        <section id="budget-insights" className="print-area mt-16 scroll-mt-24 space-y-6" aria-label="예산 분석과 입력 요약">
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm md:p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">검토</p>
            <h2 className="mt-2 text-2xl font-semibold text-foreground">예산 검토</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">먼저 핵심 지표를 확인하고, 큰 비중 항목과 절약 팁을 함께 보세요. 입력값 요약은 출력과 최종 검토용으로 접어 두었습니다.</p>
          </div>
          <ResultDetails result={result} />
          <details className="no-print rounded-2xl border border-border bg-card p-5 shadow-sm md:p-6">
            <summary className="cursor-pointer text-lg font-semibold text-foreground">입력값 요약</summary>
            <div className="mt-5">
              <InputSummary config={config} values={values} generatedAt={generatedAt} />
            </div>
          </details>
          <div className="print-only">
            <InputSummary config={config} values={values} generatedAt={generatedAt} />
          </div>
          <div className="no-print rounded-2xl border border-red-100 bg-red-50/40 p-5 shadow-sm md:p-6">
            <h2 className="text-lg font-semibold text-foreground">입력값 관리</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">현재 계산기의 브라우저 저장값과 입력값을 초기화합니다.</p>
            <div className="mt-4 flex sm:justify-end">
              <ResetButton onReset={handleReset} />
            </div>
          </div>
          <NextCalculatorSection currentSlug={config.slug} />
        </section>
      ) : null}

      {hasMeaningfulInput ? (
        <div className="no-print fixed inset-x-3 bottom-[calc(env(safe-area-inset-bottom)+0.75rem)] z-40 rounded-2xl border border-border bg-background/95 p-3 shadow-sm backdrop-blur lg:hidden">
          <div className="flex items-center justify-between gap-3">
            <p className="min-w-0 truncate text-sm font-semibold text-foreground">
              예상 총액 <span className="text-foreground">{formatCurrency(result.total)}</span>
              {mobileSecondarySummary ? <span className="text-muted-foreground"> · 결과 보기</span> : null}
            </p>
            <a href="#budget-insights" className="inline-flex min-h-11 shrink-0 items-center rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground">
              보기
            </a>
          </div>
        </div>
      ) : null}
    </div>
  );
}
