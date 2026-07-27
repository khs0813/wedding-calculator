import type { Metadata } from "next";
import { calculators } from "@/data/calculators";
import { guides } from "@/data/guides";
import type { CalculatorSlug, FAQItem, Guide, GuideSlug, RichSection } from "@/types/calculator";

const defaultOpenGraphImage = "/og-default.png";
const canonicalSiteUrl = "https://weddingbudget.co.kr";
const trailingSlashExcludedExactPaths = new Set([
  "/ads.txt",
  "/apple-touch-icon.png",
  "/favicon.ico",
  "/favicon.svg",
  "/manifest",
  "/manifest.json",
  "/manifest.webmanifest",
  "/robots.txt",
  "/rss.xml",
  "/service-worker",
  "/service-worker.js",
  "/sitemap.xml",
  "/sw",
  "/sw.js",
  "/workbox",
  "/workbox.js",
]);
const trailingSlashExcludedPrefixes = ["/api", "/_next", "/static", "/assets", "/images", "/fonts", "/.well-known"];
const fileExtensionPattern = /\/[^/]+\.[^/]+$/;

const calculatorSeoCopy: Partial<Record<CalculatorSlug, { title: string; description: string }>> = {
  "wedding-cost": {
    title: "결혼 비용 계산기 2026 | 하객 수·축의금·스드메 총예산 계산",
    description: "웨딩홀, 식대, 하객 수, 축의금, 스드메, 혼수, 예물, 신혼여행 비용을 개인정보 없이 입력하고 브라우저에만 저장하는 무료 결혼 예산 계산기입니다.",
  },
  "newlywed-home-budget": {
    title: "신혼집 예산 계산기 | 전세·월세·인테리어·대출 이자 계산",
    description: "전세보증금, 월세, 관리비, 인테리어, 가전·가구, 대출금리로 신혼집 초기 비용과 월 고정비를 참고용으로 계산합니다.",
  },
  "wedding-hall-cost": {
    title: "웨딩홀 비용 계산기 | 보증인원·식대·대관료 총액 계산",
    description: "보증 인원과 예상 하객 수 중 청구 기준을 반영해 식대, 대관료, 꽃장식, 부가세, 봉사료와 예상 순부담액을 계산합니다.",
  },
  "studio-dress-makeup-cost": {
    title: "스드메 비용 계산기 | 드레스·메이크업·촬영 추가금 계산",
    description: "스튜디오, 드레스, 메이크업 기본 패키지와 헬퍼비, 원본, 앨범, 액자, 출장비 등 스드메 추가금 비중을 계산합니다.",
  },
  "honsu-budget": {
    title: "혼수 비용 계산기 | 가전·가구·생활용품 예산표",
    description: "냉장고, 세탁기, 침대, 소파, 주방용품 등 신혼 혼수 비용을 카테고리별로 합산하고 목표 예산 초과 여부를 확인합니다.",
  },
  "wedding-gift-budget": {
    title: "결혼 예물 비용 계산기 | 반지·시계·가방·가족선물 예산",
    description: "결혼반지, 시계, 가방, 보석, 양가 선물, 한복 등 예물 비용을 항목별로 정리하고 전체 결혼 예산 대비 비중을 계산합니다.",
  },
  "honeymoon-budget": {
    title: "신혼여행 비용 계산기 | 항공·숙박·환전·쇼핑 총액",
    description: "항공권, 숙박, 교통, 식비, 액티비티, 쇼핑, 여행자보험, 환전 예산을 합산해 1인당 비용과 1일 평균 비용을 계산합니다.",
  },
  "congratulatory-money": {
    title: "축의금 금액 계산기 | 관계·친밀도·식대 기준 추천",
    description: "관계, 친밀도, 식사 참석, 동반 여부, 지역, 이전에 받은 금액을 바탕으로 강제성 없는 참고용 축의금 범위를 계산합니다.",
  },
};

const guideFaqsBySlug: Partial<Record<GuideSlug, FAQItem[]>> = {
  "wedding-cost-guide": [
    { question: "결혼 준비 비용은 어떤 항목부터 나눠야 하나요?", answer: "웨딩홀과 식대, 스드메, 예물·예단, 혼수, 신혼여행, 기타 비용으로 먼저 나누면 조정 가능한 항목이 빨리 보입니다." },
    { question: "축의금은 결혼 총예산에서 바로 빼도 되나요?", answer: "총비용과 축의금 예상 회수액은 따로 보는 편이 안전합니다. 실제 축의금은 참석률과 관계에 따라 달라질 수 있습니다." },
    { question: "결혼 예비비는 어느 정도 잡아야 하나요?", answer: "계약 전 항목이 많거나 옵션 변동이 크다면 전체 예산의 5~10%를 별도 예비비로 남겨두는 것이 현실적입니다." },
  ],
  "newlywed-budget-guide": [
    { question: "신혼집 예산은 집값 말고 무엇을 같이 봐야 하나요?", answer: "보증금이나 매매가 외에 대출 월상환액, 월세, 관리비, 이사비, 입주청소, 가전·가구, 생활용품을 함께 봐야 합니다." },
    { question: "초기 현금과 월 고정비를 왜 분리해야 하나요?", answer: "초기 현금은 입주 전후 한 번에 나가고 월 고정비는 매달 반복됩니다. 두 숫자를 섞으면 실제 부담 시점이 흐려집니다." },
    { question: "신혼집 대출은 얼마까지 받아도 될까요?", answer: "한도보다 월 상환 가능액이 중요합니다. 월세, 관리비, 생활비와 저축 계획까지 넣어 감당 가능한 범위를 확인해야 합니다." },
  ],
  "wedding-saving-tips": [
    { question: "결혼 비용은 어디서 줄이는 것이 가장 효과적인가요?", answer: "하객 수와 식대, 스드메 옵션, 혼수 선구매 범위처럼 총액에 직접 영향을 주는 항목부터 확인하는 편이 효과적입니다." },
    { question: "비용을 줄여도 만족도를 유지하려면 어떻게 해야 하나요?", answer: "사진, 식사, 여행처럼 커플에게 중요한 항목은 남기고 만족도 영향이 낮은 옵션부터 조정하는 방식이 좋습니다." },
    { question: "작은 비용도 예산표에 꼭 넣어야 하나요?", answer: "택배비, 추가 인쇄, 답례품, 가족 식사처럼 작은 비용이 반복되면 총액 초과가 생기기 쉬워 따로 기록하는 것이 좋습니다." },
  ],
  "wedding-hall-checklist": [
    { question: "웨딩홀 상담 전에 가장 먼저 정해야 할 숫자는 무엇인가요?", answer: "예상 하객 수와 보증 인원을 분리해 준비해야 합니다. 식대와 최소 청구액을 계산하는 기준이 달라지기 때문입니다." },
    { question: "웨딩홀 견적 비교에서 놓치기 쉬운 항목은 무엇인가요?", answer: "부가세, 봉사료, 꽃장식, 음향·조명, 혼주 메이크업, 주차 조건처럼 포함 여부가 홀마다 다른 항목을 확인해야 합니다." },
    { question: "보증 인원이 실제 하객보다 많으면 어떻게 되나요?", answer: "계약 조건에 따라 실제 참석자가 적어도 보증 인원 기준으로 식대가 청구될 수 있으므로 최소 부담액을 먼저 계산해야 합니다." },
  ],
  "sdme-options-guide": [
    { question: "스드메는 왜 기본가보다 실제 결제액이 커지나요?", answer: "원본 파일, 앨범 추가, 액자, 드레스 추가금, 헬퍼비, 출장비가 기본 패키지 밖에서 붙는 경우가 많기 때문입니다." },
    { question: "스드메 옵션 중 먼저 확인할 항목은 무엇인가요?", answer: "원본 포함 여부, 드레스 추가금 구간, 헬퍼비 지불 시점, 앨범 페이지 수를 상담 직후 확인하는 것이 좋습니다." },
    { question: "스드메 옵션은 전부 빼는 것이 좋나요?", answer: "전부 빼기보다 커플에게 중요한 결과물과 보관 목적을 기준으로 남길 옵션과 줄일 옵션을 나누는 편이 현실적입니다." },
  ],
  "wedding-gift-negotiation-guide": [
    { question: "예물·예단 예산은 어떻게 대화를 시작해야 하나요?", answer: "금액부터 정하기보다 반지, 시계, 양가 선물, 한복처럼 품목을 나누고 각 항목의 의미와 우선순위를 먼저 맞추는 것이 좋습니다." },
    { question: "예물을 간소화할 때 무엇을 기준으로 삼아야 하나요?", answer: "실용성, 상징성, 가족 기대치 중 무엇을 우선할지 합의하면 줄일 항목과 남길 항목을 정하기 쉽습니다." },
    { question: "예물 비용은 전체 결혼 예산과 같이 봐야 하나요?", answer: "예물만 따로 보면 체감이 달라질 수 있으므로 전체 결혼 예산 대비 비중을 함께 확인하는 편이 좋습니다." },
  ],
  "honsu-priority-guide": [
    { question: "혼수는 어떤 품목부터 사야 하나요?", answer: "냉장고, 세탁기, 침대처럼 입주 직후 생활에 필요한 품목을 먼저 정하고 선택 가전과 장식성 가구는 후순위로 둘 수 있습니다." },
    { question: "가구는 입주 전에 모두 사는 것이 좋나요?", answer: "집 크기와 동선을 실제로 확인한 뒤 사는 편이 실수를 줄입니다. 큰 가구는 실측과 설치 조건을 먼저 확인해야 합니다." },
    { question: "혼수 패키지 할인은 어떻게 판단해야 하나요?", answer: "할인율보다 실제 필요한 품목인지가 중요합니다. 계획에 없던 제품이 많으면 총액은 낮아 보여도 효율은 떨어질 수 있습니다." },
  ],
  "honeymoon-destination-budget-guide": [
    { question: "신혼여행지는 예산으로 먼저 정해야 하나요?", answer: "여행지보다 휴양형인지 관광형인지 목적을 먼저 정하면 숙소, 항공, 액티비티 예산의 우선순위가 분명해집니다." },
    { question: "허니문 예산에서 빠지기 쉬운 비용은 무엇인가요?", answer: "공항 이동, 수하물, 리조트 피, 여행자보험, 현지 교통, 환전 수수료처럼 예약가 밖의 비용이 빠지기 쉽습니다." },
    { question: "신혼여행 비용을 줄일 때 어디부터 조정하나요?", answer: "여행 만족도에 영향이 낮은 쇼핑, 유료 액티비티 수, 숙소 등급, 식사 구성부터 조정해 볼 수 있습니다." },
  ],
  "congratulatory-money-etiquette-guide": [
    { question: "축의금은 관계만 보고 정하면 되나요?", answer: "관계와 함께 친밀도, 식사 참석 여부, 동반자 여부, 최근 교류 정도를 같이 보는 편이 현실적입니다." },
    { question: "전에 받은 축의금은 그대로 돌려줘야 하나요?", answer: "상호성의 참고값으로 볼 수 있지만 현재 재정 상황과 관계 변화를 함께 고려해 무리하지 않는 범위에서 정하는 것이 좋습니다." },
    { question: "축의금 금액이 애매할 때 어떻게 판단하나요?", answer: "기본 관계 기준을 정한 뒤 식사 참석, 동반 참석, 가까운 사이 여부에 따라 상향 또는 하향 조정하면 부담이 줄어듭니다." },
  ],
  "wedding-budget-timeline-guide": [
    { question: "결혼 예산을 일정표와 같이 봐야 하는 이유는 무엇인가요?", answer: "계약일과 잔금일이 달라 큰 지출이 같은 달에 몰릴 수 있습니다. 총액뿐 아니라 결제 시점을 같이 봐야 합니다." },
    { question: "결혼식 직전에 현금이 부족해지는 이유는 무엇인가요?", answer: "웨딩홀 잔금, 스드메 추가금, 혼수 결제, 신혼여행 준비비가 결혼식 전후에 겹치는 경우가 많기 때문입니다." },
    { question: "아직 확정되지 않은 비용도 일정표에 넣어야 하나요?", answer: "발생 가능성이 높은 항목은 예상값으로 넣어두면 지출이 겹치는 달을 미리 확인할 수 있습니다." },
  ],
  "small-wedding-budget-guide": [
    { question: "스몰웨딩은 항상 비용이 더 적게 드나요?", answer: "하객 식대는 줄어도 대관료, 사진, 영상, 드레스, 연출비 같은 고정비는 크게 줄지 않을 수 있습니다." },
    { question: "소규모 예식에서 실제로 줄어드는 비용은 무엇인가요?", answer: "식사 규모, 답례품, 좌석 구성, 안내 인력처럼 하객 수에 따라 움직이는 변동비에서 절감이 생기기 쉽습니다." },
    { question: "스몰웨딩 예산을 잡을 때 먼저 정할 것은 무엇인가요?", answer: "목표가 비용 절감인지 친밀한 분위기인지 먼저 정해야 장소와 연출, 식사 기준을 일관되게 선택할 수 있습니다." },
  ],
  "newlywed-loan-planning-guide": [
    { question: "신혼집 대출은 한도보다 무엇을 먼저 봐야 하나요?", answer: "월 상환액을 먼저 봐야 합니다. 대출 한도가 충분해도 생활비와 저축 계획을 압박하면 유지하기 어렵습니다." },
    { question: "금리 변화는 신혼집 예산에 어떻게 반영하나요?", answer: "월 상환액이 오를 수 있는 경우를 가정해 여유자금을 두고, 월 고정비가 실수령액에서 차지하는 비중을 확인해야 합니다." },
    { question: "입주 후 지출은 대출 계획에 포함해야 하나요?", answer: "가전, 가구, 생활용품, 수리비가 입주 직후 생기므로 대출 원금만 보지 말고 초기 현금 흐름에 포함하는 것이 좋습니다." },
  ],
  "wedding-contract-check-guide": [
    { question: "결혼 준비 계약서에서 예산과 가장 관련 있는 부분은 무엇인가요?", answer: "포함 항목, 제외 항목, 추가금 조건, 일정 변경 수수료, 환불 조건이 실제 예산 변동과 직접 연결됩니다." },
    { question: "견적서에 없는 비용은 어떻게 확인하나요?", answer: "인원 증가, 시간 변경, 옵션 업그레이드, 촬영 장소 변경처럼 자주 생기는 상황을 계약 전에 질문해야 합니다." },
    { question: "환불 조건도 예산표에 넣어야 하나요?", answer: "당장 지출은 아니지만 일정 변경이나 취소 가능성이 있다면 리스크 비용으로 보고 조건을 확인하는 것이 좋습니다." },
  ],
  "wedding-guest-budget-table-guide": [
    { question: "하객 수가 늘면 식대 외에 어떤 비용이 같이 늘어나나요?", answer: "답례품, 음료, 주차, 좌석 배치, 안내 인력처럼 하객 수와 함께 움직이는 부대비용이 같이 늘어날 수 있습니다." },
    { question: "100명과 150명 예식의 예산 차이는 어디서 크게 생기나요?", answer: "가장 큰 차이는 식대 총액에서 생기고, 답례품과 부대비까지 더하면 체감 차이가 더 커질 수 있습니다." },
    { question: "보증 인원은 하객 수 예산표에 어떻게 반영하나요?", answer: "예상 하객 수와 보증 인원 중 실제 청구 기준이 되는 큰 숫자를 별도로 표시해야 최소 부담액을 확인할 수 있습니다." },
  ],
  "wedding-hall-meal-cost-table-guide": [
    { question: "식대 단가 1만 원 차이가 왜 크게 느껴지나요?", answer: "하객 수를 곱하면 100명 기준 100만 원, 200명 기준 200만 원 차이가 나고 세금·봉사료가 별도면 차이가 더 커집니다." },
    { question: "대관료가 낮은 홀과 식대가 낮은 홀은 어떻게 비교하나요?", answer: "예상 하객 수를 같은 숫자로 넣어 식대 총액과 대관료를 합산한 최종 비교액으로 봐야 합니다." },
    { question: "웨딩홀 식대표에서 꼭 확인할 조건은 무엇인가요?", answer: "보증 인원, 초과 인원 단가, 부가세와 봉사료 포함 여부, 음료와 주류 포함 여부를 함께 확인해야 합니다." },
  ],
  "sdme-extra-cost-table-guide": [
    { question: "스드메 추가금은 어떤 항목에서 많이 붙나요?", answer: "드레스 추가금, 원본 파일, 앨범과 액자 업그레이드, 헬퍼비, 출장비에서 추가금이 자주 발생합니다." },
    { question: "원본 구매비는 예산에 꼭 넣어야 하나요?", answer: "계약에 원본이 포함되지 않은 경우가 많으므로 사진 활용 계획이 있다면 별도 항목으로 넣어 비교하는 것이 좋습니다." },
    { question: "스드메 추가금 표는 언제 작성하면 좋나요?", answer: "상담 직후 기본 패키지와 옵션 견적이 기억날 때 작성해야 업체별 실제 결제액을 같은 기준으로 비교할 수 있습니다." },
  ],
  "newlywed-home-initial-cost-guide": [
    { question: "신혼집 초기비용은 보증금 외에 무엇을 포함하나요?", answer: "중개보수, 이사비, 입주청소, 커튼과 조명, 가전 설치비, 생활용품처럼 입주 전후에 나가는 비용을 포함해야 합니다." },
    { question: "입주 첫 달 예산이 부족해지는 이유는 무엇인가요?", answer: "집 관련 잔금과 이사, 청소, 설치, 생활용품 구매가 같은 시기에 몰리고 결혼식 잔금과 겹칠 수 있기 때문입니다." },
    { question: "입주 후에 사도 되는 품목은 어떻게 고르나요?", answer: "생활 시작에 꼭 필요한 품목만 먼저 사고, 소파나 소형가전처럼 실제 동선을 본 뒤 결정해도 되는 품목은 뒤로 미룰 수 있습니다." },
  ],
  "appliance-budget-table-guide": [
    { question: "혼수 가전 예산표는 필수와 선택을 어떻게 나누나요?", answer: "냉장고, 세탁기, 침대처럼 입주 직후 필요한 품목은 필수로 보고 TV, 건조기, 소형가전은 생활 패턴에 따라 선택할 수 있습니다." },
    { question: "가전 설치비도 예산에 넣어야 하나요?", answer: "빌트인 조건, 배관, 타공, 배송 조건에 따라 추가 비용이 생길 수 있으므로 제품가와 별도로 확인하는 것이 좋습니다." },
    { question: "가전 패키지 견적은 어떻게 비교하나요?", answer: "패키지 총액만 보지 말고 실제 필요한 품목과 후순위 품목이 섞여 있는지 확인한 뒤 같은 구성으로 비교해야 합니다." },
  ],
  "honeymoon-budget-ratio-guide": [
    { question: "신혼여행 예산 구성비는 무엇부터 정하나요?", answer: "휴양형인지 일정형인지 여행 목적을 정한 뒤 항공, 숙소, 식비, 이동, 액티비티, 쇼핑 비중을 나누는 것이 좋습니다." },
    { question: "항공과 숙소 비중이 너무 높으면 어떻게 조정하나요?", answer: "현지 지출과 비상금이 부족하지 않은지 확인하고, 숙박 일수나 숙소 등급, 항공 시간대를 조정해 볼 수 있습니다." },
    { question: "현지 지출은 어느 정도 따로 잡아야 하나요?", answer: "식비, 교통, 팁, 유심, 여행자보험, 소액 쇼핑처럼 반복되는 지출을 예약 비용과 별도로 잡아야 실제 총액에 가깝습니다." },
  ],
  "congratulatory-money-table-guide": [
    { question: "축의금 관계별 판단표는 금액표처럼 보면 되나요?", answer: "고정 금액표라기보다 관계, 친밀도, 식사 참석, 동반 참석 여부를 함께 정리하는 참고표로 보는 것이 좋습니다." },
    { question: "직장 동료와 친구의 축의금 기준은 왜 다른가요?", answer: "직장 동료는 조직 문화와 거리감이, 친구는 친밀도와 최근 교류가 더 크게 반영될 수 있기 때문입니다." },
    { question: "여러 결혼식이 겹칠 때 축의금은 어떻게 정하나요?", answer: "관계별 기본 기준을 미리 정해두고 가까운 사이, 식사 참석, 과거 상호성 같은 예외 조건만 조정하면 부담이 줄어듭니다." },
  ],
};

export function getSiteUrl(): string {
  return canonicalSiteUrl;
}

export function normalizeUrlPath(path: string): string {
  const trimmedPath = path.trim() || "/";
  const urlInput = /^\/\//.test(trimmedPath) ? `/${trimmedPath.replace(/^\/+/, "")}` : trimmedPath;

  try {
    const parsed = new URL(urlInput, `${canonicalSiteUrl}/`);
    return parsed.pathname.replace(/\/{2,}/g, "/") || "/";
  } catch {
    const pathname = urlInput.split(/[?#]/, 1)[0] || "/";
    const normalized = pathname.startsWith("/") ? pathname : `/${pathname}`;
    return normalized.replace(/\/{2,}/g, "/") || "/";
  }
}

export function usesTrailingSlash(path: string): boolean {
  const pathname = normalizeUrlPath(path);
  if (pathname === "/") return true;
  if (trailingSlashExcludedExactPaths.has(pathname)) return false;
  if (trailingSlashExcludedPrefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`))) return false;
  return !fileExtensionPattern.test(pathname);
}

export function absoluteUrl(path: string): string {
  return `${getSiteUrl()}${normalizeUrlPath(path)}`;
}

export function toPagePath(path: string): string {
  const pathname = normalizeUrlPath(path);
  if (!usesTrailingSlash(pathname)) return pathname;
  return pathname === "/" ? "/" : `${pathname.replace(/\/+$/, "")}/`;
}

export function absolutePageUrl(path: string): string {
  return `${getSiteUrl()}${toPagePath(path)}`;
}

export function buildBreadcrumbSchema(items: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absolutePageUrl(item.path),
    })),
  };
}

export function buildFaqSchema(items: FAQItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function createGuideFaqs(guide: Guide): FAQItem[] {
  if (guide.faqs?.length) {
    return guide.faqs;
  }

  return guideFaqsBySlug[guide.slug] || [
    {
      question: "이 가이드는 어떤 상황에서 읽으면 좋나요?",
      answer: guide.summary || guide.excerpt || guide.description,
    },
    {
      question: "예산표를 만들 때 가장 먼저 확인할 것은 무엇인가요?",
      answer: guide.sections[0]?.body[0] || guide.description,
    },
    {
      question: "계산기와 함께 쓰면 어떤 점이 좋나요?",
      answer: "가이드에서 확인한 기준을 계산기에 바로 입력하면 총액과 항목별 비중을 함께 확인할 수 있습니다.",
    },
  ];
}

export function createSectionFaqs(sections: RichSection[]): FAQItem[] {
  return sections.slice(0, 3).map((section) => ({
    question: `${section.heading}에서 핵심은 무엇인가요?`,
    answer: section.body[0] || section.bullets?.[0] || "",
  })).filter((item) => item.answer);
}

export function createCalculatorMetadata(slug: CalculatorSlug): Metadata {
  const calculator = calculators.find((item) => item.slug === slug);

  if (!calculator) {
    return {};
  }
  const seoCopy = calculatorSeoCopy[slug] || {
    title: calculator.title,
    description: calculator.description,
  };

  return {
    title: seoCopy.title,
    description: seoCopy.description,
    keywords: calculator.keywords,
    alternates: { canonical: absolutePageUrl(calculator.path) },
    openGraph: {
      title: seoCopy.title,
      description: seoCopy.description,
      url: absolutePageUrl(calculator.path),
      siteName: "웨딩 예산 계산기",
      locale: "ko_KR",
      type: "website",
      images: [
        {
          url: absoluteUrl(defaultOpenGraphImage),
          width: 1200,
          height: 630,
          alt: seoCopy.title
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title: seoCopy.title,
      description: seoCopy.description,
      images: [absoluteUrl(defaultOpenGraphImage)]
    },
    robots: {
      index: true,
      follow: true
    }
  };
}

export function createGuideMetadata(slug: GuideSlug): Metadata {
  const guide = guides.find((item) => item.slug === slug);

  if (!guide) {
    return {};
  }

  return {
    title: guide.title,
    description: guide.description,
    keywords: guide.keywords,
    alternates: { canonical: absolutePageUrl(guide.path) },
    openGraph: {
      title: guide.title,
      description: guide.description,
      url: absolutePageUrl(guide.path),
      siteName: "웨딩 예산 계산기",
      locale: "ko_KR",
      type: "article",
      publishedTime: guide.publishedAt,
      modifiedTime: guide.updatedAt,
      authors: [guide.author.name],
      images: [
        {
          url: absoluteUrl(defaultOpenGraphImage),
          width: 1200,
          height: 630,
          alt: guide.title
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title: guide.title,
      description: guide.description,
      images: [absoluteUrl(defaultOpenGraphImage)]
    },
    robots: {
      index: true,
      follow: true
    }
  };
}
