import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2, HeartHandshake, Home, Landmark, Plane, Share2, ShieldCheck, Sparkles, WalletCards } from "lucide-react";
import { calculators } from "@/data/calculators";
import { guides } from "@/data/guides";
import { homeFaqs } from "@/data/faqs";
import { CalculatorCard } from "@/components/calculators/CalculatorCard";
import { FAQSection } from "@/components/seo/FAQSection";
import { JsonLd } from "@/components/seo/JsonLd";
import { Card, CardContent } from "@/components/ui/card";
import { absolutePageUrl, absoluteUrl, buildBreadcrumbSchema } from "@/lib/seo";

const homeDescription = "결혼 비용, 신혼집, 웨딩홀, 스드메, 혼수, 예물, 신혼여행 예산을 계산하는 무료 예산표입니다.";

export const metadata: Metadata = {
  title: "웨딩 예산 계산기 - 결혼 비용·신혼집·혼수 예산표",
  description: homeDescription,
  keywords: ["웨딩 예산 계산기", "결혼 비용 계산기", "신혼집 예산 계산기", "웨딩홀 식대 계산기", "스드메 비용", "혼수 비용", "결혼 예산표"],
  alternates: { canonical: "/" },
  openGraph: {
    title: "웨딩 예산 계산기 - 결혼 비용·신혼집·혼수 예산표",
    description: homeDescription,
    url: absolutePageUrl("/"),
    siteName: "웨딩 예산 계산기",
    locale: "ko_KR",
    type: "website",
    images: [
      {
        url: absoluteUrl("/og-default.png"),
        width: 1200,
        height: 630,
        alt: "웨딩 예산 계산기",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "웨딩 예산 계산기",
    description: "결혼·신혼 준비 비용을 계산하고 판단 기준까지 함께 읽으세요.",
    images: [absoluteUrl("/og-default.png")],
  },
  robots: { index: true, follow: true },
};

const featuredGuides = guides.slice(0, 6);
const trustSignals = [
  { label: "서버 저장 없음", description: "입력값은 현재 브라우저에 저장", icon: ShieldCheck },
  { label: "둘이 함께 보기", description: "공유 URL로 같은 예산표 확인", icon: Share2 },
  { label: "총액과 현금 흐름", description: "큰 비용과 월 고정비를 분리", icon: WalletCards },
];
const stageChoices = [
  {
    title: "전체 예산부터 잡고 싶어요",
    description: "웨딩홀, 스드메, 혼수, 여행까지 한 번에 큰 흐름을 봅니다.",
    href: "/calculators/wedding-cost",
    icon: Sparkles,
  },
  {
    title: "웨딩홀 상담을 앞두고 있어요",
    description: "보증 인원, 식대, 대관료 기준으로 상담 전 금액을 확인합니다.",
    href: "/calculators/wedding-hall-cost",
    icon: Landmark,
  },
  {
    title: "신혼집 비용이 가장 걱정돼요",
    description: "보증금, 대출, 월 고정비, 입주 비용을 분리해 봅니다.",
    href: "/calculators/newlywed-home-budget",
    icon: Home,
  },
  {
    title: "신혼여행 예산을 정해야 해요",
    description: "항공, 숙박, 현지 지출과 1일 평균 비용을 확인합니다.",
    href: "/calculators/honeymoon-budget",
    icon: Plane,
  },
];
const planningSteps = [
  ["1", "총액 상한", "결혼식, 신혼집, 여행까지 합친 최대 예산을 먼저 정합니다."],
  ["2", "큰 항목 분리", "웨딩홀 식대, 스드메 옵션, 혼수처럼 금액이 커지는 항목을 따로 봅니다."],
  ["3", "같은 표로 조정", "계산 결과를 내 예산표에 모아 두 사람이 같은 기준으로 줄일 항목을 정합니다."],
];

export default function HomePage() {
  return (
    <div>
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: "웨딩·신혼 예산 계산기와 가이드 목록",
            itemListElement: [
              ...calculators.map((calculator, index) => ({
                "@type": "ListItem",
                position: index + 1,
                name: calculator.title,
                url: absolutePageUrl(calculator.path),
              })),
              ...featuredGuides.map((guide, index) => ({
                "@type": "ListItem",
                position: calculators.length + index + 1,
                name: guide.title,
                url: absolutePageUrl(guide.path),
              })),
            ],
          },
          buildBreadcrumbSchema([{ name: "홈", path: "/" }]),
        ]}
      />

      <section className="bg-[radial-gradient(circle_at_top_left,_#eff6ff,_transparent_35%),linear-gradient(135deg,#f8fafc,#ffffff)]">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-16 md:py-24 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">결혼 예산 계산</p>
            <h1 className="mt-5 text-4xl font-bold leading-tight tracking-tight md:text-6xl">
              <span className="block whitespace-nowrap">우리 결혼 예산과</span>
              <span className="block whitespace-nowrap">신혼 준비 비용을 함께</span>
              <span className="block whitespace-nowrap">정리하세요.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
              결혼 비용, 신혼집 예산, 웨딩홀, 스드메, 혼수, 예물, 신혼여행, 축의금까지 한 흐름으로 계산하고 비교하세요.
            </p>
            <div className="mt-8 flex max-w-2xl flex-col gap-3 sm:flex-row">
              <Link
                href="/calculators/wedding-cost"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                계산 시작
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                href="/summary"
                className="inline-flex h-11 items-center justify-center rounded-xl border bg-background px-5 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                내 예산표 보기
              </Link>
            </div>
            <div className="mt-5 flex items-start gap-3 text-sm leading-6 text-muted-foreground">
              <HeartHandshake className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
              <p>둘이 같은 기준으로 입력하고, 공유 URL로 같은 예산표를 보며 조정할 수 있습니다.</p>
            </div>
          </div>
          <div className="rounded-2xl border bg-card p-5 shadow-sm md:p-6" aria-label="예산 정리 흐름">
            <div className="flex items-center justify-between gap-4 border-b pb-4">
              <div>
                <p className="text-sm font-semibold text-muted-foreground">예비부부용 예산표</p>
                <h2 className="mt-1 text-2xl font-bold tracking-tight">무엇부터 정리할까요?</h2>
              </div>
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
              </span>
            </div>
            <div className="mt-5 space-y-3">
              {planningSteps.map(([number, title, description]) => (
                <div key={title} className="grid grid-cols-[2.25rem_1fr] gap-3 rounded-xl border bg-background p-4">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary text-sm font-bold text-foreground">{number}</span>
                  <div>
                    <h3 className="font-semibold text-foreground">{title}</h3>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">{description}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {trustSignals.map((signal) => {
                const Icon = signal.icon;
                return (
                  <div key={signal.label} className="rounded-xl bg-secondary p-3">
                    <Icon className="h-5 w-5 text-foreground" aria-hidden="true" />
                    <p className="mt-2 text-sm font-semibold text-foreground">{signal.label}</p>
                    <p className="mt-1 text-xs leading-5 text-muted-foreground">{signal.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="mb-6">
          <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">상황별 시작</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight">지금 가장 급한 준비부터 시작하세요</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stageChoices.map((choice) => {
            const Icon = choice.icon;
            return (
              <Link key={choice.href} href={choice.href}>
                <Card className="h-full transition hover:-translate-y-1 hover:shadow-md">
                  <CardContent className="p-5">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-foreground">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <h3 className="mt-4 text-lg font-semibold">{choice.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-muted-foreground">{choice.description}</p>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      <section id="calculators" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-10">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">시작하기</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight">예산 계산기</h2>
          </div>
          <Link
            href="/summary"
            className="inline-flex h-11 items-center justify-center rounded-xl border bg-background px-5 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            내 예산표
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {calculators.map((calculator) => (
            <CalculatorCard key={calculator.slug} calculator={calculator} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="mb-6">
          <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">준비 흐름</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight">추천 예산 정리 순서</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            ["예산 상한 정하기", "먼저 결혼식과 신혼집을 포함한 전체 예산 상한을 정합니다."],
            ["항목별 비교하기", "웨딩홀, 스드메, 혼수, 여행처럼 견적이 커지는 항목을 분리합니다."],
            ["한 장으로 모으기", "계산한 결과를 내 예산표에서 모아 보고 함께 조정합니다."],
          ].map(([title, description]) => (
            <Card key={title} className="h-full">
              <CardContent className="p-6">
                <p className="text-sm text-muted-foreground">결혼 예산</p>
                <h3 className="mt-3 text-xl font-semibold">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="mb-6">
          <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">가이드</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight">예산 가이드와 체크리스트</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {featuredGuides.map((guide) => (
            <Card key={guide.slug} className="h-full">
              <CardContent className="flex h-full flex-col p-6">
                <p className="text-sm text-muted-foreground">수정일 {guide.updatedAt}</p>
                <h3 className="mt-3 text-xl font-semibold">
                  <Link href={guide.path} className="hover:underline">
                    {guide.title}
                  </Link>
                </h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{guide.excerpt}</p>
                <Link
                  href={guide.path}
                  className="mt-auto inline-flex h-11 w-fit items-center justify-center rounded-xl border bg-background px-5 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  가이드 보기
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10">
        <FAQSection items={homeFaqs} />
      </section>
    </div>
  );
}
