import type { Metadata } from "next";
import { SummaryResultsTableCard } from "@/components/calculators/AllResultsDashboard";
import { JsonLd } from "@/components/seo/JsonLd";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "통합 예산 요약 - 웨딩·신혼 계산기 결과 비교",
  description: "현재 브라우저에 저장된 결혼 비용, 신혼집, 웨딩홀, 스드메, 혼수, 예물, 신혼여행, 축의금 계산 결과를 한 화면에서 비교합니다.",
  keywords: ["웨딩 예산 요약", "결혼 예산 통합", "신혼 예산표", "결혼 비용 한눈에", "웨딩 계산기 요약", "통합 예산 비교"],
  alternates: { canonical: "/summary" },
  openGraph: {
    title: "통합 예산 요약 - 웨딩·신혼 계산기 결과 비교",
    description: "현재 브라우저에 저장된 각 계산기 결과를 비교하는 개인용 통합 화면입니다.",
    url: absoluteUrl("/summary"),
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
    title: "통합 예산 요약 - 웨딩·신혼 계산기 결과 비교",
    description: "결혼·신혼 예산 계산기 결과를 한 화면에서 비교하세요.",
    images: [absoluteUrl("/og-default.png")],
  },
  robots: { index: false, follow: true },
};

export default function SummaryPage() {
  return (
    <div className="mx-auto max-w-[90rem] px-4 py-10">
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "웨딩·신혼 예산 통합 요약",
            applicationCategory: "FinanceApplication",
            operatingSystem: "Web",
            url: absoluteUrl("/summary"),
            description: "입력값을 브라우저에만 저장하는 웨딩·신혼 계산기 결과를 한 화면에서 비교하는 무료 도구",
            inLanguage: "ko-KR",
            offers: { "@type": "Offer", price: "0", priceCurrency: "KRW" },
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "홈", item: absoluteUrl("/") },
              { "@type": "ListItem", position: 2, name: "통합 예산 요약", item: absoluteUrl("/summary") },
            ],
          },
        ]}
      />

      <section className="mb-8 rounded-4xl border border-blush-100 bg-white/85 p-6 shadow-soft md:p-10">
        <p className="text-sm font-black uppercase tracking-[0.2em] text-blush-700">Personal Dashboard</p>
        <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-950 md:text-5xl">통합 예산 요약</h1>
        <p className="mt-5 max-w-4xl text-base leading-8 text-slate-600">
          이 화면은 검색 유입용 랜딩 페이지가 아니라 현재 브라우저에 저장된 계산 결과를 모아 보는 개인용 대시보드입니다. 개별 계산기를 먼저 입력한 뒤 전체 흐름을 비교하거나, 예산 초과가 어디에서 생기는지 빠르게 점검할 때 사용하는 용도로 설계했습니다.
        </p>
      </section>

      <SummaryResultsTableCard />
    </div>
  );
}
