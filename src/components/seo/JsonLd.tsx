import { safeJsonLdStringify } from "@/lib/security";

type JsonLdData = Record<string, unknown> | Record<string, unknown>[];

export function JsonLd({ data }: { data: JsonLdData }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(data) }} />;
}
