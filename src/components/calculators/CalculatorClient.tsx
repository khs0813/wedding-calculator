"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Controller, type Resolver, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { CalculatorConfig, FieldValue } from "@/types/calculator";
import { calculateResult } from "@/lib/calculations";
import {
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

    return [
      { label: "소규모", values: makePreset(0.7) },
      { label: "평균형", values: exampleValues },
      { label: "넉넉한 예산", values: makePreset(1.4) },
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

  return (
    <div id="calculator" className="grid scroll-mt-24 gap-8 lg:grid-cols-[minmax(22rem,0.8fr)_minmax(0,1.2fr)]">
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

        <div className="rounded-3xl border border-blush-100 bg-white/85 p-4">
          <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-start">
            <ShareButton values={values} onAction={markGeneratedAt} />
            <PrintButton onAction={markGeneratedAt} />
          </div>
          <details className="mt-4">
            <summary className="cursor-pointer text-sm font-black text-slate-700">엑셀 도구</summary>
            <div className="mt-3">
              <ExcelActions
                config={config}
                values={values}
                result={result}
                onAction={markGeneratedAt}
              />
            </div>
          </details>
          <div className="mt-4 flex border-t border-blush-100 pt-4 sm:justify-end">
            <ResetButton onReset={handleReset} />
          </div>
        </div>
      </section>

      <section className="print-area space-y-6 lg:sticky lg:top-24 lg:self-start" aria-label="계산 결과 영역" aria-live="polite">
        <ResultCard result={result} hasInput={hasMeaningfulInput} emptyState={emptyStateByCalculator[config.slug]} />
        <BudgetSummary result={result} hasInput={hasMeaningfulInput} />
        {hasMeaningfulInput ? <InputSummary config={config} values={values} generatedAt={generatedAt} /> : null}
        {hasMeaningfulInput ? (
          <Link href="/summary" className="no-print inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full border border-blush-200 bg-white px-5 py-2.5 text-sm font-black text-blush-800 transition hover:bg-blush-50">
            <LayoutDashboard className="h-4 w-4" aria-hidden="true" />
            내 예산 요약 보기
          </Link>
        ) : null}
      </section>
      {hasMeaningfulInput ? (
        <div className="no-print fixed inset-x-3 bottom-3 z-40 rounded-2xl border border-blush-100 bg-white/95 p-3 shadow-soft backdrop-blur lg:hidden">
          <p className="text-xs font-bold text-slate-500">{result.primaryLabel}</p>
          <p className="mt-1 text-lg font-black text-blush-800">{result.total.toLocaleString("ko-KR")}원</p>
        </div>
      ) : null}
    </div>
  );
}
