"use client";

import Link from "next/link";
import { ArrowRight, LayoutDashboard } from "lucide-react";
import { calculators } from "@/data/calculators";
import type { CalculatorSlug } from "@/types/calculator";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const nextCalculatorMap: Record<CalculatorSlug, string[]> = {
  "wedding-cost": ["wedding-hall-cost", "studio-dress-makeup-cost", "honsu-budget"],
  "wedding-hall-cost": ["congratulatory-money", "wedding-cost", "studio-dress-makeup-cost"],
  "newlywed-home-budget": ["honsu-budget", "wedding-cost", "honeymoon-budget"],
  "studio-dress-makeup-cost": ["wedding-cost", "wedding-hall-cost", "wedding-gift-budget"],
  "honsu-budget": ["newlywed-home-budget", "wedding-cost", "wedding-gift-budget"],
  "wedding-gift-budget": ["wedding-cost", "honsu-budget", "studio-dress-makeup-cost"],
  "honeymoon-budget": ["wedding-cost", "newlywed-home-budget", "summary"],
  "congratulatory-money": ["wedding-hall-cost", "wedding-cost"],
};

export function NextCalculatorSection({ currentSlug }: { currentSlug: CalculatorSlug }) {
  const entries = nextCalculatorMap[currentSlug]
    .map((slug) => {
      if (slug === "summary") {
        return {
          key: "summary",
          href: "/summary/",
          title: "내 예산표",
          description: "여러 계산기 결과를 한 화면에서 비교합니다.",
          type: "summary" as const,
        };
      }

      const calculator = calculators.find((entry) => entry.slug === slug);
      return calculator
        ? {
            key: calculator.slug,
            href: calculator.path,
            title: calculator.shortTitle,
            description: calculator.description,
            type: "calculator" as const,
          }
        : null;
    })
    .filter((entry): entry is NonNullable<typeof entry> => Boolean(entry))
    .slice(0, 3);

  if (!entries.length) {
    return null;
  }

  return (
    <section className="no-print mt-16" aria-label="다음 계산기">
      <Card>
        <CardHeader>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">다음 단계</p>
          <h2 className="text-2xl font-semibold text-foreground">이어서 확인할 항목</h2>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {entries.map((entry) => (
              <Link key={entry.key} href={entry.href} className="group rounded-2xl border border-border p-5 transition hover:bg-secondary">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-semibold text-foreground">{entry.title}</h3>
                  {entry.type === "summary" ? (
                    <LayoutDashboard className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                  ) : (
                    <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition group-hover:translate-x-0.5" aria-hidden="true" />
                  )}
                </div>
                <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted-foreground">{entry.description}</p>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
