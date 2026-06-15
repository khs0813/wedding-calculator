"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  CheckCircle2,
  FileDown,
  RefreshCw,
  Trash2,
} from "lucide-react";
import { calculators } from "@/data/calculators";
import { calculateResult } from "@/lib/calculations";
import { downloadSummaryExcel } from "@/lib/excel";
import {
  formatCurrency,
  getDefaultValues,
  safeNumber,
  sanitizeValues,
} from "@/lib/calculator-utils";
import {
  loadCalculatorState,
  removeCalculatorState,
} from "@/lib/storage";
import type {
  CalculatorConfig,
  CalculatorResult,
  FieldValue,
} from "@/types/calculator";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PrintButton } from "@/components/calculators/PrintButton";

const detailBudgetSlugs = new Set([
  "wedding-hall-cost",
  "studio-dress-makeup-cost",
  "honsu-budget",
  "wedding-gift-budget",
  "honeymoon-budget",
]);

function isMeaningfullyFilled(
  config: CalculatorConfig,
  values: Record<string, FieldValue>,
): boolean {
  const defaults = getDefaultValues(config);

  return config.fields.some((field) => {
    const value = values[field.id];
    const defaultValue = defaults[field.id];

    if (field.type === "money" || field.type === "number" || field.type === "percent") {
      return safeNumber(value) !== safeNumber(defaultValue);
    }

    if (field.type === "checkbox") {
      return Boolean(value) !== Boolean(defaultValue);
    }

    return String(value ?? "") !== String(defaultValue ?? "");
  });
}

function countFilledFields(
  config: CalculatorConfig,
  values: Record<string, FieldValue>,
): number {
  const defaults = getDefaultValues(config);

  return config.fields.filter((field) => {
    const value = values[field.id];
    const defaultValue = defaults[field.id];

    if (field.type === "money" || field.type === "number" || field.type === "percent") {
      return safeNumber(value) !== safeNumber(defaultValue);
    }

    if (field.type === "checkbox") {
      return Boolean(value) !== Boolean(defaultValue);
    }

    return String(value ?? "") !== String(defaultValue ?? "");
  }).length;
}

type DashboardRow = {
  config: CalculatorConfig;
  values: Record<string, FieldValue>;
  result: CalculatorResult;
  hasSavedState: boolean;
  hasMeaningfulInput: boolean;
  filledFields: number;
};

function createRow(
  config: CalculatorConfig,
  sourceValues: Record<string, FieldValue>,
  hasSavedState: boolean,
): DashboardRow {
  const values = sanitizeValues(config, sourceValues);
  const result = calculateResult(config.slug, values);

  return {
    config,
    values,
    result,
    hasSavedState,
    hasMeaningfulInput: isMeaningfullyFilled(config, values),
    filledFields: countFilledFields(config, values),
  };
}

function loadRows(): DashboardRow[] {
  return calculators.map((config) => {
    const storedValues = loadCalculatorState(config.storageKey);

    return createRow(
      config,
      storedValues || getDefaultValues(config),
      Boolean(storedValues),
    );
  });
}

function StatusBadge({ row }: { row: DashboardRow }) {
  if (row.hasMeaningfulInput) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">
        <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
        입력됨
      </span>
    );
  }

  if (row.hasSavedState) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-xs font-black text-amber-700">
        기본값
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600">
      미입력
    </span>
  );
}

function getRowStatus(row: DashboardRow) {
  if (row.hasMeaningfulInput) return "입력됨";
  if (row.hasSavedState) return "기본값";
  return "미입력";
}

function ResultsTable({ rows }: { rows: DashboardRow[] }) {
  return (
    <div className="table-scroll overflow-x-auto">
      <table className="w-full min-w-[840px] border-collapse text-sm">
        <caption className="sr-only">브라우저에 저장된 계산기별 예산 결과 요약</caption>
        <thead>
            <tr className="border-b border-blush-100 text-left text-slate-500">
            <th scope="col" className="py-3 pr-3">계산기</th>
            <th scope="col" className="py-3 pr-3">상태</th>
            <th scope="col" className="py-3 pr-3 text-right">합계</th>
            <th scope="col" className="py-3 pr-3">보조 결과 1</th>
            <th scope="col" className="py-3 pr-3">보조 결과 2</th>
            <th scope="col" className="py-3 text-right no-print">이동</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={`table-${row.config.slug}`} className="border-b border-blush-100/70 last:border-0">
              <th scope="row" className="py-3 pr-3 text-left font-black text-slate-900">{row.config.shortTitle}</th>
              <td className="py-3 pr-3"><StatusBadge row={row} /></td>
              <td className="py-3 pr-3 text-right font-black text-blush-800">{formatCurrency(row.result.total)}</td>
              <td className="py-3 pr-3 text-slate-600">{row.result.summary[0]?.label}: {row.result.summary[0]?.value}</td>
              <td className="py-3 pr-3 text-slate-600">{row.result.summary[1]?.label}: {row.result.summary[1]?.value}</td>
              <td className="py-3 text-right no-print">
                <Link
                  href={row.config.path}
                  className="inline-flex items-center justify-end gap-1 font-black text-blush-800 hover:text-blush-700"
                >
                  이동
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function SummaryResultsTableCard() {
  const [rows, setRows] = useState<DashboardRow[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const refreshRows = useCallback(() => {
    setRows(loadRows());
    setHydrated(true);
  }, []);

  useEffect(() => {
    refreshRows();

    function handleStorage(event: StorageEvent) {
      if (!event.key || event.key.startsWith("wedding-budget:")) {
        refreshRows();
      }
    }

    window.addEventListener("storage", handleStorage);
    window.addEventListener("focus", refreshRows);

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("focus", refreshRows);
    };
  }, [refreshRows]);

  async function handleDownload() {
    setDownloading(true);

    try {
      await downloadSummaryExcel(
        rows.map((row) => ({
          title: row.config.shortTitle,
          status: getRowStatus(row),
          total: row.result.total,
          summaryOne: row.result.summary[0]
            ? `${row.result.summary[0].label}: ${row.result.summary[0].value}`
            : "",
          summaryTwo: row.result.summary[1]
            ? `${row.result.summary[1].label}: ${row.result.summary[1].value}`
            : "",
        })),
      );
    } finally {
      setDownloading(false);
    }
  }

  function handleClearAll() {
    const confirmed = window.confirm(
      "전체 결과 표의 모든 계산기 저장값을 초기화할까요? 현재 브라우저에 저장된 값만 삭제됩니다.",
    );

    if (!confirmed) return;

    calculators.forEach((calculator) => removeCalculatorState(calculator.storageKey));
    refreshRows();
  }

  return (
    <Card className="overflow-hidden bg-gradient-to-br from-blush-50 via-cream-50 to-sage-50 shadow-none">
      <CardHeader>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blush-700" aria-hidden="true" />
              <h2 className="text-xl font-black text-slate-950">전체 결과 표</h2>
            </div>
            <p className="mt-2 text-sm text-slate-500">각 계산기의 핵심 결과를 한 표에서 비교합니다.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="secondary"
              onClick={handleDownload}
              disabled={!hydrated || downloading}
              className="min-h-10 gap-2 px-4 py-2 text-xs"
            >
              <FileDown className="h-4 w-4" aria-hidden="true" />
              엑셀 다운로드
            </Button>
            <Button
              type="button"
              variant="danger"
              onClick={handleClearAll}
              disabled={!hydrated}
              className="min-h-10 gap-2 px-4 py-2 text-xs"
            >
              <Trash2 className="h-4 w-4" aria-hidden="true" />
              초기화
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {hydrated ? (
          <ResultsTable rows={rows} />
        ) : (
          <p className="text-sm leading-7 text-slate-600">브라우저에 저장된 계산 결과를 불러오는 중입니다.</p>
        )}
      </CardContent>
    </Card>
  );
}

export function AllResultsDashboard() {
  const [rows, setRows] = useState<DashboardRow[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);

  const refreshRows = useCallback(() => {
    setRows(loadRows());
    setUpdatedAt(new Date());
    setHydrated(true);
  }, []);

  useEffect(() => {
    refreshRows();

    function handleStorage(event: StorageEvent) {
      if (!event.key || event.key.startsWith("wedding-budget:")) {
        refreshRows();
      }
    }

    window.addEventListener("storage", handleStorage);
    window.addEventListener("focus", refreshRows);

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("focus", refreshRows);
    };
  }, [refreshRows]);

  const mainWeddingRow = rows.find((row) => row.config.slug === "wedding-cost");
  const homeRow = rows.find((row) => row.config.slug === "newlywed-home-budget");

  const filledCount = rows.filter((row) => row.hasMeaningfulInput).length;
  const detailRows = rows.filter((row) => detailBudgetSlugs.has(row.config.slug));
  const detailWeddingTotal = detailRows.reduce((sum, row) => sum + row.result.total, 0);
  const referenceGrandTotal = detailWeddingTotal + (homeRow?.result.total || 0);

  function handleClearAll() {
    const confirmed = window.confirm(
      "모든 계산기의 브라우저 저장값을 삭제할까요? 이 작업은 현재 브라우저에 저장된 값만 삭제합니다.",
    );

    if (!confirmed) return;

    calculators.forEach((calculator) => removeCalculatorState(calculator.storageKey));
    refreshRows();
  }

  if (!hydrated) {
    return (
      <Card className="p-6">
        <p className="text-sm leading-7 text-slate-600">브라우저에 저장된 계산 결과를 불러오는 중입니다.</p>
      </Card>
    );
  }

  return (
    <div id="summary-editor" className="space-y-8">
      <section className="print-area space-y-8" aria-label="통합 계산 결과 영역">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="p-5">
            <p className="text-sm font-bold text-slate-500">결혼 비용 계산기 총액</p>
            <p className="mt-2 text-2xl font-black text-blush-800">
              {formatCurrency(mainWeddingRow?.result.total || 0)}
            </p>
            <p className="mt-2 text-xs leading-5 text-slate-500">
              전체 결혼 비용 계산기에서 저장된 대표 총액입니다.
            </p>
          </Card>
          <Card className="p-5">
            <p className="text-sm font-bold text-slate-500">세부 결혼 항목 합계</p>
            <p className="mt-2 text-2xl font-black text-slate-950">
              {formatCurrency(detailWeddingTotal)}
            </p>
            <p className="mt-2 text-xs leading-5 text-slate-500">
              웨딩홀·스드메·혼수·예물·신혼여행 계산기 합계입니다.
            </p>
          </Card>
          <Card className="p-5">
            <p className="text-sm font-bold text-slate-500">신혼집 준비 총 비용</p>
            <p className="mt-2 text-2xl font-black text-slate-950">
              {formatCurrency(homeRow?.result.total || 0)}
            </p>
            <p className="mt-2 text-xs leading-5 text-slate-500">
              보증금/매매가와 초기 입주 비용을 포함합니다.
            </p>
          </Card>
          <Card className="p-5">
            <p className="text-sm font-bold text-slate-500">입력된 계산기</p>
            <p className="mt-2 text-2xl font-black text-slate-950">
              {filledCount} / {rows.length}개
            </p>
            <p className="mt-2 text-xs leading-5 text-slate-500">
              기본값과 달라진 입력값이 있는 계산기 수입니다.
            </p>
          </Card>
        </div>

        <Card className="border-amber-200 bg-amber-50/70 shadow-none">
          <CardContent className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="flex gap-3">
              <AlertTriangle className="mt-1 h-5 w-5 shrink-0 text-amber-600" aria-hidden="true" />
              <div>
                <h2 className="text-lg font-black text-amber-950">통합 합계는 중복 여부를 확인하며 사용하세요</h2>
                <p className="mt-2 text-sm leading-7 text-amber-900">
                  결혼 비용 계산기는 스드메·혼수·신혼여행 같은 항목을 직접 포함할 수 있습니다. 따라서 아래 참고 합계는 전체 결혼 비용 계산기를 제외하고 세부 계산기와 신혼집 계산기만 더한 값입니다. 축의금 계산기는 추천 금액이므로 합계에서 제외했습니다.
                </p>
              </div>
            </div>
            <div className="rounded-2xl bg-white px-5 py-4 text-right shadow-sm">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-amber-600">Reference total</p>
              <p className="mt-1 text-2xl font-black text-amber-950">{formatCurrency(referenceGrandTotal)}</p>
            </div>
          </CardContent>
        </Card>
      </section>

      <div className="no-print flex flex-wrap items-center gap-3">
        <Button type="button" variant="secondary" onClick={refreshRows} className="gap-2">
          <RefreshCw className="h-4 w-4" aria-hidden="true" />
          저장값 다시 불러오기
        </Button>
        <PrintButton />
        <Button type="button" variant="danger" onClick={handleClearAll} className="gap-2">
          <Trash2 className="h-4 w-4" aria-hidden="true" />
          모든 저장값 초기화
        </Button>
        {updatedAt ? (
          <p className="text-xs text-slate-500">
            마지막 갱신: {updatedAt.toLocaleString("ko-KR")}
          </p>
        ) : null}
      </div>
    </div>
  );
}
