import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { CalculatorSlug } from "@/types/calculator";
import { calculators } from "@/data/calculators";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function RelatedCalculators({ currentSlug, relatedSlugs }: { currentSlug: CalculatorSlug; relatedSlugs: CalculatorSlug[] }) {
  const related = relatedSlugs
    .map((slug) => calculators.find((calculator) => calculator.slug === slug))
    .filter((calculator): calculator is NonNullable<typeof calculator> => Boolean(calculator && calculator.slug !== currentSlug));

  if (related.length === 0) return null;

  return (
    <section>
      <Card>
        <CardHeader>
          <h2 className="text-2xl font-black text-slate-950">관련 계산기</h2>
          <p className="text-sm text-slate-500">함께 확인하면 좋은 예산 계산기입니다.</p>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {related.map((calculator) => (
              <Link key={calculator.slug} href={calculator.path} className="group rounded-3xl border border-blush-100 p-5 transition hover:border-blush-200 hover:bg-blush-50/60">
                <h3 className="font-black text-slate-950">{calculator.shortTitle}</h3>
                <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">{calculator.description}</p>
                <span className="mt-4 inline-flex items-center gap-2 text-sm font-black text-blush-800">
                  바로가기
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" aria-hidden="true" />
                </span>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
