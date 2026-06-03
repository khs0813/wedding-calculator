"use client";

import { useState } from "react";
import { ClipboardPaste, FileDown, X } from "lucide-react";
import type {
  CalculatorConfig,
  CalculatorResult,
  FieldValue,
} from "@/types/calculator";
import {
  downloadCalculatorExcel,
  getExcelPastePolicyText,
  parseExcelPastedText,
} from "@/lib/excel";
import { Button } from "@/components/ui/button";

type ExcelActionsProps = {
  config: CalculatorConfig;
  values: Record<string, FieldValue>;
  result: CalculatorResult;
  onPasteImport: (values: Record<string, FieldValue>) => void;
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
  onPasteImport,
}: ExcelActionsProps) {
  const [busy, setBusy] = useState(false);
  const [open, setOpen] = useState(false);
  const [pasteText, setPasteText] = useState("");
  const [status, setStatus] = useState<Status | null>(null);

  async function handleDownload() {
    setBusy(true);
    setStatus(null);

    try {
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

  function handlePasteApply() {
    setStatus(null);

    try {
      const parsed = parseExcelPastedText(pasteText, config);
      onPasteImport(parsed.values);
      setPasteText("");
      setOpen(false);
      setStatus({
        tone: "success",
        message: `엑셀에서 복사한 입력값 ${parsed.matchedCount}개를 현재 계산기에 반영했습니다.`,
      });
    } catch (error) {
      setStatus({ tone: "error", message: getErrorMessage(error) });
    }
  }

  return (
    <div className="flex max-w-2xl flex-col gap-3 rounded-3xl border border-blush-100 bg-white/80 p-3">
      <div className="flex flex-wrap gap-3">
        <Button
          type="button"
          variant="secondary"
          onClick={handleDownload}
          disabled={busy}
          className="gap-2"
        >
          <FileDown className="h-4 w-4" aria-hidden="true" />
          엑셀 다운로드
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={() => {
            setOpen((current) => !current);
            setStatus(null);
          }}
          disabled={busy}
          className="gap-2"
          aria-expanded={open}
        >
          {open ? (
            <X className="h-4 w-4" aria-hidden="true" />
          ) : (
            <ClipboardPaste className="h-4 w-4" aria-hidden="true" />
          )}
          {open ? "붙여넣기 닫기" : "엑셀 붙여넣기"}
        </Button>
      </div>

      <p className="text-xs leading-5 text-slate-500">
        {getExcelPastePolicyText()} 다운로드한 엑셀의 입력값 시트 E열을 수정한
        뒤, 입력값 표를 복사해 붙여넣으세요.
      </p>

      {open ? (
        <div className="space-y-3 rounded-2xl bg-blush-50/70 p-3">
          <label
            htmlFor={`${config.slug}-excel-paste`}
            className="text-sm font-black text-slate-800"
          >
            엑셀에서 복사한 표 데이터 붙여넣기
          </label>
          <textarea
            id={`${config.slug}-excel-paste`}
            value={pasteText}
            onChange={(event) => setPasteText(event.target.value)}
            placeholder="예: 입력값 시트의 A:D 범위를 복사해서 붙여넣으세요."
            className="min-h-40 w-full rounded-2xl border border-blush-100 bg-white p-4 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blush-500 focus:ring-4 focus:ring-blush-100"
          />
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              onClick={handlePasteApply}
              disabled={!pasteText.trim()}
              className="gap-2"
            >
              <ClipboardPaste className="h-4 w-4" aria-hidden="true" />
              붙여넣은 값 반영
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setPasteText("")}
              disabled={!pasteText}
            >
              내용 지우기
            </Button>
          </div>
          <ul className="space-y-1 text-xs leading-5 text-slate-500">
            <li>
              • 파일 업로드는 사용하지 않으며, 붙여넣은 텍스트만 현재
              브라우저에서 해석합니다.
            </li>
            <li>
              • 항목명과 입력값이 함께 있으면 순서가 바뀌어도 최대한
              인식합니다.
            </li>
            <li>
              • 선택형 값은 한글 라벨과 내부값을 모두 인식하고, 체크박스는
              예/아니오 또는 true/false를 인식합니다.
            </li>
          </ul>
        </div>
      ) : null}

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
