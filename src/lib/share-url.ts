import type { FieldValue } from "@/types/calculator";
import { isPlainRecord } from "@/lib/security";

const maxShareDataLength = 12_000;

export function encodeShareData(values: Record<string, FieldValue>): string {
  const json = JSON.stringify(values);
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
    return isPlainRecord(parsed) ? parsed as Record<string, FieldValue> : null;
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
