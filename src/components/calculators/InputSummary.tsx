import type { CalculatorConfig, FieldValue } from "@/types/calculator";
import { formatCurrency, formatNumber, safeNumber } from "@/lib/calculator-utils";
import { absolutePageUrl } from "@/lib/seo";

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
  const printedAt = generatedAt || new Date();

  return (
    <section className="rounded-2xl border border-border bg-card p-6">
      <h3 className="text-xl font-semibold text-foreground">입력값 요약</h3>
      <p className="mt-2 text-sm text-muted-foreground">PDF 출력 시 함께 포함되는 입력 기준입니다.</p>
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
      <div className="mt-5 space-y-1 text-xs leading-5 text-muted-foreground">
        <p>주의 문구: 입력값을 바탕으로 한 참고용 계산이며 실제 견적은 지역, 날짜, 업체, 계약 조건에 따라 달라질 수 있습니다.</p>
        <p>생성일: {printedAt.toLocaleString("ko-KR")}</p>
        <p>원본 페이지 주소: {absolutePageUrl(config.path)}</p>
      </div>
    </section>
  );
}
