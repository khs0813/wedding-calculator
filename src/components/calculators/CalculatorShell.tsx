import Link from "next/link";
import { LayoutDashboard } from "lucide-react";
import type { CalculatorConfig } from "@/types/calculator";
import { CalculatorClient } from "@/components/calculators/CalculatorClient";
import { FAQSection } from "@/components/seo/FAQSection";
import { RelatedCalculators } from "@/components/seo/RelatedCalculators";
import { JsonLd } from "@/components/seo/JsonLd";
import { absolutePageUrl, absoluteUrl, buildBreadcrumbSchema } from "@/lib/seo";
import { calculatorContent } from "@/data/calculatorContent";
import { guides } from "@/data/guides";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { SectionBlocks } from "@/components/content/SectionBlocks";
import { AuthorBox } from "@/components/content/AuthorBox";

export function CalculatorShell({ config }: { config: CalculatorConfig }) {
  const content = calculatorContent[config.slug];
  const relatedGuides = guides.filter((guide) => content.relatedGuideSlugs.includes(guide.slug));

  return (
    <div className="mx-auto max-w-[90rem] px-4 py-10">
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: config.title,
            applicationCategory: "FinanceApplication",
            browserRequirements: "Requires JavaScript",
            operatingSystem: "Web",
            url: absolutePageUrl(config.path),
            description: config.description,
            inLanguage: "ko-KR",
            offers: { "@type": "Offer", price: "0", priceCurrency: "KRW" },
            author: { "@type": "Organization", name: content.author.name },
            dateModified: content.updatedAt,
            isAccessibleForFree: true,
            featureList: config.fields.map((field) => field.label),
          },
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: config.title,
            description: config.description,
            url: absolutePageUrl(config.path),
            inLanguage: "ko-KR",
            dateModified: content.updatedAt,
            about: config.keywords,
            mainEntity: {
              "@type": "WebApplication",
              name: config.title,
              url: absolutePageUrl(config.path),
            },
          },
          buildBreadcrumbSchema([
            { name: "홈", path: "/" },
            { name: config.shortTitle, path: config.path },
          ]),
        ]}
      />

      <section className="mb-9 grid gap-5 rounded-4xl border border-blush-100 bg-white/80 p-5 shadow-soft md:p-9">
        <div className="max-w-5xl">
          <p className="text-sm font-black uppercase tracking-[0.25em] text-blush-700">Wedding Budget</p>
          <h1 className="mt-2.5 text-[clamp(1.5rem,3.8vw,2.8rem)] font-black tracking-tight text-slate-950">{config.title}</h1>
          <p className="mt-4 text-lg leading-8 text-slate-600">{config.hero}</p>
          <p className="mt-4 text-base leading-8 text-slate-600">{content.intro}</p>
          <p className="mt-4 text-sm leading-7 text-slate-600">
            관련 주제: {config.keywords.join(", ")}
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-3 text-xs font-bold text-slate-500">
            <span>작성: {content.author.name}</span>
            <span>최종 업데이트: {content.updatedAt}</span>
            <Link href="/methodology" className="text-blush-800 underline decoration-blush-200 underline-offset-4">계산 기준 보기</Link>
          </div>
          <div className="no-print mt-5">
            <Link href="/summary" className="inline-flex min-h-11 items-center gap-2 rounded-full border border-blush-200 bg-white px-5 py-2.5 text-sm font-black text-blush-800 transition hover:bg-blush-50">
              <LayoutDashboard className="h-4 w-4" aria-hidden="true" />
              모든 계산 결과 한눈에 보기
            </Link>
          </div>
        </div>
      </section>

      <section className="mb-10 grid gap-6 xl:grid-cols-[1.15fr_0.9fr_0.95fr]">
        <Card className="p-6">
          <SectionBlocks sections={content.sections.slice(0, 1)} />
        </Card>
        <Card className="p-6">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-blush-700">Summary</p>
          <h2 className="mt-2 text-2xl font-black text-slate-950">이 페이지 요약</h2>
          <p className="mt-4 text-sm leading-7 text-slate-600">{content.intro}</p>
          <ul className="mt-5 space-y-3 text-sm leading-7 text-slate-700">
            {content.sections.slice(0, 3).map((section) => (
              <li key={section.heading}>{section.heading}</li>
            ))}
          </ul>
        </Card>
        <Card className="bg-gradient-to-br from-blush-50 via-cream-50 to-sage-50 p-6">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-blush-700">Checklist</p>
          <h2 className="mt-2 text-2xl font-black text-slate-950">입력 전에 먼저 볼 항목</h2>
          <ul className="mt-5 space-y-3 text-sm leading-7 text-slate-700">
            {content.checklist.map((item) => (
              <li key={item} className="flex gap-3">
                <span className="mt-2 h-2.5 w-2.5 rounded-full bg-blush-500" aria-hidden="true" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </Card>
      </section>

      <CalculatorClient config={config} />

      <div className="no-print mt-10 space-y-10">
        <Card className="p-6 md:p-8">
          <SectionBlocks sections={content.sections.slice(1)} />
        </Card>

        <AuthorBox author={content.author} updatedAt={content.updatedAt} />

        {relatedGuides.length ? (
          <Card>
            <CardHeader>
              <h2 className="text-2xl font-black text-slate-950">함께 읽으면 좋은 가이드</h2>
              <p className="text-sm text-slate-500">계산 결과를 실제 의사결정으로 연결할 때 필요한 설명입니다.</p>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                {relatedGuides.map((guide) => (
                  <Link key={guide.slug} href={guide.path} className="rounded-3xl border border-blush-100 p-5 transition hover:border-blush-200 hover:bg-blush-50/60">
                    <h3 className="font-black text-slate-950">{guide.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{guide.excerpt}</p>
                    <span className="mt-4 inline-flex text-sm font-black text-blush-800">가이드 읽기</span>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        ) : null}

        <FAQSection title={`${config.shortTitle} FAQ`} items={config.faqs} />
        <RelatedCalculators currentSlug={config.slug} relatedSlugs={config.relatedSlugs} />
      </div>
    </div>
  );
}
