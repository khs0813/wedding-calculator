import type { CalculatorConfig, FieldValue } from "@/types/calculator";
import { sanitizeValues } from "@/lib/calculator-utils";
import { isPlainRecord } from "@/lib/security";

export const WEDDING_BUDGET_STORAGE_VERSION = 1;
export const WEDDING_BUDGET_STORAGE_KEY = "weddingbudget:state";

const storagePrefix = "weddingbudget:";
const legacyStoragePrefix = "wedding-budget:";

const calculatorStateKeys: Record<string, string> = {
  "wedding-cost": "weddingCost",
  "newlywed-home": "housing",
  "wedding-hall": "weddingHall",
  "studio-dress-makeup": "studioDressMakeup",
  honsu: "homeAppliances",
  "wedding-gift": "gifts",
  honeymoon: "honeymoon",
  "congratulatory-money": "congratulatoryMoney",
};

type VersionedStorageState = {
  version: number;
  updatedAt: string;
  calculators: Record<string, Record<string, FieldValue>>;
};

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

function aggregateCalculatorKey(key: string) {
  const shortKey = key
    .replace(/^weddingbudget:/, "")
    .replace(/^wedding-budget:/, "");
  return calculatorStateKeys[shortKey] || shortKey;
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

  if (
    typeof parsed.version === "number" &&
    isPlainRecord(parsed.values)
  ) {
    return sanitizeValues(config, parsed.values);
  }

  const allowedFieldIds = new Set(config.fields.map((field) => field.id));
  const filtered: Record<string, FieldValue> = {};

  for (const [key, value] of Object.entries(parsed)) {
    if (allowedFieldIds.has(key) && isSupportedStoredValue(value)) {
      filtered[key] = value;
    }
  }

  return sanitizeValues(config, filtered);
}

function loadAggregateState(): VersionedStorageState | null {
  try {
    const raw = window.localStorage.getItem(WEDDING_BUDGET_STORAGE_KEY);
    if (!raw || raw.length > 250_000) return null;

    const parsed = JSON.parse(raw);
    if (
      !isPlainRecord(parsed) ||
      parsed.version !== WEDDING_BUDGET_STORAGE_VERSION ||
      typeof parsed.updatedAt !== "string" ||
      !isPlainRecord(parsed.calculators)
    ) {
      return null;
    }

    return {
      version: WEDDING_BUDGET_STORAGE_VERSION,
      updatedAt: parsed.updatedAt,
      calculators: parsed.calculators as Record<string, Record<string, FieldValue>>,
    };
  } catch {
    return null;
  }
}

function saveAggregateCalculatorState(
  storageKey: string,
  values: Record<string, FieldValue> | null,
) {
  const current = loadAggregateState() || {
    version: WEDDING_BUDGET_STORAGE_VERSION,
    updatedAt: new Date().toISOString(),
    calculators: {},
  };
  const calculatorKey = aggregateCalculatorKey(storageKey);

  if (values) {
    current.calculators[calculatorKey] = values;
  } else {
    delete current.calculators[calculatorKey];
  }

  current.updatedAt = new Date().toISOString();
  window.localStorage.setItem(WEDDING_BUDGET_STORAGE_KEY, JSON.stringify(current));
}

function loadAggregateCalculatorState(config: CalculatorConfig) {
  const aggregate = loadAggregateState();
  const values = aggregate?.calculators[aggregateCalculatorKey(config.storageKey)];

  return isPlainRecord(values) ? sanitizeValues(config, values) : null;
}

export function loadCalculatorState(config: CalculatorConfig): Record<string, FieldValue> | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = getStoredValue(config.storageKey);
    if (!raw || raw.length > 50_000) return loadAggregateCalculatorState(config);
    return parseStoredState(config, raw) || loadAggregateCalculatorState(config);
  } catch {
    return loadAggregateCalculatorState(config);
  }
}

export function saveCalculatorState(key: string, values: Record<string, FieldValue>) {
  if (typeof window === "undefined") return;

  try {
    const canonicalKey = canonicalStorageKey(key);
    window.localStorage.setItem(canonicalKey, JSON.stringify(values));
    window.localStorage.removeItem(legacyStorageKey(key));
    saveAggregateCalculatorState(key, values);
  } catch {
    // 저장 공간 부족 또는 비활성 브라우저 환경에서는 조용히 무시합니다.
  }
}

export function removeCalculatorState(key: string) {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.removeItem(canonicalStorageKey(key));
    window.localStorage.removeItem(legacyStorageKey(key));
    saveAggregateCalculatorState(key, null);
  } catch {
    // no-op
  }
}

export function isWeddingBudgetStorageKey(key: string | null) {
  return !key || key === WEDDING_BUDGET_STORAGE_KEY || key.startsWith(storagePrefix) || key.startsWith(legacyStoragePrefix);
}
