import type { CalculatorConfig, FieldValue } from "@/types/calculator";
import { isPlainRecord } from "@/lib/security";

const maxNumericInput = 999_999_999_999;

export function safeNumber(value: unknown): number {
  if (typeof value === "number" && Number.isFinite(value)) {
    return Math.min(maxNumericInput, Math.max(0, Math.round(value)));
  }

  if (typeof value === "string") {
    const normalized = value.replace(/,/g, "").trim();
    const parsed = Number(normalized);
    return Number.isFinite(parsed) ? Math.min(maxNumericInput, Math.max(0, Math.round(parsed))) : 0;
  }

  return 0;
}

export function parseCurrency(value: string): number {
  const normalized = value.replace(/,/g, "").trim();
  const manwonMatch = normalized.match(/^([0-9]+(?:\.[0-9]+)?)\s*만\s*원?$/);
  if (manwonMatch) {
    return safeNumber(Number(manwonMatch[1]) * 10000);
  }

  return safeNumber(value.replace(/[^0-9]/g, ""));
}

export function formatCurrency(value: number): string {
  return `${safeNumber(value).toLocaleString("ko-KR")}원`;
}

export function formatNumber(value: number, suffix = ""): string {
  return `${safeNumber(value).toLocaleString("ko-KR")}${suffix}`;
}

export function calculatePercentage(part: number, total: number): number {
  if (total <= 0) return 0;
  return Math.round((part / total) * 1000) / 10;
}

export function roundToUnit(value: number, unit = 1000): number {
  if (unit <= 0) return safeNumber(value);
  return Math.round(value / unit) * unit;
}

export function calculateMonthlyPayment(principal: number, annualRate: number, years: number) {
  const safePrincipal = safeNumber(principal);
  const safeAnnualRate = Math.min(100, safeNumber(annualRate));
  const months = Math.min(1_200, Math.max(0, safeNumber(years) * 12));

  if (safePrincipal <= 0 || months <= 0) {
    return { monthlyPayment: 0, totalPayment: 0, totalInterest: 0 };
  }

  const monthlyRate = safeAnnualRate <= 0 ? 0 : safeAnnualRate / 100 / 12;
  const monthlyPayment = monthlyRate === 0
    ? safePrincipal / months
    : safePrincipal * (monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);

  const totalPayment = monthlyPayment * months;
  const totalInterest = Math.max(0, totalPayment - safePrincipal);

  return {
    monthlyPayment: safeNumber(monthlyPayment),
    totalPayment: safeNumber(totalPayment),
    totalInterest: safeNumber(totalInterest)
  };
}

export function getDefaultValues(config: CalculatorConfig): Record<string, FieldValue> {
  return config.fields.reduce<Record<string, FieldValue>>((acc, field) => {
    acc[field.id] = field.defaultValue;
    return acc;
  }, {});
}

export function sanitizeValues(config: CalculatorConfig, source: unknown): Record<string, FieldValue> {
  const defaults = getDefaultValues(config);

  if (!isPlainRecord(source)) {
    return defaults;
  }

  const sourceRecord = source;
  const sanitized: Record<string, FieldValue> = { ...defaults };

  for (const field of config.fields) {
    const raw = sourceRecord[field.id];

    if (field.type === "money" || field.type === "number") {
      sanitized[field.id] = safeNumber(raw);
      continue;
    }

    if (field.type === "percent") {
      sanitized[field.id] = Math.min(100, safeNumber(raw));
      continue;
    }

    if (field.type === "checkbox") {
      sanitized[field.id] = Boolean(raw);
      continue;
    }

    if (field.type === "select") {
      const rawString = typeof raw === "string" ? raw : String(field.defaultValue);
      const allowed = field.options?.some((option) => option.value === rawString);
      sanitized[field.id] = allowed ? rawString : field.defaultValue;
    }
  }

  return sanitized;
}
