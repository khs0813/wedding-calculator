import type { FAQItem } from "@/types/calculator";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { JsonLd } from "@/components/seo/JsonLd";
import { FAQAccordion } from "@/components/seo/FAQAccordion";

export function FAQSection({ title = "자주 묻는 질문", items, emitJsonLd = true }: { title?: string; items: FAQItem[]; emitJsonLd?: boolean }) {
  if (items.length === 0) return null;

  return (
    <section>
      {emitJsonLd ? (
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
      ) : null}
      <Card>
        <CardHeader>
          <h2 className="text-2xl font-semibold text-foreground">{title}</h2>
        </CardHeader>
        <CardContent>
          <FAQAccordion items={items} />
        </CardContent>
      </Card>
    </section>
  );
}
