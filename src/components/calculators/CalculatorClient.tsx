"use client";

import { useEffect, useMemo, useState } from "react";
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
// import { AdBanner } from "@/components/monetization/AdBanner";

type FormValues = Record<string, FieldValue>;

const formSchema = z.record(
  z.string(),
  z.union([z.number().min(0), z.string(), z.boolean()]),
);

export function CalculatorClient({ config }: { config: CalculatorConfig }) {
  const [hydrated, setHydrated] = useState(false);
  const defaultValues = useMemo(() => getDefaultValues(config), [config]);

  const { control, reset } = useForm<FormValues>({
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
    replaceCleanUrl();
  }

  function handleExcelPasteImport(importedValues: Record<string, FieldValue>) {
    const nextValues = sanitizeValues(config, { ...values, ...importedValues });
    reset(nextValues);
    saveCalculatorState(config.storageKey, nextValues);
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

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(22rem,0.65fr)_minmax(0,1.35fr)]">
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
                            return (
                              <div className="space-y-1.5">
                                <span className="block h-4" aria-hidden="true" />
                                <label
                                  htmlFor={fieldDef.id}
                                  className="flex h-10 items-center gap-3 rounded-xl border border-blush-100 bg-white/95 px-3 text-sm font-bold leading-none text-slate-800"
                                >
                                  <input
                                    id={fieldDef.id}
                                    type="checkbox"
                                    checked={Boolean(field.value)}
                                    onChange={(event) =>
                                      field.onChange(event.target.checked)
                                    }
                                    className="h-5 w-5 rounded border-blush-200 text-blush-700 focus:ring-blush-200"
                                  />
                                  <span>{fieldDef.label}</span>
                                </label>
                              </div>
                            );
                          }

                          return (
                            <div className="space-y-2">
                              <label
                                htmlFor={fieldDef.id}
                                className="text-sm font-bold text-slate-800"
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
                                className="min-h-10 w-full rounded-xl border border-blush-100 bg-white/95 px-3 text-sm font-bold text-slate-900 outline-none transition focus:border-blush-500 focus:ring-4 focus:ring-blush-100"
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

        <div className="flex flex-wrap gap-3">
          <ShareButton values={values} />
          <PrintButton />
          <ExcelActions
            config={config}
            values={values}
            result={result}
            onPasteImport={handleExcelPasteImport}
          />
          <ResetButton onReset={handleReset} />
        </div>
      </section>

      <section className="print-area space-y-6" aria-label="계산 결과 영역">
        <ResultCard result={result} />
        <InputSummary config={config} values={values} />
        <BudgetSummary result={result} />
      </section>
    </div>
  );
}
