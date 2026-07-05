import type { Metadata } from "next";
import { SummaryResultsTableCard } from "@/components/calculators/AllResultsDashboard";
import { JsonLd } from "@/components/seo/JsonLd";
import { absolutePageUrl, absoluteUrl, buildBreadcrumbSchema } from "@/lib/seo";

export const metadata: Metadata = {
  title: "내 예산표 - 웨딩·신혼 계산기 결과 비교",
  description: "현재 브라우저에 저장된 결혼 비용, 신혼집, 웨딩홀, 스드메, 혼수, 예물, 신혼여행, 하객 축의금 참고 결과를 한 화면에서 비교합니다.",
  keywords: ["웨딩 예산 요약", "결혼 예산 통합", "신혼 예산표", "결혼 비용 한눈에", "웨딩 계산기 요약", "통합 예산 비교"],
  alternates: { canonical: absolutePageUrl("/summary") },
  openGraph: {
    title: "내 예산표 - 웨딩·신혼 계산기 결과 비교",
    description: "현재 브라우저에 저장된 각 계산기 결과를 비교하는 개인용 통합 화면입니다.",
    url: absolutePageUrl("/summary"),
    siteName: "웨딩 예산 계산기",
    locale: "ko_KR",
    type: "website",
    images: [
      {
        url: absoluteUrl("/og-default.png"),
        width: 1200,
        height: 630,
        alt: "웨딩 예산 계산기 통합 요약",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "내 예산표 - 웨딩·신혼 계산기 결과 비교",
    description: "결혼·신혼 예산 계산기 결과를 한 화면에서 비교하세요.",
    images: [absoluteUrl("/og-default.png")],
  },
  robots: "noindex,follow",
};

export default function SummaryPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "우리 예산표",
            applicationCategory: "FinanceApplication",
            operatingSystem: "Web",
            url: absolutePageUrl("/summary"),
            description: "입력값을 브라우저에만 저장하는 웨딩·신혼 계산기 결과를 한 화면에서 비교하는 무료 도구",
            inLanguage: "ko-KR",
            offers: { "@type": "Offer", price: "0", priceCurrency: "KRW" },
          },
          buildBreadcrumbSchema([
            { name: "홈", path: "/" },
            { name: "내 예산표", path: "/summary" },
          ]),
        ]}
      />

      <section className="mb-8 rounded-2xl border border-border bg-card p-6 shadow-sm md:p-10">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">내 예산표</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground md:text-5xl">내 예산표</h1>
        <p className="mt-5 max-w-4xl text-base leading-8 text-muted-foreground">
          현재 브라우저에 저장된 계산 결과를 모아 보는 예산표입니다. 개별 계산기를 먼저 입력한 뒤 전체 흐름을 비교하거나, 예산 초과가 어디에서 생기는지 둘이 같이 점검할 때 사용하세요.
        </p>
      </section>

      <SummaryResultsTableCard />
    </div>
  );
}
