import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Home, Landmark, Plane, Sparkles } from "lucide-react";
import { calculators } from "@/data/calculators";
import { CalculatorCard } from "@/components/calculators/CalculatorCard";
import { Card, CardContent } from "@/components/ui/card";
import { JsonLd } from "@/components/seo/JsonLd";
import { absolutePageUrl, absoluteUrl, buildBreadcrumbSchema } from "@/lib/seo";

export const metadata: Metadata = {
  title: "결혼 예산 계산기 모음 - 웨딩홀·스드메·신혼집 비용",
  description: "예비 신랑·신부가 결혼 비용, 웨딩홀 식대, 신혼집 초기비용, 스드메 옵션, 혼수, 예물, 신혼여행, 축의금을 단계별로 계산할 수 있습니다.",
  keywords: ["결혼 예산 계산기", "웨딩홀 식대 계산기", "스드메 비용 계산기", "신혼집 초기비용", "혼수 예산 계산기"],
  alternates: { canonical: absolutePageUrl("/calculators") },
  openGraph: {
    title: "결혼 예산 계산기 모음",
    description: "결혼 비용, 웨딩홀 식대, 신혼집 초기비용, 스드메 옵션, 혼수, 예물, 신혼여행, 축의금 계산기를 한곳에서 선택하세요.",
    url: absolutePageUrl("/calculators"),
    siteName: "웨딩 예산 계산기",
    locale: "ko_KR",
    type: "website",
    images: [{ url: absoluteUrl("/og-default.png"), width: 1200, height: 630, alt: "결혼 예산 계산기 모음" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "결혼 예산 계산기 모음",
    description: "예비부부가 결혼 준비 단계별 비용을 계산하는 무료 도구 모음입니다.",
    images: [absoluteUrl("/og-default.png")],
  },
};

const stageChoices = [
  {
    title: "전체 예산을 먼저 잡기",
    description: "결혼식과 신혼 준비에 들어가는 큰 비용을 한 번에 정리합니다.",
    href: "/calculators/wedding-cost",
    icon: Sparkles,
  },
  {
    title: "웨딩홀 상담 전 확인",
    description: "보증 인원, 식대, 대관료 기준으로 상담 전 금액을 계산합니다.",
    href: "/calculators/wedding-hall-cost",
    icon: Landmark,
  },
  {
    title: "신혼집 예산 확인",
    description: "초기 현금, 대출, 월 고정비, 입주 비용을 분리해 봅니다.",
    href: "/calculators/newlywed-home-budget",
    icon: Home,
  },
  {
    title: "신혼여행 예산 정하기",
    description: "항공, 숙박, 현지 지출과 1일 평균 비용을 확인합니다.",
    href: "/calculators/honeymoon-budget",
    icon: Plane,
  },
];

export default function CalculatorsPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "예산 계산기 모음",
            description: "결혼과 신혼 준비 비용 계산기 목록",
            url: absolutePageUrl("/calculators"),
            inLanguage: "ko-KR",
          },
          buildBreadcrumbSchema([
            { name: "홈", path: "/" },
            { name: "계산기", path: "/calculators" },
          ]),
        ]}
      />

      <section className="rounded-2xl border bg-card p-6 shadow-sm md:p-10">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">시작하기</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight md:text-5xl">예산 계산기</h1>
        <p className="mt-5 max-w-3xl text-base leading-8 text-muted-foreground">
          지금 준비 단계에 맞는 계산기를 선택하세요. 모르는 항목은 비워도 계산을 시작할 수 있고, 결과는 내 예산표에서 함께 모아볼 수 있습니다.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/calculators/wedding-cost"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            대표 계산기 시작
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          <Link
            href="/summary"
            className="inline-flex h-11 items-center justify-center rounded-xl border bg-background px-5 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            내 예산표 보기
          </Link>
        </div>
      </section>

      <section className="mt-10">
        <div className="mb-6">
          <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">상황별 선택</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight">지금 필요한 계산기부터 고르세요</h2>
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

      <section className="mt-12">
        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">전체 목록</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight">모든 예산 계산기</h2>
          </div>
          <p className="max-w-2xl text-sm leading-7 text-muted-foreground">
            각 계산기는 현재 브라우저에 입력값을 저장합니다. 여러 계산기를 사용한 뒤 내 예산표에서 전체 흐름을 확인하세요.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {calculators.map((calculator) => (
            <CalculatorCard key={calculator.slug} calculator={calculator} />
          ))}
        </div>
      </section>
    </main>
  );
}
