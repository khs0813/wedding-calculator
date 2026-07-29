import type { CalculatorSlug } from "@/types/calculator";

export type SeoTarget = {
  title: string;
  description: string;
  h1: string;
  ogImage: string;
};

export const SEO_TARGETS = {
  "/": {
    title: "웨딩 예산 계산기 | 결혼식·스드메·혼수·신혼집 비용",
    description: "웨딩홀 식대·보증인원, 스드메, 혼수, 신혼집, 신혼여행 비용을 한 번에 계산하고 예산표로 저장·공유하세요.",
    h1: "결혼 준비 비용을 한 예산표에서 계산하세요",
    ogImage: "/og/home.png",
  },
  "/calculators/wedding-cost/": {
    title: "결혼식 예산표·결혼 비용 계산기 | 웨딩홀부터 혼수까지",
    description: "웨딩홀·식대·스드메·예물·혼수·신혼여행 비용을 정리하고 축의금 예상액을 반영한 실제 부담액을 계산하세요.",
    h1: "결혼식 예산표·결혼 비용 계산기",
    ogImage: "/og/wedding-cost.png",
  },
  "/calculators/honsu-budget/": {
    title: "혼수 예산표·비용 계산기 | 신혼 가전·가구 총액",
    description: "냉장고·세탁기·건조기·TV·에어컨·침대·소파 비용을 입력해 혼수 총액과 필수·선택 품목을 비교하세요.",
    h1: "혼수 예산표·신혼 가전·가구 비용 계산기",
    ogImage: "/og/honsu-budget.png",
  },
  "/calculators/studio-dress-makeup-cost/": {
    title: "스드메 예산표·견적 계산기 | 드레스·메이크업 추가금",
    description: "스튜디오·드레스·메이크업 기본가에 원본, 헬퍼비, 앨범·액자, 출장비를 더해 실제 스드메 비용을 계산하세요.",
    h1: "스드메 예산표·견적 계산기",
    ogImage: "/og/studio-dress-makeup-cost.png",
  },
  "/calculators/wedding-hall-cost/": {
    title: "웨딩홀 보증인원·식대 계산기 | 결혼식장 총비용",
    description: "보증 인원과 예상 하객 수, 식대, 대관료, 꽃장식, 부가세·봉사료를 반영해 최소 청구액과 순부담액을 확인하세요.",
    h1: "웨딩홀 보증인원·식대 계산기",
    ogImage: "/og/wedding-hall-cost.png",
  },
  "/calculators/newlywed-home-budget/": {
    title: "신혼집 예산표·이사 비용 계산기 | 대출·인테리어·가전",
    description: "보증금, 대출, 월세, 중개비, 이사·입주청소, 인테리어, 가전·가구를 나눠 초기 현금과 월 고정비를 계산하세요.",
    h1: "신혼집 예산표·이사 비용 계산기",
    ogImage: "/og/newlywed-home-budget.png",
  },
} as const satisfies Record<string, SeoTarget>;

const calculatorTargetBySlug: Partial<Record<CalculatorSlug, SeoTarget>> = {
  "wedding-cost": SEO_TARGETS["/calculators/wedding-cost/"],
  "honsu-budget": SEO_TARGETS["/calculators/honsu-budget/"],
  "studio-dress-makeup-cost": SEO_TARGETS["/calculators/studio-dress-makeup-cost/"],
  "wedding-hall-cost": SEO_TARGETS["/calculators/wedding-hall-cost/"],
  "newlywed-home-budget": SEO_TARGETS["/calculators/newlywed-home-budget/"],
};

export function getCalculatorSeoTarget(slug: CalculatorSlug, fallback: SeoTarget): SeoTarget {
  return calculatorTargetBySlug[slug] || fallback;
}
