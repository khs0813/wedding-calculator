import type { CalculatorConfig, FieldValue } from "@/types/calculator";
import { formatCurrency, formatNumber, safeNumber } from "@/lib/calculator-utils";

function formatInputValue(fieldId: string, config: CalculatorConfig, values: Record<string, FieldValue>) {
  const field = config.fields.find((entry) => entry.id === fieldId);
  if (!field) return "-";

  const value = values[field.id];

  if (field.type === "money") return formatCurrency(safeNumber(value));
  if (field.type === "number" || field.type === "percent") return formatNumber(safeNumber(value), field.suffix || "");
  if (field.type === "checkbox") return value ? "예" : "아니오";
  if (field.type === "select") return field.options?.find((option) => option.value === value)?.label || String(value);
  return String(value ?? "");
}

export function InputSummary({ config, values, generatedAt }: { config: CalculatorConfig; values: Record<string, FieldValue>; generatedAt?: Date | null }) {
  return (
    <section className="rounded-2xl border border-border bg-card p-6">
      <h3 className="text-xl font-semibold text-foreground">입력값 요약</h3>
      <p className="mt-2 text-sm text-muted-foreground">PDF 출력 시 함께 포함되는 입력 내역입니다.</p>
      <div className="table-scroll mt-5 overflow-x-auto">
        <table className="w-full min-w-[520px] border-collapse text-sm">
          <caption className="sr-only">{config.shortTitle} 입력값 요약</caption>
          <tbody>
            {config.fields.map((field) => (
              <tr key={field.id} className="border-b border-border last:border-0">
                <th scope="row" className="py-3 pr-4 text-left font-bold text-muted-foreground">{field.label}</th>
                <td className="py-3 text-right text-muted-foreground">{formatInputValue(field.id, config, values)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {generatedAt ? (
        <p className="mt-5 text-xs text-muted-foreground">
          결과 생성일: {generatedAt.toLocaleString("ko-KR")} · 사이트명: 웨딩 예산 계산기
        </p>
      ) : null}
    </section>
  );
}
