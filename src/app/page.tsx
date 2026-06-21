import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, HeartHandshake, LayoutDashboard, ShieldCheck } from "lucide-react";
import { calculators } from "@/data/calculators";
import { guides } from "@/data/guides";
import { homeFaqs } from "@/data/faqs";
import { CalculatorCard } from "@/components/calculators/CalculatorCard";
import { FAQSection } from "@/components/seo/FAQSection";
import { JsonLd } from "@/components/seo/JsonLd";
import { Card } from "@/components/ui/card";
import { absolutePageUrl, absoluteUrl, buildBreadcrumbSchema } from "@/lib/seo";

export const metadata: Metadata = {
  title: "웨딩 예산 계산기 - 결혼·신혼 준비 비용 계산",
  description: "결혼 비용, 신혼집 예산, 웨딩홀, 스드메, 혼수, 예물, 신혼여행, 축의금을 DB 없이 브라우저에서 계산하고 예산 판단 기준까지 함께 읽을 수 있는 무료 도구입니다.",
  keywords: ["웨딩 예산 계산기", "결혼 비용 계산기", "신혼집 예산 계산기", "축의금 계산기", "스드메 비용", "혼수 비용", "결혼 예산표"],
  alternates: { canonical: "/" },
  openGraph: {
    title: "웨딩 예산 계산기 - 결혼·신혼 준비 비용 계산",
    description: "계산기와 예산 가이드를 함께 보며 결혼·신혼 준비 비용을 정리하세요.",
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

const coupleDecisionFlow = [
  {
    title: "둘이 감당할 상한",
    body: "먼저 총액이 아니라 결혼식 전후에 실제로 감당할 수 있는 현금과 월 고정비를 맞춥니다.",
  },
  {
    title: "가족과 협의할 항목",
    body: "예물, 예단, 하객 수, 웨딩홀 조건처럼 양가 기대가 섞이는 항목은 숫자와 메모를 분리합니다.",
  },
  {
    title: "줄여도 괜찮은 선택",
    body: "사진, 식사, 여행처럼 중요한 경험은 남기고 만족도 영향이 낮은 옵션부터 조정합니다.",
  },
];

const qualitySignals = [
  "계산기마다 예산 판단 기준과 체크리스트를 함께 제공",
  "가이드마다 작성일, 수정일, 작성·검토 정보를 표시",
  "문의, 소개, 편집 기준 페이지를 공개해 운영 주체를 명확히 안내",
  "입력값은 브라우저에만 저장하고 서버 DB에 전송하지 않음",
];

const scenarioExamples = [
  "결혼식 총액을 먼저 잡고 싶은 커플: 전체 결혼 비용 계산기 → 웨딩홀·스드메 세부 계산기 순서로 사용",
  "입주와 결혼식이 비슷한 시기에 몰린 커플: 신혼집 예산 계산기에서 초기 현금과 월 고정비를 먼저 분리",
  "예물·혼수에서 의견 차이가 있는 커플: 가이드 문서로 기준을 맞춘 뒤 계산기로 금액 조정",
];

const couplePrompts = [
  "절대 넘기고 싶지 않은 총액",
  "서로에게 가장 중요한 경험",
  "가족과 미리 이야기할 항목",
  "나중에 사도 되는 품목",
];

export default function HomePage() {
  return (
    <div className="mx-auto max-w-[90rem] px-4 py-10">
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "웨딩 예산 계산기",
            url: absolutePageUrl("/"),
            inLanguage: "ko-KR",
            description: "결혼 준비와 신혼집 준비 비용을 계산하고 예산 판단 기준을 읽을 수 있는 무료 도구",
          },
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
              ...guides.slice(0, 6).map((guide, index) => ({
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

      <section className="grid gap-8 rounded-4xl border border-blush-100 bg-white/85 p-6 shadow-soft md:p-10 lg:grid-cols-[1.12fr_0.88fr] lg:items-center">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full bg-blush-50 px-4 py-2 text-sm font-black text-blush-800">
            <HeartHandshake className="h-4 w-4" aria-hidden="true" />
            둘이 함께 정하는 결혼 예산
          </p>
          <h1 className="mt-6 text-4xl font-black tracking-tight text-slate-950 md:text-6xl">
            비용보다 먼저<br />기준을 맞추세요
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            결혼 예산은 숫자표이기 전에 두 사람의 우선순위입니다. 웨딩홀, 스드메, 혼수, 예물, 신혼여행, 신혼집까지 필요한 금액을 계산하고, 무엇을 남기고 무엇을 조정할지 함께 판단할 수 있게 구성했습니다.
          </p>
          <div className="mt-5 flex flex-wrap gap-3 text-sm font-black text-blush-800">
            <Link href="/about" className="underline decoration-blush-200 underline-offset-4">사이트 소개</Link>
            <Link href="/editorial-policy" className="underline decoration-blush-200 underline-offset-4">편집 기준</Link>
            <Link href="/contact" className="underline decoration-blush-200 underline-offset-4">문의</Link>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/calculators/wedding-cost" className="inline-flex min-h-12 items-center gap-2 rounded-full bg-blush-800 px-6 py-3 text-sm font-black text-white shadow-[0_10px_28px_rgba(18,46,89,0.18)] transition hover:bg-blush-700">
              결혼 비용 계산하기
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link href="/calculators/newlywed-home-budget" className="inline-flex min-h-12 items-center gap-2 rounded-full border border-blush-200 bg-white px-6 py-3 text-sm font-black text-blush-800 transition hover:bg-blush-50">
              신혼집 예산 계산하기
            </Link>
            <Link href="/guides/wedding-budget-timeline-guide" className="inline-flex min-h-12 items-center gap-2 rounded-full border border-blush-200 bg-white px-6 py-3 text-sm font-black text-blush-800 transition hover:bg-blush-50">
              예산 가이드 읽기
            </Link>
          </div>
        </div>
        <Card className="p-6">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-blush-700">First Conversation</p>
          <h2 className="mt-3 text-2xl font-black text-slate-950">처음부터 견적을 비교하지 않아도 됩니다</h2>
          <p className="mt-4 text-sm leading-7 text-slate-600">
            결혼 준비 초반에는 정확한 가격보다 서로의 기준을 먼저 확인하는 편이 좋습니다. 아래 네 가지가 맞으면 이후 견적 비교가 훨씬 차분해집니다.
          </p>
          <div className="mt-5 grid gap-2 sm:grid-cols-2">
            {couplePrompts.map((prompt) => (
              <div key={prompt} className="rounded-2xl border border-blush-100 bg-blush-50/70 px-4 py-3 text-sm font-black text-slate-800">
                {prompt}
              </div>
            ))}
          </div>
          <div className="mt-5 flex items-start gap-3 rounded-2xl bg-sage-50 p-4 text-sm leading-6 text-slate-700">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-sage-700" aria-hidden="true" />
            <p>입력값은 서버 DB가 아니라 현재 브라우저에만 저장됩니다.</p>
          </div>
        </Card>
      </section>

      <section className="mt-10 rounded-4xl border border-blush-100 bg-white p-6 shadow-soft md:p-8">
        <h2 className="text-2xl font-black text-slate-950">두 사람이 같이 볼 때 좋은 흐름</h2>
        <ul className="mt-5 space-y-3 text-sm leading-7 text-slate-600">
          {scenarioExamples.map((example) => (
            <li key={example}>{example}</li>
          ))}
        </ul>
      </section>

      <section className="mt-16 grid gap-6 lg:grid-cols-3">
        {coupleDecisionFlow.map((step, index) => (
          <Card key={step.title} className="p-6">
            <p className="text-sm font-black uppercase tracking-[0.2em] text-blush-700">Decision {index + 1}</p>
            <h2 className="mt-3 text-2xl font-black text-slate-950">{step.title}</h2>
            <p className="mt-4 text-sm leading-8 text-slate-600">{step.body}</p>
          </Card>
        ))}
      </section>

      <section id="calculators" className="mt-16">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.2em] text-blush-700">Calculators</p>
            <h2 className="mt-2 text-3xl font-black text-slate-950">상황별 예산 계산기</h2>
          </div>
          <p className="max-w-2xl text-sm leading-7 text-slate-600">전체 예산, 세부 항목, 신혼집 현금 흐름, 축의금 판단 범위를 각각 따로 계산할 수 있습니다. 각 계산기 페이지에는 입력 UI만 아니라 비용이 커지는 이유와 체크 포인트를 함께 정리했습니다.</p>
        </div>
        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
          {calculators.map((calculator) => (
            <CalculatorCard key={calculator.slug} calculator={calculator} />
          ))}
        </div>
      </section>

      <section className="mt-16 grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        <Card className="p-6 md:p-8">
          <h2 className="text-2xl font-black text-slate-950">예산을 판단하는 기준</h2>
          <div className="mt-5 space-y-4 text-sm leading-8 text-slate-600">
            <p>결혼 준비 평균 비용은 참고용일 뿐입니다. 실제 총액은 하객 수, 보증 인원, 스드메 옵션, 혼수 우선순위, 신혼집 대출 구조에 따라 크게 달라집니다.</p>
            <p>이 사이트는 평균값을 단정적으로 제시하기보다, 어떤 항목을 나눠 적어야 현실적인 예산표가 되는지에 초점을 맞춥니다. 특히 계약 후 늘기 쉬운 비용을 따로 보도록 설계했습니다.</p>
          </div>
        </Card>
        <Card className="p-6 md:p-8">
          <h2 className="text-2xl font-black text-slate-950">운영 신호</h2>
          <ul className="mt-5 space-y-3 text-sm leading-7 text-slate-600">
            {qualitySignals.map((signal) => (
              <li key={signal}>{signal}</li>
            ))}
          </ul>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/about" className="text-sm font-black text-blush-800 underline decoration-blush-200 underline-offset-4">사이트 소개</Link>
            <Link href="/editorial-policy" className="text-sm font-black text-blush-800 underline decoration-blush-200 underline-offset-4">편집 기준</Link>
          </div>
        </Card>
      </section>

      <section className="mt-16">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.2em] text-blush-700">Guides</p>
            <h2 className="mt-2 text-3xl font-black text-slate-950">예산 가이드 라이브러리</h2>
          </div>
          <p className="max-w-2xl text-sm leading-7 text-slate-600">가이드에는 발행일, 수정일, 작성자와 참고 자료를 함께 표시합니다. 계산 결과를 실제 의사결정으로 바꾸는 데 필요한 문서만 우선 확장하고 있습니다.</p>
        </div>
        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {guides.slice(0, 6).map((guide) => (
            <Card key={guide.slug} className="flex h-full flex-col p-6">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-blush-700">Guide</p>
              <h3 className="mt-2 text-xl font-black text-slate-950">{guide.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">{guide.excerpt}</p>
              <p className="mt-4 text-xs font-bold text-slate-500">업데이트: {guide.updatedAt}</p>
              <Link href={guide.path} className="mt-auto inline-flex items-center gap-2 pt-5 text-sm font-black text-blush-800">
                읽어보기
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Card>
          ))}
        </div>
      </section>

      <section className="mt-16">
        <FAQSection items={homeFaqs} />
      </section>

      <section className="mt-16 rounded-4xl border border-blush-100 bg-white p-6 shadow-soft md:p-10">
        <h2 className="text-2xl font-black text-slate-950">통합 요약 화면은 이렇게 쓰면 좋습니다</h2>
        <p className="mt-4 text-sm leading-8 text-slate-600">개별 계산기를 먼저 채운 뒤 통합 요약 화면에서 전체 흐름을 보는 방식이 가장 효율적입니다. 다만 통합 화면은 개인 브라우저 저장값을 읽는 도구라서, 검색 유입용 랜딩 페이지가 아니라 실제 사용 중인 방문자를 위한 기능으로 운영합니다.</p>
        <Link href="/summary" className="mt-6 inline-flex items-center gap-2 text-sm font-black text-blush-800">
          <LayoutDashboard className="h-4 w-4" aria-hidden="true" />
          통합 결과 보기
        </Link>
      </section>
    </div>
  );
}
