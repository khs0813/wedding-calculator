import type { FAQItem } from "@/types/calculator";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { JsonLd } from "@/components/seo/JsonLd";

export function FAQSection({ title = "자주 묻는 질문", items }: { title?: string; items: FAQItem[] }) {
  if (items.length === 0) return null;

  return (
    <section>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: items.map((item) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: item.answer
            }
          }))
        }}
      />
      <Card>
        <CardHeader>
          <h2 className="text-2xl font-black text-slate-950">{title}</h2>
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-blush-100/70">
            {items.map((item) => (
              <details key={item.question} className="group py-5">
                <summary className="cursor-pointer list-none text-base font-black text-slate-900 marker:hidden">
                  <span className="inline-flex w-full items-center justify-between gap-4">
                    {item.question}
                    <span className="rounded-full bg-blush-50 px-2 py-1 text-xs text-blush-700 group-open:hidden">열기</span>
                    <span className="hidden rounded-full bg-blush-100 px-2 py-1 text-xs text-blush-800 group-open:inline">닫기</span>
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-7 text-slate-600">{item.answer}</p>
              </details>
            ))}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
