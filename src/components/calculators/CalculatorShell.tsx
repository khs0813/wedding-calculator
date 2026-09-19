import Link from "next/link";
import { ArrowDown, HeartHandshake } from "lucide-react";
import type { CalculatorConfig } from "@/types/calculator";
import { CalculatorClient } from "@/components/calculators/CalculatorClient";
import { FAQSection } from "@/components/seo/FAQSection";
import { RelatedCalculators } from "@/components/seo/RelatedCalculators";
import { JsonLd } from "@/components/seo/JsonLd";
import { absolutePageUrl, buildBreadcrumbSchema, buildFaqSchema } from "@/lib/seo";
import { calculatorContent } from "@/data/calculatorContent";
import { guides } from "@/data/guides";
import { calculatorSeoSections, type CalculatorSeoTable } from "@/data/calculatorSeoContent";
import { getCalculatorSeoTarget } from "@/data/seoTargets";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { SectionBlocks } from "@/components/content/SectionBlocks";
import { AuthorBox } from "@/components/content/AuthorBox";
import { CoupangBanner } from "@/components/monetization/CoupangBanner";

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

const exampleResults: Record<CalculatorConfig["slug"], { scenario: string; result: string; note: string }> = {
  "wedding-cost": {
    scenario: "예상 하객 200명, 식대 7만 원, 웨딩홀 대관/패키지 300만 원, 스드메 300만 원, 혼수 1,200만 원, 신혼여행 600만 원을 입력하는 경우",
    result: "식대 1,400만 원을 포함해 주요 항목 합계는 약 3,500만 원입니다. 하객 1인당 예상 축의금을 5만 원으로 보면 예상 회수액은 1,000만 원입니다.",
    note: "예비비와 예물·청첩장·스냅 등 추가 항목 입력에 따라 실제 부담 예상 금액이 달라집니다.",
  },
  "newlywed-home-budget": {
    scenario: "전세보증금 2억 원, 대출금 1억 2천만 원, 월 관리비 20만 원, 가전·가구·이사 등 초기 비용 1,500만 원을 입력하는 경우",
    result: "초기 현금 필요액은 보증금에서 대출금을 뺀 8,000만 원에 초기 비용 1,500만 원을 더한 약 9,500만 원입니다.",
    note: "대출 월 상환액은 금리와 대출기간을 입력하면 월 고정 주거비에 함께 반영됩니다.",
  },
  "wedding-hall-cost": {
    scenario: "예상 하객 200명, 보증 인원 180명, 식대 7만 원, 대관료 300만 원, 꽃장식 100만 원을 입력하는 경우",
    result: "식대는 보증 인원과 예상 하객 수 중 큰 값인 200명을 기준으로 1,400만 원입니다. 대관료와 꽃장식을 더하면 웨딩홀 예상 비용은 약 1,800만 원입니다.",
    note: "부가세와 봉사료가 별도인 견적이면 최종 결제액은 더 커질 수 있습니다.",
  },
  "studio-dress-makeup-cost": {
    scenario: "스튜디오 120만 원, 드레스 150만 원, 메이크업 80만 원, 원본·앨범·헬퍼비 등 추가 옵션 100만 원을 입력하는 경우",
    result: "기본 패키지는 350만 원, 추가 옵션은 100만 원으로 스드메 예상 총액은 약 450만 원입니다.",
    note: "원본 파일, 드레스 추가금, 출장비는 계약 조건에 따라 별도 청구될 수 있습니다.",
  },
  "honsu-budget": {
    scenario: "냉장고 250만 원, 세탁기 180만 원, 침대 200만 원, 소파 150만 원, 주방·생활용품 100만 원을 입력하는 경우",
    result: "가전·가구·생활용품을 합친 혼수 예상 비용은 약 880만 원입니다.",
    note: "목표 예산을 입력하면 예산 초과 또는 잔여 금액을 함께 확인할 수 있습니다.",
  },
  "wedding-gift-budget": {
    scenario: "결혼반지 200만 원, 예물 시계 300만 원, 양가 선물 200만 원, 한복 100만 원을 입력하는 경우",
    result: "예물·가족 선물 예상 총액은 약 800만 원입니다.",
    note: "신랑 측·신부 측 예상 예산은 단순 참고 배분이며 실제 부담 방식은 양가 협의에 따라 달라집니다.",
  },
  "honeymoon-budget": {
    scenario: "항공 200만 원, 숙박 250만 원, 식비 100만 원, 액티비티 80만 원, 쇼핑 100만 원, 2명 5일 여행을 입력하는 경우",
    result: "신혼여행 예상 총액은 약 730만 원이고, 1인당 약 365만 원, 1일 평균 약 146만 원입니다.",
    note: "환전 예산과 현지 지출을 중복 입력하지 않도록 사용 목적을 나눠 입력하세요.",
  },
  "congratulatory-money": {
    scenario: "친한 친구, 친밀도 높음, 식사 참석, 동반자 없음, 수도권 기준으로 선택하는 경우",
    result: "관계와 참석 조건을 반영해 1만 원 단위로 반올림한 참고용 축의금 범위를 표시합니다.",
    note: "추천 금액은 강제 기준이 아니며 본인의 재정 상황과 관계를 함께 고려해야 합니다.",
  },
};

const featureBadges = ["브라우저 저장", "PDF 저장", "엑셀용 다운로드", "공유 링크"];

const actionLabels: Partial<Record<CalculatorConfig["slug"], string>> = {
  "wedding-cost": "결혼식 예산표 계산 시작",
  "honsu-budget": "혼수 예산 계산 시작",
  "studio-dress-makeup-cost": "스드메 견적 계산 시작",
  "wedding-hall-cost": "웨딩홀 보증인원 계산 시작",
  "newlywed-home-budget": "신혼집 이사 예산 계산 시작",
};

export function CalculatorShell({ config }: { config: CalculatorConfig }) {
  const content = calculatorContent[config.slug];
  const relatedGuides = guides.filter((guide) => content.relatedGuideSlugs.includes(guide.slug));
  const prompts = conversationPrompts[config.slug];
  const example = exampleResults[config.slug];
  const seo = getCalculatorSeoTarget(config.slug, {
    title: config.title,
    description: config.description,
    h1: config.title,
    ogImage: "/og-default.png",
  });
  const seoSections = calculatorSeoSections[config.slug] || [];
  const startLabel = actionLabels[config.slug] || `${config.shortTitle} 계산 시작`;

  return (
    <div className="calculator-page mx-auto w-full max-w-6xl overflow-hidden px-4 py-10">
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: seo.title,
            applicationCategory: "FinanceApplication",
            browserRequirements: "Requires JavaScript",
            operatingSystem: "Web",
            url: absolutePageUrl(config.path),
            description: seo.description,
            inLanguage: "ko-KR",
            offers: { "@type": "Offer", price: "0", priceCurrency: "KRW" },
            author: { "@type": "Organization", name: content.author.name },
            dateModified: content.updatedAt,
            isAccessibleForFree: true,
            featureList: config.fields.map((field) => field.label),
          },
          buildBreadcrumbSchema([
            { name: "홈", path: "/" },
            { name: "계산기", path: "/calculators/" },
            { name: seo.h1, path: config.path },
          ]),
          buildFaqSchema(config.faqs),
        ]}
      />

      <nav className="no-print mb-4 text-sm font-semibold text-muted-foreground" aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-2">
          <li><Link href="/" className="hover:text-foreground">홈</Link></li>
          <li aria-hidden="true">/</li>
          <li><Link href="/calculators/" className="hover:text-foreground">계산기</Link></li>
          <li aria-hidden="true">/</li>
          <li className="text-foreground" aria-current="page">{seo.h1}</li>
        </ol>
      </nav>

      <CoupangBanner className="mb-6" />

      <section className="mb-8 grid gap-5 rounded-2xl border border-border bg-card p-5 shadow-sm md:p-9">
        <div className="max-w-5xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-muted-foreground">결혼 예산</p>
          <h1 className="mt-2.5 max-w-full text-2xl font-semibold leading-tight tracking-tight text-foreground [overflow-wrap:anywhere] sm:text-3xl md:text-5xl">{seo.h1}</h1>
          <p className="mt-4 max-w-4xl text-lg leading-8 text-muted-foreground">{config.hero}</p>
          <p className="mt-3 max-w-4xl text-sm leading-7 text-muted-foreground">{seo.description}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {featureBadges.map((badge) => (
              <span key={badge} className="rounded-full border border-border bg-background px-3 py-1.5 text-xs font-bold text-foreground">
                {badge}
              </span>
            ))}
          </div>
          <div className="no-print mt-6 flex flex-wrap gap-3">
            <a href="#calculator" className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90">
              <ArrowDown className="h-4 w-4" aria-hidden="true" />
              {startLabel}
            </a>
            <Link href="/methodology/" className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-border bg-card px-5 py-2.5 text-sm font-semibold text-foreground transition hover:bg-secondary">
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
        <Card className="p-6 md:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">예시</p>
          <h2 className="mt-2 text-2xl font-semibold text-foreground">예시 예산표</h2>
          <div className="mt-4 space-y-3 text-sm leading-7 text-muted-foreground">
            <p>아래 내용은 입력과 이해를 돕기 위한 예시이며 실제 시장 평균이 아닙니다.</p>
            <p>{example.scenario}</p>
            <p className="rounded-2xl border border-border bg-muted p-4 font-semibold text-foreground">{example.result}</p>
            <p>{example.note}</p>
          </div>
        </Card>

        {seoSections.length ? <CalculatorSeoSections sections={seoSections} /> : null}

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
            <p className="mt-4 text-sm leading-7 text-muted-foreground">
              이 페이지는 {seo.h1} 검색 의도에 맞춰 입력 항목, 결과 표, PDF·엑셀·공유 기능을 한 화면에서 제공합니다.
            </p>
          </Card>
        </section>

        <Card className="p-6 md:p-8">
          <SectionBlocks sections={content.sections} />
        </Card>

        <Card className="p-6 md:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">계산 기준</p>
          <h2 className="mt-2 text-2xl font-semibold text-foreground">예상 비용 산정 기준</h2>
          <div className="mt-4 space-y-3 text-sm leading-7 text-muted-foreground">
            <p>입력값을 바탕으로 한 예상 비용이며, 실제 견적은 지역, 날짜, 업체, 계약 조건에 따라 달라질 수 있습니다.</p>
            <p>기본값과 예시 프리셋은 예산 계획을 돕기 위한 예시이며 실제 시장 평균을 보장하지 않습니다. 기준일은 이 페이지의 최종 업데이트일인 {content.updatedAt}입니다.</p>
            <p>정확한 비용은 계약 전 업체 견적서와 포함·제외 항목을 기준으로 확인하세요.</p>
          </div>
          <Link href="/methodology/" className="mt-5 inline-flex min-h-11 items-center rounded-xl border border-border bg-card px-5 py-2.5 text-sm font-semibold text-foreground transition hover:bg-secondary">
            계산 방법론 확인
          </Link>
        </Card>

        <FAQSection title={`${config.shortTitle} FAQ`} items={config.faqs} emitJsonLd={false} />

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
                    <span className="mt-4 inline-flex text-sm font-semibold text-foreground">{guide.title} 읽기</span>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        ) : null}

        <RelatedCalculators currentSlug={config.slug} relatedSlugs={config.relatedSlugs} />
      </div>
    </div>
  );
}

function CalculatorSeoSections({ sections }: { sections: NonNullable<(typeof calculatorSeoSections)[CalculatorConfig["slug"]]> }) {
  return (
    <div className="space-y-6">
      {sections.map((section) => (
        <section key={section.heading} className="rounded-2xl border border-border bg-card p-6 shadow-sm md:p-8">
          <h2 className="text-2xl font-semibold text-foreground">{section.heading}</h2>
          <div className="mt-4 space-y-3 text-sm leading-7 text-muted-foreground">
            {section.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          {section.table ? <SeoTable table={section.table} caption={section.heading} /> : null}
          {section.notes?.length ? (
            <ul className="mt-4 flex flex-wrap gap-2 text-xs text-muted-foreground">
              {section.notes.map((note) => (
                <li key={note} className="rounded-full bg-secondary px-3 py-1 font-bold">{note}</li>
              ))}
            </ul>
          ) : null}
        </section>
      ))}
    </div>
  );
}

function SeoTable({ table, caption }: { table: CalculatorSeoTable; caption: string }) {
  return (
    <div className="table-scroll mt-5 overflow-x-auto">
      <table className="w-full min-w-[640px] border-collapse text-sm">
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr className="border-b border-border text-left text-muted-foreground">
            {table.columns.map((column) => (
              <th key={column} scope="col" className="py-3 pr-3">{column}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((row) => (
            <tr key={row.join("|")} className="border-b border-border last:border-0">
              {row.map((cell, index) =>
                index === 0 ? (
                  <th key={`${cell}-${index}`} scope="row" className="py-3 pr-3 text-left font-bold text-foreground">
                    {cell}
                  </th>
                ) : (
                  <td key={`${cell}-${index}`} className="py-3 pr-3 text-muted-foreground">
                    {cell}
                  </td>
                ),
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
