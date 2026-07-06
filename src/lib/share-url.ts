import type { CalculatorConfig, FieldValue } from "@/types/calculator";
import { isPlainRecord } from "@/lib/security";

const maxShareDataLength = 12_000;
const shareDataVersion = 1;
const sensitiveFieldPattern = /(name|phone|email|address|resident|ssn|jumin|주민|전화|이메일|주소|성명|이름)/i;

type SharePayload = {
  version: number;
  values: Record<string, FieldValue>;
};

function isSupportedShareValue(value: unknown): value is FieldValue {
  return (
    (typeof value === "number" && Number.isFinite(value)) ||
    typeof value === "string" ||
    typeof value === "boolean"
  );
}

export function createSafeShareValues(
  config: CalculatorConfig,
  values: Record<string, FieldValue>,
) {
  const safeValues: Record<string, FieldValue> = {};

  for (const field of config.fields) {
    if (sensitiveFieldPattern.test(field.id) || sensitiveFieldPattern.test(field.label)) {
      continue;
    }

    const value = values[field.id];
    if (isSupportedShareValue(value)) {
      safeValues[field.id] = value;
    }
  }

  return safeValues;
}

export function encodeShareData(values: Record<string, FieldValue>): string {
  const payload: SharePayload = {
    version: shareDataVersion,
    values,
  };
  const json = JSON.stringify(payload);
  const bytes = new TextEncoder().encode(json);
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });

  return window.btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function decodeShareData(encoded: string): Record<string, FieldValue> | null {
  if (!encoded || encoded.length > maxShareDataLength) {
    return null;
  }

  try {
    const normalized = encoded.replace(/-/g, "+").replace(/_/g, "/");
    const padding = "=".repeat((4 - (normalized.length % 4)) % 4);
    const binary = window.atob(normalized + padding);
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
    const json = new TextDecoder().decode(bytes);
    const parsed = JSON.parse(json);
    if (!isPlainRecord(parsed)) return null;

    if (
      parsed.version === shareDataVersion &&
      isPlainRecord(parsed.values)
    ) {
      return parsed.values as Record<string, FieldValue>;
    }

    return parsed as Record<string, FieldValue>;
  } catch {
    return null;
  }
}

export async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }

    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";
    document.body.appendChild(textarea);
    textarea.select();
    const success = document.execCommand("copy");
    document.body.removeChild(textarea);
    return success;
  } catch {
    return false;
  }
}

export function createShareHash(
  config: CalculatorConfig,
  values: Record<string, FieldValue>,
): string {
  return `#state=${encodeShareData(createSafeShareValues(config, values))}`;
}

export function getSharedDataFromLocation(location: Location): string | null {
  const hash = location.hash.startsWith("#")
    ? location.hash.slice(1)
    : location.hash;
  const hashParams = new URLSearchParams(hash);
  return hashParams.get("state");
}
