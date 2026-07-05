import Link from "next/link";
import { ArrowDown, HeartHandshake } from "lucide-react";
import type { CalculatorConfig } from "@/types/calculator";
import { CalculatorClient } from "@/components/calculators/CalculatorClient";
import { FAQSection } from "@/components/seo/FAQSection";
import { RelatedCalculators } from "@/components/seo/RelatedCalculators";
import { JsonLd } from "@/components/seo/JsonLd";
import { absolutePageUrl, absoluteUrl, buildBreadcrumbSchema, buildFaqSchema } from "@/lib/seo";
import { calculatorContent } from "@/data/calculatorContent";
import { guides } from "@/data/guides";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { SectionBlocks } from "@/components/content/SectionBlocks";
import { AuthorBox } from "@/components/content/AuthorBox";
import { AdBanner } from "@/components/monetization/AdBanner";

const conversationPrompts: Record<CalculatorConfig["slug"], string[]> = {
  "wedding-cost": ["총액 상한", "축의금 반영 범위", "양가 협의 항목"],
  "newlywed-home-budget": ["초기 현금", "월 고정비", "입주 후 여유자금"],
  "wedding-hall-cost": ["하객 수", "보증 인원", "식대 단가"],
  "studio-dress-makeup-cost": ["남길 결과물", "옵션 상한", "현장 추가금"],
  "honsu-budget": ["입주 즉시 필요", "나중 구매", "브랜드 우선순위"],
  "wedding-gift-budget": ["상징성", "양가 기대", "간소화 기준"],
  "honeymoon-budget": ["여행 목적", "숙소와 항공 비중", "현지 지출"],
  "congratulatory-money": ["관계 기준", "식사 참석", "상호성"],
};

export function CalculatorShell({ config }: { config: CalculatorConfig }) {
  const content = calculatorContent[config.slug];
  const relatedGuides = guides.filter((guide) => content.relatedGuideSlugs.includes(guide.slug));
  const prompts = conversationPrompts[config.slug];

  return (
    <div className="calculator-page mx-auto w-full max-w-6xl overflow-hidden px-4 py-10">
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
          {
            "@context": "https://schema.org",
            "@type": "Article",
            headline: config.title,
            description: config.description,
            url: absolutePageUrl(config.path),
            mainEntityOfPage: absolutePageUrl(config.path),
            inLanguage: "ko-KR",
            image: absoluteUrl("/og-default.png"),
            datePublished: content.updatedAt,
            dateModified: content.updatedAt,
            author: { "@type": "Organization", name: content.author.name },
            publisher: {
              "@type": "Organization",
              name: "웨딩 예산 계산기",
              logo: {
                "@type": "ImageObject",
                url: absoluteUrl("/apple-touch-icon.png"),
              },
            },
          },
          buildBreadcrumbSchema([
            { name: "홈", path: "/" },
            { name: "계산기", path: "/calculators" },
            { name: config.shortTitle, path: config.path },
          ]),
          buildFaqSchema(config.faqs),
        ]}
      />

      <section className="mb-8 grid gap-5 rounded-2xl border border-border bg-card p-5 shadow-sm md:p-9">
        <div className="max-w-5xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-muted-foreground">결혼 예산</p>
          <h1 className="mt-2.5 max-w-full text-[clamp(1.5rem,3.8vw,2.8rem)] font-semibold leading-tight tracking-tight text-foreground [overflow-wrap:anywhere]">{config.title}</h1>
          <p className="mt-4 text-lg leading-8 text-muted-foreground">{config.hero}</p>
          <div className="mt-5 flex flex-wrap items-center gap-3 text-xs font-bold text-muted-foreground">
            <span>작성: {content.author.name}</span>
            <span>최종 업데이트: {content.updatedAt}</span>
          </div>
          <div className="no-print mt-6 flex flex-wrap gap-3">
            <a href="#calculator" className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90">
              <ArrowDown className="h-4 w-4" aria-hidden="true" />
              바로 계산하기
            </a>
            <Link href="/methodology" className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-border bg-card px-5 py-2.5 text-sm font-semibold text-foreground transition hover:bg-secondary">
              계산 기준 보기
            </Link>
          </div>
        </div>
      </section>

      <section className="no-print mb-8 rounded-2xl border border-border bg-card p-5 shadow-sm md:p-6" aria-label="함께 정할 기준">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-secondary text-foreground">
                <HeartHandshake className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">함께 확인</p>
                <h2 className="text-xl font-semibold text-foreground">계산 전에 맞추면 좋은 기준</h2>
              </div>
            </div>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              이 계산기는 정답을 정해 주기보다 두 사람이 같은 기준으로 비용을 바라보게 돕는 도구입니다. 공유 URL로 상대와 같은 예산표를 볼 수 있습니다.
            </p>
          </div>
          <div className="grid gap-2 sm:grid-cols-3 lg:min-w-[34rem]">
            {prompts.map((prompt) => (
              <div key={prompt} className="rounded-2xl border border-border bg-secondary px-4 py-3 text-sm font-semibold text-foreground">
                {prompt}
              </div>
            ))}
          </div>
        </div>
      </section>

      <CalculatorClient config={config} />

      <div className="no-print mt-10 space-y-10">
        <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <Card className="p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">체크리스트</p>
            <h2 className="mt-2 text-2xl font-semibold text-foreground">입력 전 체크리스트</h2>
            <ul className="mt-5 space-y-3 text-sm leading-7 text-muted-foreground">
              {content.checklist.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-2 h-2.5 w-2.5 rounded-xl bg-primary" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Card>
          <Card className="p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">요약</p>
            <h2 className="mt-2 text-2xl font-semibold text-foreground">이 계산기 요약</h2>
            <p className="mt-4 text-sm leading-7 text-muted-foreground">{content.intro}</p>
            <p className="mt-4 text-sm leading-7 text-muted-foreground">관련 주제: {config.keywords.join(", ")}</p>
          </Card>
        </section>

        <Card className="p-6 md:p-8">
          <SectionBlocks sections={content.sections} />
        </Card>

        <AdBanner slot="content" pageKind="calculator" label="광고" />

        <AuthorBox author={content.author} updatedAt={content.updatedAt} />

        {relatedGuides.length ? (
          <Card>
            <CardHeader>
              <h2 className="text-2xl font-semibold text-foreground">함께 읽으면 좋은 가이드</h2>
              <p className="text-sm text-muted-foreground">계산 결과를 실제 의사결정으로 연결할 때 필요한 설명입니다.</p>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                {relatedGuides.map((guide) => (
                  <Link key={guide.slug} href={guide.path} className="rounded-2xl border border-border p-5 transition hover:border-border hover:bg-secondary">
                    <h3 className="font-semibold text-foreground">{guide.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{guide.excerpt}</p>
                    <span className="mt-4 inline-flex text-sm font-semibold text-foreground">가이드 읽기</span>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        ) : null}

        <FAQSection title={`${config.shortTitle} FAQ`} items={config.faqs} emitJsonLd={false} />
        <RelatedCalculators currentSlug={config.slug} relatedSlugs={config.relatedSlugs} />
      </div>
    </div>
  );
}
