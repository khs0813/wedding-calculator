export function isPlainRecord(value: unknown): value is Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }

  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

const jsonLdEscapes: Record<string, string> = {
  "<": "\\u003c",
  ">": "\\u003e",
  "&": "\\u0026",
  "\u2028": "\\u2028",
  "\u2029": "\\u2029"
};

export function safeJsonLdStringify(data: unknown): string {
  return JSON.stringify(data).replace(/[<>&\u2028\u2029]/g, (character) => jsonLdEscapes[character] ?? character);
}

function isLocalHttpUrl(parsed: URL) {
  return parsed.protocol === "http:" && ["localhost", "127.0.0.1", "::1"].includes(parsed.hostname);
}

export function sanitizeHttpUrl(value: string | undefined): string {
  if (!value || value.trim() === "#") {
    return "#";
  }

  try {
    const parsed = new URL(value.trim());
    if (parsed.protocol === "https:" || isLocalHttpUrl(parsed)) {
      parsed.hash = parsed.hash.slice(0, 256);
      return parsed.toString();
    }
  } catch {
    return "#";
  }

  return "#";
}

export function getSafeSiteUrl(value: string | undefined, fallback = "https://wedding-budget-calculator.onrender.com"): string {
  try {
    const parsed = new URL(value || fallback);
    if (parsed.protocol === "https:" || isLocalHttpUrl(parsed)) {
      return parsed.origin.replace(/\/$/, "");
    }
  } catch {
    // fall through to the known-safe fallback
  }

  return fallback;
}
