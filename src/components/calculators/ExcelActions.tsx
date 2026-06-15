"use client";

import { useState } from "react";
import { FileDown } from "lucide-react";
import type {
  CalculatorConfig,
  CalculatorResult,
  FieldValue,
} from "@/types/calculator";
import { downloadCalculatorExcel } from "@/lib/excel";
import { Button } from "@/components/ui/button";

type ExcelActionsProps = {
  config: CalculatorConfig;
  values: Record<string, FieldValue>;
  result: CalculatorResult;
  onAction?: () => void;
};

type Status = {
  tone: "success" | "error";
  message: string;
};

function getErrorMessage(error: unknown) {
  return error instanceof Error
    ? error.message
    : "엑셀 처리 중 오류가 발생했습니다.";
}

export function ExcelActions({
  config,
  values,
  result,
  onAction,
}: ExcelActionsProps) {
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<Status | null>(null);

  async function handleDownload() {
    setBusy(true);
    setStatus(null);

    try {
      onAction?.();
      await downloadCalculatorExcel(config, values, result);
      setStatus({
        tone: "success",
        message: "입력값과 계산 결과를 엑셀 파일로 저장했습니다.",
      });
    } catch (error) {
      setStatus({ tone: "error", message: getErrorMessage(error) });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex max-w-2xl flex-col gap-3 rounded-3xl border border-blush-100 bg-white/80 p-3">
      <Button
        type="button"
        variant="secondary"
        onClick={handleDownload}
        disabled={busy}
        className="gap-2"
      >
        <FileDown className="h-4 w-4" aria-hidden="true" />
        엑셀 내보내기
      </Button>

      {status ? (
        <p
          className={
            status.tone === "success"
              ? "text-xs font-bold text-emerald-700"
              : "text-xs font-bold text-red-700"
          }
          role="status"
        >
          {status.message}
        </p>
      ) : null}
    </div>
  );
}
