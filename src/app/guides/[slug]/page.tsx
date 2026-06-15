import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { guides, getGuideBySlug } from "@/data/guides";
import { absolutePageUrl, absoluteUrl, buildBreadcrumbSchema, createGuideFaqs, createGuideMetadata } from "@/lib/seo";
import type { GuideSlug } from "@/types/calculator";
import { calculators } from "@/data/calculators";
import { Card } from "@/components/ui/card";
import { JsonLd } from "@/components/seo/JsonLd";
import { SectionBlocks } from "@/components/content/SectionBlocks";
import { AuthorBox } from "@/components/content/AuthorBox";
import { FAQSection } from "@/components/seo/FAQSection";
import { AdBanner } from "@/components/monetization/AdBanner";

const guideEnhancements: Partial<Record<GuideSlug, {
  scenarioTitle: string;
  scenarioRows: Array<{ label: string; low: string; middle: string; high: string; note: string }>;
  formulaTitle: string;
  formula: string;
  formulaNotes: string[];
  updatedReason: string;
}>> = {
  "wedding-cost-guide": {
    scenarioTitle: "하객 수별 결혼 예산 시나리오",
    scenarioRows: [
      { label: "웨딩홀 식대", low: "700만원", middle: "1,050만원", high: "1,400만원", note: "1인 7만원 가정" },
      { label: "스드메", low: "250만원", middle: "330만원", high: "450만원", note: "원본·앨범 옵션 포함 여부에 따라 변동" },
      { label: "본식 스냅/영상", low: "150만원", middle: "220만원", high: "300만원", note: "촬영 범위와 작가 구성에 따라 변동" },
    ],
    formulaTitle: "전체 결혼 비용 계산식",
    formula: "총 예상 비용 = 웨딩홀 고정비 + 식대 x 예상 하객 수 + 스드메 + 예물 + 혼수 + 신혼여행 + 기타 + 예비비",
    formulaNotes: ["축의금은 총비용에서 바로 빼기보다 예상 회수액으로 따로 표시합니다.", "예비비는 확정 전 항목이 많을수록 5~10% 범위에서 보수적으로 잡습니다."],
    updatedReason: "하객 수별 예산 예시와 축의금 차감 전후 구분을 보강했습니다.",
  },
  "newlywed-budget-guide": {
    scenarioTitle: "신혼집 초기 현금 시나리오",
    scenarioRows: [
      { label: "가전·가구", low: "600만원", middle: "1,000만원", high: "1,600만원", note: "필수 품목 우선 구매 기준" },
      { label: "이사·청소·설치", low: "120만원", middle: "220만원", high: "350만원", note: "이사 거리와 입주 상태에 따라 변동" },
      { label: "생활용품", low: "80만원", middle: "150만원", high: "250만원", note: "첫 3개월 추가 구매 포함" },
    ],
    formulaTitle: "신혼집 예산 계산식",
    formula: "초기 현금 필요액 = 보증금 또는 매매가 - 대출금 + 인테리어 + 가전 + 가구 + 이사 + 청소 + 생활용품",
    formulaNotes: ["월 고정비는 월세, 관리비, 대출 월상환액을 별도 합산합니다.", "초기 비용과 월 고정비를 한 표에 섞으면 실제 부담이 왜곡될 수 있습니다."],
    updatedReason: "초기 현금과 월 고정비를 분리하는 예산표 예시를 추가했습니다.",
  },
  "wedding-hall-checklist": {
    scenarioTitle: "보증 인원별 웨딩홀 비용 예시",
    scenarioRows: [
      { label: "식대 총액", low: "700만원", middle: "1,050만원", high: "1,400만원", note: "100명/150명/200명, 1인 7만원" },
      { label: "대관료·연출", low: "200만원", middle: "300만원", high: "400만원", note: "홀 조건에 따라 포함 항목 확인" },
      { label: "부가세·봉사료", low: "별도 확인", middle: "별도 확인", high: "별도 확인", note: "견적서 포함/별도 표기 확인" },
    ],
    formulaTitle: "웨딩홀 비용 계산식",
    formula: "웨딩홀 비용 = 식대 x 보증 인원 또는 실제 하객 수 중 큰 값 + 대관료 + 꽃장식 + 봉사료 + 부가세",
    formulaNotes: ["보증 인원보다 실제 하객이 적어도 보증 기준으로 청구될 수 있습니다.", "봉사료와 부가세는 포함 견적인지 별도 견적인지 계약서에서 확인합니다."],
    updatedReason: "보증 인원과 예상 하객 수를 분리해 보는 계산 예시를 추가했습니다.",
  },
  "sdme-options-guide": {
    scenarioTitle: "스드메 옵션 증가 시나리오",
    scenarioRows: [
      { label: "기본 패키지", low: "180만원", middle: "250만원", high: "350만원", note: "스튜디오·드레스·메이크업 기본 구성" },
      { label: "원본·앨범·액자", low: "40만원", middle: "100만원", high: "180만원", note: "구매 여부와 페이지 수에 따라 변동" },
      { label: "드레스·헬퍼·출장", low: "30만원", middle: "80만원", high: "150만원", note: "본식 조건에 따라 추가" },
    ],
    formulaTitle: "스드메 실제 결제액 계산식",
    formula: "스드메 총액 = 기본 패키지 + 원본 구매비 + 앨범 추가비 + 액자 추가비 + 드레스 추가금 + 헬퍼비 + 출장비",
    formulaNotes: ["상담 견적의 기본가와 실제 결제액 사이가 커지는 지점을 따로 기록합니다.", "옵션 비중이 30%를 넘으면 남길 옵션과 줄일 옵션을 다시 정합니다."],
    updatedReason: "기본 패키지와 추가 옵션을 분리한 실제 결제액 예시를 보강했습니다.",
  },
  "wedding-saving-tips": {
    scenarioTitle: "절약 우선순위별 예산 조정 예시",
    scenarioRows: [
      { label: "날짜·시간대 조정", low: "0원", middle: "100만원 절감", high: "300만원 절감", note: "비인기 시간대나 비수기 협의 가능성" },
      { label: "스드메 옵션 조정", low: "30만원 절감", middle: "100만원 절감", high: "200만원 절감", note: "앨범·액자·원본 구성 재검토" },
      { label: "혼수 분할 구매", low: "100만원 유예", middle: "300만원 유예", high: "600만원 유예", note: "입주 첫달 필수 품목만 선구매" },
    ],
    formulaTitle: "절약 효과 계산식",
    formula: "실제 절약액 = 조정 전 총예산 - 조정 후 총예산 - 만족도에 큰 영향을 주는 대체 비용",
    formulaNotes: ["무조건 삭제한 금액이 절약액은 아닙니다. 대체 구매나 추가 이동비가 생기면 함께 반영합니다.", "만족도가 높은 핵심 항목보다 옵션성 항목부터 줄이는 편이 실패 확률이 낮습니다."],
    updatedReason: "항목별 절약 시나리오와 실제 절약액 계산 관점을 추가했습니다.",
  },
};

function BudgetScenarioTable({ enhancement }: { enhancement: NonNullable<(typeof guideEnhancements)[GuideSlug]> }) {
  return (
    <section className="mt-10 rounded-4xl border border-blush-100 bg-white p-6 shadow-soft md:p-8">
      <h2 className="text-2xl font-black text-slate-950">{enhancement.scenarioTitle}</h2>
      <p className="mt-3 text-sm leading-7 text-slate-600">
        아래 숫자는 예시이며 실제 견적은 업체·지역·계약 조건에 따라 달라질 수 있습니다.
      </p>
      <div className="table-scroll mt-5 overflow-x-auto">
        <table className="w-full min-w-[620px] border-collapse text-sm">
          <caption className="sr-only">{enhancement.scenarioTitle}</caption>
          <thead>
            <tr className="border-b border-blush-100 text-left text-slate-500">
              <th scope="col" className="py-3 pr-3">항목</th>
              <th scope="col" className="py-3 pr-3">100명/낮음</th>
              <th scope="col" className="py-3 pr-3">150명/보통</th>
              <th scope="col" className="py-3 pr-3">200명/높음</th>
              <th scope="col" className="py-3">참고</th>
            </tr>
          </thead>
          <tbody>
            {enhancement.scenarioRows.map((row) => (
              <tr key={row.label} className="border-b border-blush-100/70 last:border-0">
                <th scope="row" className="py-3 pr-3 text-left font-bold text-slate-800">{row.label}</th>
                <td className="py-3 pr-3 text-slate-600">{row.low}</td>
                <td className="py-3 pr-3 text-slate-600">{row.middle}</td>
                <td className="py-3 pr-3 text-slate-600">{row.high}</td>
                <td className="py-3 text-slate-500">{row.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function CostBreakdownExample({ enhancement }: { enhancement: NonNullable<(typeof guideEnhancements)[GuideSlug]> }) {
  return (
    <section className="mt-10 rounded-4xl border border-blush-100 bg-blush-50/70 p-6 shadow-soft md:p-8">
      <h2 className="text-2xl font-black text-slate-950">{enhancement.formulaTitle}</h2>
      <p className="mt-4 rounded-2xl bg-white p-4 text-sm font-black leading-7 text-slate-800">{enhancement.formula}</p>
      <ul className="mt-5 space-y-3 text-sm leading-7 text-slate-600">
        {enhancement.formulaNotes.map((note) => (
          <li key={note} className="flex gap-3">
            <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-blush-500" aria-hidden="true" />
            <span>{note}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

type GuideTable = {
  title: string;
  columns: string[];
  rows: string[][];
  assumptions?: string[];
};

const guideTables: Partial<Record<GuideSlug, GuideTable[]>> = {
  "wedding-guest-budget-table-guide": [
    {
      title: "하객 수별 기본 예산표",
      columns: ["하객 수", "식대 단가", "식대 총액", "답례품/부대비", "예상 축의금 회수액", "순부담액"],
      assumptions: ["식대 단가: 70,000원", "축의금 회수액 가정: 1인 50,000원", "답례품/부대비는 예시값"],
      rows: [
        ["100명", "70,000원", "700만원", "150만원", "500만원", "350만원"],
        ["150명", "70,000원", "1,050만원", "220만원", "750만원", "520만원"],
        ["200명", "70,000원", "1,400만원", "300만원", "1,000만원", "700만원"],
      ],
    },
    {
      title: "식대 5만/7만/9만 원 시나리오",
      columns: ["하객 수", "5만원 식대", "7만원 식대", "9만원 식대", "7만원 대비 차이"],
      assumptions: ["식대 총액만 비교", "대관료, 부가세, 봉사료는 제외", "하객 수는 실제 청구 인원 기준"],
      rows: [
        ["100명", "500만원", "700만원", "900만원", "±200만원"],
        ["150명", "750만원", "1,050만원", "1,350만원", "±300만원"],
        ["200명", "1,000만원", "1,400만원", "1,800만원", "±400만원"],
      ],
    },
  ],
  "wedding-hall-meal-cost-table-guide": [
    {
      title: "식대 단가 x 하객 수 매트릭스",
      columns: ["식대 단가", "100명", "150명", "200명", "확인 포인트"],
      assumptions: ["식대 총액만 비교", "대관료, 꽃장식, 봉사료는 별도 확인", "보증 인원과 실제 하객 중 큰 값을 청구 기준으로 가정"],
      rows: [
        ["50,000원", "500만원", "750만원", "1,000만원", "대관료 별도 여부 확인"],
        ["70,000원", "700만원", "1,050만원", "1,400만원", "가장 흔한 비교 기준"],
        ["90,000원", "900만원", "1,350만원", "1,800만원", "봉사료 포함 여부 확인"],
      ],
    },
    {
      title: "보증 인원 미달/초과 시나리오",
      columns: ["조건", "보증 인원", "실제 하객", "청구 식대 기준", "예상 영향"],
      assumptions: ["보증 인원 미달 시 보증 인원 기준 청구 가정", "초과 인원은 실제 참석 인원 기준 청구 가정"],
      rows: [
        ["미달", "150명", "120명", "150명", "오지 않은 30명분도 부담 가능"],
        ["기준 일치", "150명", "150명", "150명", "견적과 실제가 가장 가까움"],
        ["초과", "150명", "180명", "180명", "초과 30명 식대 추가"],
      ],
    },
    {
      title: "부가세/봉사료 포함 여부 비교",
      columns: ["표기 방식", "기본 견적", "부가세 10%", "봉사료 3%", "최종 비교액"],
      assumptions: ["봉사료는 부가세 포함 후 금액 기준 예시", "실제 견적서의 산정 순서를 우선 확인"],
      rows: [
        ["모두 포함", "1,200만원", "포함", "포함", "1,200만원"],
        ["부가세 별도", "1,200만원", "120만원", "포함", "1,320만원"],
        ["둘 다 별도", "1,200만원", "120만원", "39.6만원", "1,359.6만원"],
      ],
    },
  ],
  "sdme-extra-cost-table-guide": [
    {
      title: "스드메 추가금 항목별 예시",
      columns: ["항목", "낮은 예산", "보통 예산", "높은 예산", "확인할 내용"],
      assumptions: ["지역, 업체, 촬영 일정에 따라 변동", "기본 패키지 포함 여부에 따라 실제 추가금은 달라질 수 있음"],
      rows: [
        ["드레스 추가금", "0~30만원", "50~100만원", "150만원 이상", "본식 드레스 등급"],
        ["원본 파일", "20만원", "40~70만원", "100만원 이상", "원본 포함 여부"],
        ["헬퍼비", "15만원", "20~30만원", "40만원 이상", "촬영/본식 각각 발생 여부"],
        ["앨범", "0~30만원", "50~100만원", "150만원 이상", "페이지와 권수"],
        ["액자", "0~20만원", "30~70만원", "100만원 이상", "크기와 소재"],
        ["출장비", "0원", "10~30만원", "50만원 이상", "지역과 이동 시간"],
      ],
    },
    {
      title: "필수/선택/상황별 분류표",
      columns: ["분류", "대표 항목", "판단 기준", "줄이는 방법"],
      assumptions: ["필수 여부는 커플의 촬영 목적과 계약 구성에 따라 달라질 수 있음"],
      rows: [
        ["필수", "기본 스튜디오·드레스·메이크업", "계약 패키지 핵심 구성", "구성 비교 후 패키지 조정"],
        ["선택", "앨범 추가, 액자, 보정 컷", "만족도와 보관 목적", "권수·크기·컷 수 축소"],
        ["상황별", "헬퍼비, 출장비, 얼리스타트", "장소·시간·이동 조건", "일정과 장소를 먼저 확정"],
      ],
    },
  ],
  "newlywed-home-initial-cost-guide": [
    {
      title: "보증금 외 초기비용 표",
      columns: ["항목", "낮은 예산", "보통 예산", "높은 예산", "메모"],
      assumptions: ["수도권 소형~중형 주거지 입주 예시", "보증금, 매매가, 대출금은 별도", "실제 중개보수는 거래 금액과 지역 조례를 확인"],
      rows: [
        ["중개보수", "30만원", "80만원", "150만원 이상", "거래 금액과 유형에 따라 변동"],
        ["이사비", "60만원", "120만원", "250만원 이상", "거리·짐 양·손 없는 날 영향"],
        ["입주청소", "25만원", "45만원", "80만원 이상", "평수와 오염도 확인"],
        ["커튼/조명", "50만원", "150만원", "300만원 이상", "창 개수와 설치 범위"],
        ["가전 설치비", "0~20만원", "30~70만원", "100만원 이상", "빌트인·배관·타공 여부"],
        ["생활용품", "50만원", "120만원", "250만원 이상", "첫 달 반복 구매 포함"],
      ],
    },
    {
      title: "입주 전후 지출 타임라인",
      columns: ["시점", "주요 지출", "예산 예시", "확인 포인트"],
      assumptions: ["입주일 기준 현금 지출 흐름 예시", "결혼식 잔금과 겹치는 달은 별도 여유자금 필요"],
      rows: [
        ["입주 2주 전", "중개보수, 이사 예약금", "100~250만원", "잔금일과 이사일 확정"],
        ["입주 1주 전", "입주청소, 커튼 실측", "50~200만원", "설치 가능 시간 확인"],
        ["입주 당일", "이사 잔금, 가전 설치비", "100~400만원", "엘리베이터·사다리차 조건"],
        ["입주 후 1개월", "생활용품, 추가 수납", "50~200만원", "실제 동선 확인 후 구매"],
      ],
    },
  ],
  "appliance-budget-table-guide": [
    {
      title: "가전 구매 우선순위 분류표",
      columns: ["분류", "품목", "구매 시점", "판단 기준"],
      assumptions: ["입주 직후 생활 필요도 기준", "집 구조와 기존 보유 제품에 따라 우선순위 변경 가능"],
      rows: [
        ["필수가전", "냉장고, 세탁기, 에어컨", "입주 전 또는 입주 직후", "생활 시작에 바로 필요"],
        ["선택가전", "건조기, TV, 식기세척기", "예산 여유 확인 후", "생활 패턴과 집 구조에 따라 결정"],
        ["나중 구매", "로봇청소기, 공기청정기, 소형가전", "입주 후 1~3개월", "실제 불편이 확인될 때 구매"],
      ],
    },
    {
      title: "500만/1000만/1500만 원 예산 시나리오",
      columns: ["예산", "구성 예시", "포함 품목", "미루는 품목"],
      assumptions: ["제품 브랜드와 용량은 예시", "배송·설치비는 별도 발생 가능", "패키지 할인은 실제 견적서 기준 확인"],
      rows: [
        ["500만원", "필수 생활형", "냉장고, 세탁기, 기본 청소기", "TV, 건조기, 식기세척기"],
        ["1,000만원", "균형형", "냉장고, 세탁기, 건조기, TV, 청소기", "프리미엄 소형가전"],
        ["1,500만원", "넉넉한 예산형", "대형가전 패키지, 식기세척기, 로봇청소기", "중복 기능 제품"],
      ],
    },
  ],
};

function GuideDataTables({ tables }: { tables: GuideTable[] }) {
  return (
    <div className="mt-10 space-y-6">
      {tables.map((table) => (
        <section key={table.title} className="rounded-4xl border border-blush-100 bg-white p-6 shadow-soft md:p-8">
          <h2 className="text-2xl font-black text-slate-950">{table.title}</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            아래 숫자는 예시이며 실제 견적은 업체·지역·계약 조건에 따라 달라질 수 있습니다.
          </p>
          <div className="table-scroll mt-5 overflow-x-auto">
            <table className="w-full min-w-[680px] border-collapse text-sm">
              <caption className="sr-only">{table.title}</caption>
              <thead>
                <tr className="border-b border-blush-100 text-left text-slate-500">
                  {table.columns.map((column) => (
                    <th key={column} scope="col" className="py-3 pr-3">{column}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {table.rows.map((row) => (
                  <tr key={row.join("|")} className="border-b border-blush-100/70 last:border-0">
                    {row.map((cell, index) =>
                      index === 0 ? (
                        <th key={`${cell}-${index}`} scope="row" className="py-3 pr-3 text-left font-bold text-slate-800">
                          {cell}
                        </th>
                      ) : (
                        <td key={`${cell}-${index}`} className="py-3 pr-3 text-slate-600">
                          {cell}
                        </td>
                      ),
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {table.assumptions?.length ? (
            <ul className="mt-4 flex flex-wrap gap-2 text-xs text-slate-500">
              {table.assumptions.map((assumption) => (
                <li key={assumption} className="rounded-full bg-blush-50 px-3 py-1 font-bold">
                  {assumption}
                </li>
              ))}
            </ul>
          ) : null}
        </section>
      ))}
    </div>
  );
}

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return guides.map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);
  if (!guide) return {};
  return createGuideMetadata(guide.slug as GuideSlug);
}

export default async function GuidePage({ params }: PageProps) {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);

  if (!guide) {
    notFound();
  }

  const faqs = createGuideFaqs(guide);
  const enhancement = guideEnhancements[guide.slug as GuideSlug];
  const tables = guideTables[guide.slug as GuideSlug] || [];

  return (
    <article className="mx-auto max-w-[90rem] px-4 py-10">
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "Article",
            headline: guide.title,
            description: guide.description,
            url: absolutePageUrl(guide.path),
            mainEntityOfPage: absolutePageUrl(guide.path),
            inLanguage: "ko-KR",
            image: absoluteUrl("/og-default.png"),
            datePublished: guide.publishedAt,
            dateModified: guide.updatedAt,
            author: { "@type": "Organization", name: guide.author.name },
            reviewedBy: guide.reviewedBy ? { "@type": "Organization", name: guide.reviewedBy.name } : undefined,
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
            { name: "가이드", path: "/guides" },
            { name: guide.title, path: guide.path },
          ]),
        ]}
      />
      <div className="rounded-4xl border border-blush-100 bg-white/85 p-6 shadow-soft md:p-10">
        <p className="text-sm font-black uppercase tracking-[0.25em] text-blush-700">Guide</p>
        <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-950 md:text-5xl">{guide.title}</h1>
        <p className="mt-5 text-lg leading-8 text-slate-600">{guide.description}</p>
        <p className="mt-5 text-sm leading-7 text-slate-600">
          관련 주제: {guide.keywords.join(", ")}
        </p>
        <div className="mt-6 grid gap-3 rounded-3xl border border-blush-100 bg-blush-50/60 p-4 text-sm text-slate-600 md:grid-cols-2">
          <p><span className="font-black text-slate-900">작성</span> {guide.author.name} · {guide.author.role}</p>
          <p><span className="font-black text-slate-900">발행</span> {guide.publishedAt}</p>
          <p><span className="font-black text-slate-900">검토</span> {guide.reviewedBy?.name || "편집팀"}</p>
          <p><span className="font-black text-slate-900">수정</span> {guide.updatedAt}</p>
        </div>
        <div className="mt-5 flex flex-wrap gap-3 text-sm font-black text-blush-800">
          <Link href="/guides" className="underline decoration-blush-200 underline-offset-4">가이드 전체 보기</Link>
          <Link href="/methodology" className="underline decoration-blush-200 underline-offset-4">계산 기준 보기</Link>
        </div>
      </div>

      <section className="mt-10 grid gap-6 lg:grid-cols-[1fr_0.9fr]">
        <div className="rounded-4xl border border-blush-100 bg-white p-6 shadow-soft md:p-8">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-blush-700">Summary</p>
          <h2 className="mt-2 text-2xl font-black text-slate-950">이 가이드 요약</h2>
          <p className="mt-4 text-sm leading-7 text-slate-600">{guide.summary || guide.excerpt}</p>
        </div>
        <div className="rounded-4xl border border-blush-100 bg-gradient-to-br from-blush-50 via-cream-50 to-sage-50 p-6 shadow-soft md:p-8">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-blush-700">Next Step</p>
          <h2 className="mt-2 text-2xl font-black text-slate-950">바로 이어서 할 일</h2>
          <ul className="mt-5 space-y-3 text-sm leading-7 text-slate-700">
            {guide.sections.slice(0, 3).map((section) => (
              <li key={section.heading}>{section.heading}</li>
            ))}
          </ul>
        </div>
      </section>

      <div className="mt-10 rounded-4xl border border-blush-100 bg-white p-6 shadow-soft md:p-10">
        <SectionBlocks sections={guide.sections} />
      </div>

      {tables.length ? <GuideDataTables tables={tables} /> : null}

      {enhancement ? (
        <>
          <BudgetScenarioTable enhancement={enhancement} />
          <AdBanner slot="content" pageKind="guide-article" label="광고" />
          <CostBreakdownExample enhancement={enhancement} />
        </>
      ) : null}

      <section className="mt-10">
        <AuthorBox author={guide.author} reviewer={guide.reviewedBy} updatedAt={guide.updatedAt} />
      </section>

      <section className="mt-10 rounded-4xl border border-blush-100 bg-white p-6 shadow-soft md:p-8">
        <h2 className="text-2xl font-black text-slate-950">수정 내역</h2>
        <p className="mt-4 text-sm leading-7 text-slate-600">
          최종 수정일: {guide.updatedAt}
          {enhancement ? ` · ${enhancement.updatedReason}` : " · 최신 계산기 구조와 내부 링크를 점검했습니다."}
        </p>
      </section>

      <section className="mt-10">
        <FAQSection title={`${guide.title} FAQ`} items={faqs} />
      </section>

      {guide.sources.length ? (
        <section className="mt-10 rounded-4xl border border-blush-100 bg-white p-6 shadow-soft md:p-10">
          <h2 className="text-2xl font-black text-slate-950">참고한 자료</h2>
          <ul className="mt-5 space-y-3 text-sm leading-7 text-slate-600">
            {guide.sources.map((source) => (
              <li key={source.href}>
                <a href={source.href} target="_blank" rel="noopener noreferrer" className="font-black text-slate-800 underline decoration-blush-200 underline-offset-4 hover:text-blush-800">
                  {source.label}
                </a>
                <span className="block text-xs text-slate-500">
                  {source.organization || "참고 기관"} · {source.href}
                </span>
                {source.reason ? <span className="block text-xs text-slate-500">참고 이유: {source.reason}</span> : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="mt-10">
        <h2 className="text-2xl font-black text-slate-950">바로 계산해보기</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {calculators.slice(0, 3).map((calculator) => (
            <Card key={calculator.slug} className="p-5">
              <h3 className="font-black text-slate-950">{calculator.shortTitle}</h3>
              <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">{calculator.description}</p>
              <Link href={calculator.path} className="mt-4 inline-flex items-center gap-2 text-sm font-black text-blush-800">
                계산하기
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Card>
          ))}
        </div>
      </section>
    </article>
  );
}
