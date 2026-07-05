import type { CalculatorConfig, FieldValue } from "@/types/calculator";
import { sanitizeValues } from "@/lib/calculator-utils";
import { isPlainRecord } from "@/lib/security";

const storagePrefix = "weddingbudget:";
const legacyStoragePrefix = "wedding-budget:";

function canonicalStorageKey(key: string) {
  return key.startsWith(storagePrefix)
    ? key
    : `${storagePrefix}${key.replace(/^wedding-budget:/, "")}`;
}

function legacyStorageKey(key: string) {
  return key.startsWith(legacyStoragePrefix)
    ? key
    : `${legacyStoragePrefix}${key.replace(/^weddingbudget:/, "")}`;
}

function getStoredValue(key: string) {
  const canonicalKey = canonicalStorageKey(key);
  const legacyKey = legacyStorageKey(key);
  return window.localStorage.getItem(canonicalKey) ?? window.localStorage.getItem(legacyKey);
}

function isSupportedStoredValue(value: unknown): value is FieldValue {
  return (
    (typeof value === "number" && Number.isFinite(value)) ||
    typeof value === "string" ||
    typeof value === "boolean"
  );
}

function parseStoredState(
  config: CalculatorConfig,
  raw: string,
): Record<string, FieldValue> | null {
  const parsed = JSON.parse(raw);
  if (!isPlainRecord(parsed)) return null;

  const allowedFieldIds = new Set(config.fields.map((field) => field.id));
  const filtered: Record<string, FieldValue> = {};

  for (const [key, value] of Object.entries(parsed)) {
    if (allowedFieldIds.has(key) && isSupportedStoredValue(value)) {
      filtered[key] = value;
    }
  }

  return sanitizeValues(config, filtered);
}

export function loadCalculatorState(config: CalculatorConfig): Record<string, FieldValue> | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = getStoredValue(config.storageKey);
    if (!raw || raw.length > 50_000) return null;
    return parseStoredState(config, raw);
  } catch {
    return null;
  }
}

export function saveCalculatorState(key: string, values: Record<string, FieldValue>) {
  if (typeof window === "undefined") return;

  try {
    const canonicalKey = canonicalStorageKey(key);
    window.localStorage.setItem(canonicalKey, JSON.stringify(values));
    window.localStorage.removeItem(legacyStorageKey(key));
  } catch {
    // 저장 공간 부족 또는 비활성 브라우저 환경에서는 조용히 무시합니다.
  }
}

export function removeCalculatorState(key: string) {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.removeItem(canonicalStorageKey(key));
    window.localStorage.removeItem(legacyStorageKey(key));
  } catch {
    // no-op
  }
}

export function isWeddingBudgetStorageKey(key: string | null) {
  return !key || key.startsWith(storagePrefix) || key.startsWith(legacyStoragePrefix);
}
