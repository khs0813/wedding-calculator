"use client";

import { useMemo, useState } from "react";
import { formatCurrency, safeNumber } from "@/lib/calculator-utils";

const vendors = ["A", "B", "C"] as const;
type Vendor = (typeof vendors)[number];

const quoteRows = [
  { id: "basePackage", label: "기본 패키지" },
  { id: "rawFile", label: "원본 구매" },
  { id: "helper", label: "헬퍼비" },
  { id: "dressUpgrade", label: "드레스 업그레이드" },
  { id: "albumFrame", label: "앨범·액자" },
  { id: "earlyStart", label: "얼리스타트" },
  { id: "travel", label: "출장비" },
  { id: "etc", label: "기타 추가금" },
] as const;

type QuoteRowId = (typeof quoteRows)[number]["id"];
type QuoteState = Record<Vendor, Record<QuoteRowId, number>>;

const emptyQuoteState = vendors.reduce((vendorMap, vendor) => {
  vendorMap[vendor] = quoteRows.reduce((rowMap, row) => {
    rowMap[row.id] = 0;
    return rowMap;
  }, {} as Record<QuoteRowId, number>);
  return vendorMap;
}, {} as QuoteState);

export function SdmeQuoteComparison() {
  const [quotes, setQuotes] = useState<QuoteState>(emptyQuoteState);

  const totals = useMemo(() => {
    return vendors.reduce((nextTotals, vendor) => {
      nextTotals[vendor] = quoteRows.reduce((sum, row) => sum + safeNumber(quotes[vendor][row.id]), 0);
      return nextTotals;
    }, {} as Record<Vendor, number>);
  }, [quotes]);

  function updateQuote(vendor: Vendor, rowId: QuoteRowId, value: string) {
    setQuotes((current) => ({
      ...current,
      [vendor]: {
        ...current[vendor],
        [rowId]: safeNumber(Number(value)),
      },
    }));
  }

  return (
    <section className="no-print mt-10 rounded-2xl border border-border bg-card p-5 shadow-sm md:p-6" aria-label="스드메 업체 견적 비교표">
      <h2 className="text-2xl font-semibold text-foreground">업체 A/B/C 스드메 견적 비교표</h2>
      <p className="mt-3 text-sm leading-7 text-muted-foreground">
        상담 받은 업체별 견적을 같은 항목으로 입력하면 기본 패키지, 원본, 헬퍼비, 드레스 추가금과 최종 합계를 비교할 수 있습니다.
      </p>
      <div className="table-scroll mt-5 overflow-x-auto">
        <table className="w-full min-w-[720px] border-collapse text-sm">
          <caption className="sr-only">업체 A/B/C 스드메 견적 비교표</caption>
          <thead>
            <tr className="border-b border-border text-left text-muted-foreground">
              <th scope="col" className="py-3 pr-3">비교 항목</th>
              {vendors.map((vendor) => (
                <th key={vendor} scope="col" className="py-3 pr-3">업체 {vendor}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {quoteRows.map((row) => (
              <tr key={row.id} className="border-b border-border">
                <th scope="row" className="py-3 pr-3 text-left font-bold text-foreground">{row.label}</th>
                {vendors.map((vendor) => (
                  <td key={`${vendor}-${row.id}`} className="py-2 pr-3">
                    <label className="sr-only" htmlFor={`sdme-${vendor}-${row.id}`}>업체 {vendor} {row.label}</label>
                    <input
                      id={`sdme-${vendor}-${row.id}`}
                      type="number"
                      inputMode="numeric"
                      min="0"
                      value={quotes[vendor][row.id] || ""}
                      onChange={(event) => updateQuote(vendor, row.id, event.target.value)}
                      className="h-11 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      placeholder="0"
                    />
                  </td>
                ))}
              </tr>
            ))}
            <tr className="border-b border-border bg-secondary font-bold text-foreground">
              <th scope="row" className="py-3 pr-3 text-left">최종 합계</th>
              {vendors.map((vendor) => (
                <td key={`${vendor}-total`} className="py-3 pr-3">{formatCurrency(totals[vendor])}</td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}
