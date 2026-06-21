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
import { ResultCard } from "@/components/calculators/ResultCard";
import { BudgetSummary } from "@/components/calculators/BudgetSummary";
import { ShareButton } from "@/components/calculators/ShareButton";
import { PrintButton } from "@/components/calculators/PrintButton";
import { ResetButton } from "@/components/calculators/ResetButton";
import { InputSummary } from "@/components/calculators/InputSummary";
import { ExcelActions } from "@/components/calculators/ExcelActions";
import { LayoutDashboard } from "lucide-react";
// import { AdBanner } from "@/components/monetization/AdBanner";

type FormValues = Record<string, FieldValue>;

const formSchema = z.record(
  z.string(),
  z.union([z.number().min(0), z.string(), z.boolean()]),
);

const emptyStateByCalculator: Record<CalculatorConfig["slug"], string> = {
  "wedding-cost": "금액과 하객 수를 입력하면 총 결혼 예산, 축의금 예상 회수액, 실제 부담 예상액이 표시됩니다.",
  "newlywed-home-budget": "보증금, 월세, 대출, 이사비와 가전·가구 비용을 입력하면 초기 현금 필요액과 월 고정비가 표시됩니다.",
  "wedding-hall-cost": "보증 인원, 예상 하객 수, 식대와 대관료를 입력하면 웨딩홀 총액과 최소 청구 기준이 표시됩니다.",
  "studio-dress-makeup-cost": "기본 패키지와 추가 옵션을 입력하면 스드메 총액과 옵션 비중이 표시됩니다.",
  "honsu-budget": "가전과 가구 비용을 입력하면 혼수 총액과 품목별 비중이 표시됩니다.",
  "wedding-gift-budget": "반지, 시계, 가방, 양가 선물 등을 입력하면 예물·예단 관련 총액이 표시됩니다.",
  "honeymoon-budget": "항공, 숙박, 식비, 액티비티, 쇼핑 비용을 입력하면 여행 총액과 구성비가 표시됩니다.",
  "congratulatory-money": "관계, 친밀도, 참석 상황을 선택하면 참고용 축의금 범위가 표시됩니다.",
};

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

export function CalculatorClient({ config }: { config: CalculatorConfig }) {
  const [hydrated, setHydrated] = useState(false);
  const [moneyUnit, setMoneyUnit] = useState<"won" | "manwon">("won");
  const [generatedAt, setGeneratedAt] = useState<Date | null>(null);
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
      : loadCalculatorState(config.storageKey);
    const nextValues = sanitizeValues(
      config,
      sharedValues || storedValues || defaultValues,
    );
    reset(nextValues);
    if (sharedValues || window.location.search || window.location.hash) {
      replaceCleanUrl();
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

  function fillExampleValues(presetValues = exampleValues) {
    reset(presetValues, { keepDirty: true });
  }

  function markGeneratedAt() {
    setGeneratedAt(new Date());
  }

  const mobileSecondarySummary = result.summary.find((summary) => /부담|초기|월 고정|추천|범위/.test(summary.label)) || result.summary[0];

  return (
    <div id="calculator" className="calculator-workspace scroll-mt-24">
      <div className="grid gap-8 lg:grid-cols-[minmax(22rem,0.82fr)_minmax(0,1.18fr)]">
        <section className="no-print space-y-5" aria-label="계산기 입력 영역">
          <Card>
            <CardHeader>
              <p className="text-sm font-black uppercase tracking-[0.2em] text-blush-700">
                Input
              </p>
              <h2 className="text-2xl font-black text-slate-950">예산 입력</h2>
              <p className="text-sm leading-6 text-slate-500">
                입력값은 서버가 아니라 현재 브라우저에만 자동 저장됩니다.
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <div className="inline-flex rounded-full border border-blush-200 bg-white p-1" aria-label="금액 입력 단위">
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
                          ? "rounded-full bg-blush-800 px-4 py-2 text-xs font-black text-white"
                          : "rounded-full px-4 py-2 text-xs font-black text-slate-600 hover:bg-blush-50"
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
                      className="min-h-10 rounded-full border border-blush-200 bg-white px-4 py-2 text-xs font-black text-blush-800 transition hover:bg-blush-50"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {groups.map(([groupName, fields]) => (
                  <fieldset key={groupName} className="space-y-3">
                    <legend className="rounded-full bg-blush-100 px-3 py-1 text-xs font-black text-blush-800">
                      {groupName}
                    </legend>
                    <div className="grid gap-3 sm:grid-cols-2">
                    {fields.map((fieldDef) => (
                      <Controller
                        key={fieldDef.id}
                        control={control}
                        name={fieldDef.id}
                        render={({ field }) => {
                          if (fieldDef.type === "money") {
                            return (
                              <MoneyInput
                                id={fieldDef.id}
                                label={fieldDef.label}
                                helpText={fieldDef.helpText}
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
                                helpText={fieldDef.helpText}
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
                                <span id={`${fieldDef.id}-label`} className="block h-5 text-sm font-bold leading-5 text-slate-800">
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
                                      ? "flex h-10 w-full items-center justify-between rounded-xl border border-blush-200 bg-blush-50 px-3 text-sm font-bold leading-none text-blush-900 outline-none transition focus:border-blush-500 focus:ring-4 focus:ring-blush-100"
                                      : "flex h-10 w-full items-center justify-between rounded-xl border border-blush-100 bg-white/95 px-3 text-sm font-bold leading-none text-slate-800 outline-none transition focus:border-blush-500 focus:ring-4 focus:ring-blush-100"
                                  }
                                >
                                  <span>{checked ? "예" : "아니오"}</span>
                                  <span
                                    className={
                                      checked
                                        ? "flex h-6 w-11 items-center justify-end rounded-full bg-blush-700 p-1"
                                        : "flex h-6 w-11 items-center justify-start rounded-full bg-slate-200 p-1"
                                    }
                                    aria-hidden="true"
                                  >
                                    <span className="h-4 w-4 rounded-full bg-white shadow-sm" />
                                  </span>
                                </button>
                                {fieldDef.helpText ? (
                                  <p className="text-xs leading-5 text-slate-500">
                                    {fieldDef.helpText}
                                  </p>
                                ) : null}
                              </div>
                            );
                          }

                          return (
                            <div className="space-y-2">
                              <label
                                htmlFor={fieldDef.id}
                                className="block h-5 text-sm font-bold leading-5 text-slate-800"
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
                                className="h-10 w-full rounded-xl border border-blush-100 bg-white/95 px-3 text-sm font-bold text-slate-900 outline-none transition focus:border-blush-500 focus:ring-4 focus:ring-blush-100"
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
                              {fieldDef.helpText ? (
                                <p className="text-xs leading-5 text-slate-500">
                                  {fieldDef.helpText}
                                </p>
                              ) : null}
                            </div>
                          );
                        }}
                      />
                    ))}
                    </div>
                  </fieldset>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* <AdBanner slot="content" label="계산기 입력 영역 하단 광고" /> */}
        </section>

        <section className="space-y-5 lg:sticky lg:top-24 lg:self-start" aria-label="계산 결과 영역" aria-live="polite">
          <div className="print-area">
            <ResultCard result={result} hasInput={hasMeaningfulInput} emptyState={emptyStateByCalculator[config.slug]} />
          </div>
          {hasMeaningfulInput ? (
            <div className="no-print grid gap-3 sm:grid-cols-2">
              <Link href="#budget-insights" className="inline-flex min-h-11 items-center justify-center rounded-full bg-blush-800 px-5 py-2.5 text-sm font-black text-white transition hover:bg-blush-700">
                비중과 절약팁 보기
              </Link>
              <Link href="/summary" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-blush-200 bg-white px-5 py-2.5 text-sm font-black text-blush-800 transition hover:bg-blush-50">
                <LayoutDashboard className="h-4 w-4" aria-hidden="true" />
                전체 요약
              </Link>
            </div>
          ) : null}
          {hasMeaningfulInput ? (
            <div className="no-print rounded-3xl border border-blush-100 bg-white/85 p-4">
              <h2 className="text-lg font-black text-slate-950">공유와 출력</h2>
              <div className="mt-4 flex flex-col items-stretch gap-3 sm:flex-row sm:items-start">
                <ShareButton values={values} onAction={markGeneratedAt} />
                <PrintButton onAction={markGeneratedAt} />
              </div>
              <details className="mt-4 rounded-2xl border border-blush-100 bg-white px-4 py-3">
                <summary className="cursor-pointer text-sm font-black text-slate-700">엑셀 내보내기</summary>
                <div className="mt-3">
                  <ExcelActions
                    config={config}
                    values={values}
                    result={result}
                    onAction={markGeneratedAt}
                  />
                </div>
              </details>
            </div>
          ) : null}
          <div className="no-print rounded-3xl border border-red-100 bg-white/85 p-4">
            <h2 className="text-lg font-black text-slate-950">입력값 관리</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">현재 계산기의 브라우저 저장값과 입력값을 초기화합니다.</p>
            <div className="mt-4 flex sm:justify-end">
              <ResetButton onReset={handleReset} />
            </div>
          </div>
        </section>
      </div>

      {hasMeaningfulInput ? (
        <section id="budget-insights" className="print-area mt-8 scroll-mt-24 space-y-6" aria-label="예산 분석과 입력 요약">
          <div className="rounded-3xl border border-blush-100 bg-white/80 p-5 shadow-soft md:p-6">
            <p className="text-sm font-black uppercase tracking-[0.2em] text-blush-700">Review</p>
            <h2 className="mt-2 text-2xl font-black text-slate-950">예산 검토</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">먼저 핵심 지표를 확인하고, 큰 비중 항목과 절약 팁을 함께 보세요. 입력값 요약은 출력과 최종 검토용으로 접어 두었습니다.</p>
          </div>
          <BudgetSummary result={result} hasInput={hasMeaningfulInput} />
          <details className="rounded-3xl border border-blush-100 bg-white p-5 shadow-soft md:p-6">
            <summary className="cursor-pointer text-lg font-black text-slate-950">입력값 요약</summary>
            <div className="mt-5">
              <InputSummary config={config} values={values} generatedAt={generatedAt} />
            </div>
          </details>
        </section>
      ) : null}

      {hasMeaningfulInput ? (
        <div className="no-print fixed inset-x-3 bottom-3 z-40 rounded-2xl border border-blush-100 bg-white/95 p-3 shadow-soft backdrop-blur lg:hidden">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs font-bold text-slate-500">{result.primaryLabel}</p>
              <p className="mt-1 text-lg font-black text-blush-800">{formatCurrency(result.total)}</p>
            </div>
            {mobileSecondarySummary ? (
              <div>
                <p className="text-xs font-bold text-slate-500">{mobileSecondarySummary.label}</p>
                <p className="mt-1 text-sm font-black text-slate-900">{mobileSecondarySummary.value}</p>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
