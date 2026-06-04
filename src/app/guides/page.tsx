import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { guides } from "@/data/guides";
import { absolutePageUrl, absoluteUrl, buildBreadcrumbSchema } from "@/lib/seo";
import { Card } from "@/components/ui/card";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "웨딩 예산 가이드 모음",
  description: "결혼 비용, 신혼집 예산, 웨딩홀, 스드메, 혼수, 신혼여행, 축의금 판단 기준을 정리한 가이드 모음입니다.",
  keywords: ["웨딩 가이드", "결혼 예산 가이드", "신혼집 예산 가이드", "웨딩홀 체크리스트", "스드메 옵션"],
  alternates: { canonical: "/guides" },
  openGraph: {
    title: "웨딩 예산 가이드 모음",
    description: "결혼·신혼 준비 예산을 실제 의사결정으로 연결하는 가이드 허브입니다.",
    url: absolutePageUrl("/guides"),
    siteName: "웨딩 예산 계산기",
    locale: "ko_KR",
    type: "website",
    images: [{ url: absoluteUrl("/og-default.png"), width: 1200, height: 630, alt: "웨딩 예산 가이드 모음" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "웨딩 예산 가이드 모음",
    description: "결혼·신혼 준비 예산 가이드를 한곳에서 읽으세요.",
    images: [absoluteUrl("/og-default.png")],
  },
};

const featuredGuides = guides.slice(0, 3);
const allGuides = guides;

export default function GuidesIndexPage() {
  return (
    <div className="mx-auto max-w-[90rem] px-4 py-10">
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "웨딩 예산 가이드 모음",
            description: "결혼·신혼 준비 예산 판단 기준을 모은 가이드 허브",
            url: absolutePageUrl("/guides"),
            inLanguage: "ko-KR",
          },
          {
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: "웨딩 예산 가이드 목록",
            itemListElement: guides.map((guide, index) => ({
              "@type": "ListItem",
              position: index + 1,
              name: guide.title,
              url: absolutePageUrl(guide.path),
            })),
          },
          buildBreadcrumbSchema([
            { name: "홈", path: "/" },
            { name: "가이드", path: "/guides" },
          ]),
        ]}
      />

      <section className="rounded-4xl border border-blush-100 bg-white/85 p-6 shadow-soft md:p-10">
        <p className="text-sm font-black uppercase tracking-[0.2em] text-blush-700">Guide Hub</p>
        <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-950 md:text-5xl">웨딩 예산 가이드 모음</h1>
        <p className="mt-5 max-w-5xl text-base leading-8 text-slate-600">계산기 결과만으로는 부족한 판단 기준을 문서로 정리한 허브입니다. 각 가이드는 발행일, 수정일, 작성자와 참고 자료를 포함하고, 실제 사용 예시를 함께 제공합니다.</p>
      </section>

      <section className="mt-10">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.2em] text-blush-700">Featured</p>
            <h2 className="mt-2 text-3xl font-black text-slate-950">먼저 읽으면 좋은 가이드</h2>
          </div>
          <p className="max-w-2xl text-sm leading-7 text-slate-600">전체 예산 구조, 신혼집 현금 흐름, 비용 절약 판단 기준처럼 대부분의 사용자에게 먼저 필요한 문서부터 상단에 배치했습니다.</p>
        </div>
        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          {featuredGuides.map((guide) => (
            <Card key={guide.slug} className="flex h-full flex-col p-6 md:p-7">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-blush-700">Featured Guide</p>
              <h2 className="mt-3 text-2xl font-black leading-tight text-slate-950">{guide.title}</h2>
              <p className="mt-4 text-sm leading-7 text-slate-600">{guide.description}</p>
              <div className="mt-5 space-y-1 text-xs font-bold text-slate-500">
                <p>작성: {guide.author.name}</p>
                <p>업데이트: {guide.updatedAt}</p>
              </div>
              <Link href={guide.path} className="mt-auto inline-flex items-center gap-2 pt-6 text-sm font-black text-blush-800">
                읽어보기
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Card>
          ))}
        </div>
      </section>

      <section className="mt-14">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.2em] text-blush-700">All Guides</p>
            <h2 className="mt-2 text-3xl font-black text-slate-950">전체 가이드</h2>
          </div>
          <p className="max-w-2xl text-sm leading-7 text-slate-600">계약, 예산, 체크리스트, 축의금, 신혼집, 허니문처럼 실제 준비 과정에서 자주 마주치는 주제를 중심으로 묶었습니다.</p>
        </div>
        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {allGuides.map((guide) => (
            <Card key={guide.slug} className="flex h-full flex-col p-5">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-blush-700">Guide</p>
              <h3 className="mt-2 text-lg font-black leading-snug text-slate-950">{guide.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">{guide.excerpt}</p>
              <div className="mt-4 space-y-1 text-xs font-bold text-slate-500">
                <p>작성: {guide.author.name}</p>
                <p>업데이트: {guide.updatedAt}</p>
              </div>
              <Link href={guide.path} className="mt-auto inline-flex items-center gap-2 pt-5 text-sm font-black text-blush-800">
                읽어보기
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
