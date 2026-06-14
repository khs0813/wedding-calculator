import type { FAQItem } from "@/types/calculator";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { JsonLd } from "@/components/seo/JsonLd";
import { FAQAccordion } from "@/components/seo/FAQAccordion";

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
          <FAQAccordion items={items} />
        </CardContent>
      </Card>
    </section>
  );
}
