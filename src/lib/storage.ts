import type { FieldValue } from "@/types/calculator";
import { isPlainRecord } from "@/lib/security";

export function loadCalculatorState(key: string): Record<string, FieldValue> | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(key);
    if (!raw || raw.length > 50_000) return null;
    const parsed = JSON.parse(raw);
    return isPlainRecord(parsed) ? parsed as Record<string, FieldValue> : null;
  } catch {
    return null;
  }
}

export function saveCalculatorState(key: string, values: Record<string, FieldValue>) {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(key, JSON.stringify(values));
  } catch {
    // 저장 공간 부족 또는 비활성 브라우저 환경에서는 조용히 무시합니다.
  }
}

export function removeCalculatorState(key: string) {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.removeItem(key);
  } catch {
    // no-op
  }
}
