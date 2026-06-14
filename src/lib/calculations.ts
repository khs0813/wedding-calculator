import type { BudgetItem, CalculatorResult, CalculatorSlug, FieldValue } from "@/types/calculator";
import { calculateMonthlyPayment, calculatePercentage, formatCurrency, formatNumber, roundToUnit, safeNumber } from "@/lib/calculator-utils";

type Values = Record<string, FieldValue>;

function n(values: Values, key: string): number {
  return safeNumber(values[key]);
}

function s(values: Values, key: string): string {
  return typeof values[key] === "string" ? String(values[key]) : "";
}

function b(values: Values, key: string): boolean {
  return Boolean(values[key]);
}

function item(id: string, label: string, amount: number, category: string, required?: boolean): BudgetItem {
  return { id, label, amount: safeNumber(amount), category, required };
}

function totalOf(items: BudgetItem[]): number {
  return items.reduce((sum, current) => sum + current.amount, 0);
}

function budgetComparison(total: number, budget: number): string {
  if (budget <= 0) return "목표 예산을 입력하면 초과/잔여 금액을 확인할 수 있습니다.";
  const diff = budget - total;
  if (diff >= 0) return `목표 예산보다 ${formatCurrency(diff)} 여유가 있습니다.`;
  return `목표 예산보다 ${formatCurrency(Math.abs(diff))} 초과했습니다.`;
}

export function calculateResult(slug: CalculatorSlug, values: Values): CalculatorResult {
  switch (slug) {
    case "wedding-cost":
      return calculateWeddingCost(values);
    case "newlywed-home-budget":
      return calculateNewlywedHome(values);
    case "wedding-hall-cost":
      return calculateWeddingHall(values);
    case "studio-dress-makeup-cost":
      return calculateSdme(values);
    case "honsu-budget":
      return calculateHonsu(values);
    case "wedding-gift-budget":
      return calculateWeddingGift(values);
    case "honeymoon-budget":
      return calculateHoneymoon(values);
    case "congratulatory-money":
      return calculateCongratulatoryMoney(values);
  }
}

function calculateWeddingCost(values: Values): CalculatorResult {
  const mealTotal = n(values, "mealPrice") * n(values, "guests");
  const items = [
    item("weddingHallBase", "웨딩홀 대관/패키지", n(values, "weddingHallBase"), "웨딩홀", true),
    item("mealTotal", "식대 총액", mealTotal, "웨딩홀", true),
    item("sdmeCost", "스드메", n(values, "sdmeCost"), "예식 준비", true),
    item("giftCost", "예물", n(values, "giftCost"), "예식 준비"),
    item("yedanCost", "예단", n(values, "yedanCost"), "예식 준비"),
    item("honsuCost", "혼수", n(values, "honsuCost"), "신혼 준비"),
    item("honeymoonCost", "신혼여행", n(values, "honeymoonCost"), "신혼 준비"),
    item("invitationCost", "청첩장", n(values, "invitationCost"), "기타"),
    item("snapVideoCost", "본식 스냅/영상", n(values, "snapVideoCost"), "기타"),
    item("extraCost", "사회자/축가/폐백 등 기타", n(values, "extraCost"), "기타")
  ];

  const subtotal = totalOf(items);
  const contingency = safeNumber(subtotal * n(values, "contingencyRate") / 100);
  const total = subtotal + contingency;
  const giftRecovery = n(values, "guests") * n(values, "averageGiftPerGuest");
  const netBurden = Math.max(0, total - giftRecovery);
  const guests = n(values, "guests");
  const guestUnitCost = guests > 0 ? safeNumber(total / guests) : 0;
  const targetBudget = n(values, "targetBudget");

  const resultItems = [...items, item("contingency", "예비비", contingency, "예비비")];

  return {
    primaryLabel: "결혼 준비 총 비용",
    total,
    items: resultItems,
    summary: [
      { label: "하객 1인당 예상 비용", value: guests > 0 ? formatCurrency(guestUnitCost) : "하객 수 입력 시 표시", description: "총액을 예상 하객 수로 나눈 값" },
      { label: "축의금 예상 회수액", value: formatCurrency(giftRecovery), description: "하객 수 × 1인당 예상 축의금" },
      { label: "실제 부담 예상 금액", value: formatCurrency(netBurden), description: "총액에서 예상 축의금을 차감" },
      { label: "예산 비교", value: budgetComparison(total, targetBudget) }
    ],
    advice: [
      "식대는 하객 수 변동에 가장 민감하므로 보증 인원과 실제 참석률을 보수적으로 잡아보세요.",
      "스드메, 스냅, 영상은 계약 후 옵션이 늘기 쉬우므로 원본·앨범·액자 포함 여부를 먼저 확인하세요.",
      "결혼 전체 예산은 한 번에 확정하기보다 계약 완료 항목과 예정 항목을 나누어 주기적으로 업데이트하는 것이 좋습니다."
    ]
  };
}

function calculateNewlywedHome(values: Values): CalculatorResult {
  const oneTimeItems = [
    item("homePrice", "전세보증금 또는 매매가", n(values, "homePrice"), "주거비", true),
    item("interiorCost", "인테리어", n(values, "interiorCost"), "초기 비용"),
    item("applianceCost", "가전 구매", n(values, "applianceCost"), "초기 비용", true),
    item("furnitureCost", "가구 구매", n(values, "furnitureCost"), "초기 비용", true),
    item("movingCost", "이사", n(values, "movingCost"), "초기 비용"),
    item("cleaningCost", "입주청소", n(values, "cleaningCost"), "초기 비용"),
    item("internetInstallCost", "인터넷/TV 설치", n(values, "internetInstallCost"), "초기 비용"),
    item("livingGoodsCost", "생활용품 초기 구매", n(values, "livingGoodsCost"), "초기 비용")
  ];

  const loan = calculateMonthlyPayment(n(values, "loanAmount"), n(values, "annualRate"), n(values, "loanYears"));
  const oneTimeTotal = totalOf(oneTimeItems);
  const nonHousingInitial = oneTimeTotal - n(values, "homePrice");
  const initialCash = Math.max(0, n(values, "homePrice") - n(values, "loanAmount")) + nonHousingInitial;
  const monthlyFixed = n(values, "monthlyRent") + n(values, "maintenanceFee") + loan.monthlyPayment;
  const annualHousing = monthlyFixed * 12;
  const recommendedReserve = safeNumber(Math.max(nonHousingInitial * 0.1, monthlyFixed * 2));

  return {
    primaryLabel: "신혼집 준비 총 비용",
    total: oneTimeTotal,
    items: oneTimeItems,
    summary: [
      { label: "초기 현금 필요액", value: formatCurrency(initialCash), description: "보증금/매매가에서 대출금을 차감하고 초기 비용을 더한 값" },
      { label: "월 고정 주거비", value: formatCurrency(monthlyFixed), description: "월세 + 관리비 + 대출 월상환액" },
      { label: "대출 월 상환액", value: formatCurrency(loan.monthlyPayment), description: `총이자 ${formatCurrency(loan.totalInterest)}` },
      { label: "연간 주거비", value: formatCurrency(annualHousing) },
      { label: "권장 여유자금", value: formatCurrency(recommendedReserve), description: "초기 비용 10% 또는 월 고정비 2개월 중 큰 값" }
    ],
    advice: [
      "전세보증금 또는 매매가는 큰 금액이므로 대출 가능액뿐 아니라 월 상환 가능액을 함께 확인하세요.",
      "입주청소, 커튼, 조명, 생활용품처럼 작은 비용이 누적되기 쉬우므로 초기 비용 항목을 따로 적어두는 것이 좋습니다.",
      "월 고정 주거비가 두 사람 합산 실수령액에서 차지하는 비중을 확인하면 생활비 계획을 세우기 쉽습니다."
    ]
  };
}

function calculateWeddingHall(values: Values): CalculatorResult {
  const chargedGuests = Math.max(n(values, "guaranteeGuests"), n(values, "expectedGuests"));
  const mealTotal = chargedGuests * n(values, "mealPrice");
  const baseWithoutTax = mealTotal + n(values, "rentalFee") + n(values, "floralFee") + n(values, "soundLightingFee") + n(values, "parentMakeupFee") + n(values, "snapExtraFee");
  const vat = b(values, "vatIncluded") ? 0 : safeNumber(baseWithoutTax * 0.1);
  const serviceFee = safeNumber((baseWithoutTax + vat) * n(values, "serviceRate") / 100);
  const total = baseWithoutTax + vat + serviceFee;
  const guaranteeMinimum = n(values, "guaranteeGuests") * n(values, "mealPrice") + n(values, "rentalFee") + n(values, "floralFee") + n(values, "soundLightingFee");
  const expectedGuests = n(values, "expectedGuests");
  const giftRecovery = expectedGuests * n(values, "averageGiftPerGuest");
  const net = Math.max(0, total - giftRecovery);

  return {
    primaryLabel: "웨딩홀 총 비용",
    total,
    items: [
      item("mealTotal", "식대 총액", mealTotal, "식대", true),
      item("rentalFee", "대관료", n(values, "rentalFee"), "기본 비용", true),
      item("floralFee", "꽃장식", n(values, "floralFee"), "기본 비용"),
      item("soundLightingFee", "음향/조명", n(values, "soundLightingFee"), "기본 비용"),
      item("parentMakeupFee", "혼주 메이크업", n(values, "parentMakeupFee"), "추가 비용"),
      item("snapExtraFee", "원판/스냅 추가", n(values, "snapExtraFee"), "추가 비용"),
      item("vat", "부가세", vat, "세금/봉사료"),
      item("serviceFee", "봉사료", serviceFee, "세금/봉사료")
    ],
    summary: [
      { label: "식대 총액", value: chargedGuests > 0 ? formatCurrency(mealTotal) : "인원 입력 시 표시", description: `${formatNumber(chargedGuests, "명")} 기준` },
      { label: "보증 인원 기준 최소 비용", value: formatCurrency(guaranteeMinimum) },
      { label: "부가세/봉사료 포함 총액", value: formatCurrency(total) },
      { label: "축의금 비교 순부담액", value: formatCurrency(net), description: `예상 회수액 ${formatCurrency(giftRecovery)}` }
    ],
    advice: [
      "보증 인원은 낮게 잡을수록 안전하지만, 인기 시간대나 홀에 따라 최소 보증 조건이 달라질 수 있습니다.",
      "견적서에서 부가세와 봉사료가 포함인지 별도인지 반드시 확인하세요.",
      "식대 단가가 조금만 올라가도 총액 차이가 커지므로 같은 조건으로 여러 견적을 비교해보세요."
    ]
  };
}

function calculateSdme(values: Values): CalculatorResult {
  const basePackage = n(values, "studioCost") + n(values, "dressCost") + n(values, "makeupCost");
  const optionItems = [
    item("ceremonyDressExtra", "본식 드레스 추가", n(values, "ceremonyDressExtra"), "추가 옵션"),
    item("tuxedoCost", "턱시도", n(values, "tuxedoCost"), "추가 옵션"),
    item("helperFee", "헬퍼비", n(values, "helperFee"), "추가 옵션"),
    item("rawFileFee", "원본 구매", n(values, "rawFileFee"), "추가 옵션"),
    item("albumExtraFee", "앨범 추가", n(values, "albumExtraFee"), "추가 옵션"),
    item("frameExtraFee", "액자 추가", n(values, "frameExtraFee"), "추가 옵션"),
    item("travelFee", "출장비", n(values, "travelFee"), "추가 옵션"),
    item("etcOptionFee", "기타 옵션", n(values, "etcOptionFee"), "추가 옵션")
  ];
  const optionsTotal = totalOf(optionItems);
  const total = basePackage + optionsTotal;
  const optionRatio = calculatePercentage(optionsTotal, total);

  return {
    primaryLabel: "스드메 총 비용",
    total,
    items: [
      item("studioCost", "스튜디오 촬영", n(values, "studioCost"), "기본 패키지", true),
      item("dressCost", "드레스 대여", n(values, "dressCost"), "기본 패키지", true),
      item("makeupCost", "메이크업", n(values, "makeupCost"), "기본 패키지", true),
      ...optionItems
    ],
    summary: [
      { label: "기본 패키지 비용", value: formatCurrency(basePackage) },
      { label: "추가 옵션 비용", value: formatCurrency(optionsTotal) },
      { label: "옵션 비중", value: `${optionRatio}%`, description: "전체 스드메 비용 중 옵션이 차지하는 비중" },
      { label: "절약 우선순위", value: optionsTotal > basePackage * 0.35 ? "옵션 조정 필요" : "옵션 비중 안정적" }
    ],
    advice: [
      "원본 파일과 앨범 페이지 수가 패키지에 포함되어 있는지 먼저 확인하세요.",
      "드레스 추가금, 헬퍼비, 출장비는 현장에서 늘어나기 쉬운 항목이므로 별도로 적어두는 것이 좋습니다.",
      "옵션 비중이 높다면 액자·앨범·보정 컷 수를 조정해 예산을 줄일 수 있습니다."
    ]
  };
}

function calculateHonsu(values: Values): CalculatorResult {
  const items = [
    item("fridge", "냉장고", n(values, "fridge"), "가전", true),
    item("washer", "세탁기", n(values, "washer"), "가전", true),
    item("dryer", "건조기", n(values, "dryer"), "가전"),
    item("tv", "TV", n(values, "tv"), "가전"),
    item("aircon", "에어컨", n(values, "aircon"), "가전"),
    item("vacuum", "청소기", n(values, "vacuum"), "가전"),
    item("bed", "침대", n(values, "bed"), "가구", true),
    item("sofa", "소파", n(values, "sofa"), "가구"),
    item("diningTable", "식탁", n(values, "diningTable"), "가구"),
    item("closet", "옷장", n(values, "closet"), "가구"),
    item("curtain", "커튼/블라인드", n(values, "curtain"), "가구"),
    item("kitchenware", "주방용품", n(values, "kitchenware"), "생활용품"),
    item("smallAppliances", "생활가전", n(values, "smallAppliances"), "생활용품"),
    item("etc", "기타", n(values, "etc"), "생활용품")
  ];
  const total = totalOf(items);
  const applianceTotal = totalOf(items.filter((entry) => entry.category === "가전"));
  const furnitureTotal = totalOf(items.filter((entry) => entry.category === "가구"));
  const lifestyleTotal = totalOf(items.filter((entry) => entry.category === "생활용품"));
  const requiredTotal = totalOf(items.filter((entry) => entry.required));
  const targetBudget = n(values, "targetBudget");

  return {
    primaryLabel: "혼수 총 비용",
    total,
    items,
    summary: [
      { label: "가전 총 비용", value: formatCurrency(applianceTotal) },
      { label: "가구 총 비용", value: formatCurrency(furnitureTotal) },
      { label: "생활용품 총 비용", value: formatCurrency(lifestyleTotal) },
      { label: "필수 항목 비용", value: formatCurrency(requiredTotal), description: "냉장고, 세탁기, 침대 등 필수 품목 기준" },
      { label: "예산 초과 여부", value: budgetComparison(total, targetBudget) }
    ],
    advice: [
      "입주 첫 달에 꼭 필요한 품목과 나중에 사도 되는 품목을 분리하면 초기 현금 부담을 줄일 수 있습니다.",
      "가전은 패키지 구매 할인과 설치 조건을 함께 비교하고, 가구는 집 크기에 맞춰 우선순위를 정하세요.",
      "생활용품과 주방용품은 작은 금액이 누적되므로 별도 항목으로 관리하는 것이 좋습니다."
    ]
  };
}

function calculateWeddingGift(values: Values): CalculatorResult {
  const items = [
    item("rings", "결혼반지", n(values, "rings"), "예물", true),
    item("watch", "예물 시계", n(values, "watch"), "예물"),
    item("bag", "예물 가방", n(values, "bag"), "예물"),
    item("jewelry", "예물 보석", n(values, "jewelry"), "예물"),
    item("familyGift", "양가 선물", n(values, "familyGift"), "가족 선물"),
    item("hanbok", "한복", n(values, "hanbok"), "가족 선물"),
    item("etc", "기타 예물", n(values, "etc"), "기타")
  ];
  const total = totalOf(items);
  const groomEstimate = roundToUnit(n(values, "rings") / 2 + n(values, "watch") + n(values, "familyGift") / 2 + n(values, "hanbok") / 2 + n(values, "etc") / 2, 10000);
  const brideEstimate = Math.max(0, total - groomEstimate);
  const weddingBudget = n(values, "totalWeddingBudget");
  const ratio = weddingBudget > 0 ? calculatePercentage(total, weddingBudget) : 0;

  return {
    primaryLabel: "예물 총 예산",
    total,
    items,
    summary: [
      { label: "신랑 측 예상 예산", value: formatCurrency(groomEstimate), description: "반지·가족 선물 일부와 시계 중심의 참고 배분" },
      { label: "신부 측 예상 예산", value: formatCurrency(brideEstimate), description: "총액에서 신랑 측 참고 배분을 제외한 값" },
      { label: "양가 선물 비용", value: formatCurrency(n(values, "familyGift")) },
      { label: "전체 결혼 예산 대비 비중", value: weddingBudget > 0 ? `${ratio}%` : "전체 예산을 입력하면 표시됩니다." }
    ],
    advice: [
      "예물은 정답보다 합의가 중요한 항목이므로 양가 기대치를 먼저 확인해보세요.",
      "결혼반지처럼 오래 사용하는 항목과 가방·시계처럼 선택적인 항목을 나누면 예산 조정이 쉽습니다.",
      "전체 결혼 예산 대비 예물 비중이 높다면 스드메, 신혼여행, 신혼집 예산과 함께 균형을 맞춰보세요."
    ],
    disclaimer: "신랑 측·신부 측 예산은 입력값을 바탕으로 단순 배분한 참고값입니다. 실제 부담 방식은 양가 협의에 따라 달라질 수 있습니다."
  };
}

function calculateHoneymoon(values: Values): CalculatorResult {
  const items = [
    item("flight", "항공권", n(values, "flight"), "교통/숙박", true),
    item("hotel", "숙박", n(values, "hotel"), "교통/숙박", true),
    item("localTransport", "현지 교통", n(values, "localTransport"), "교통/숙박"),
    item("food", "식비", n(values, "food"), "현지 비용"),
    item("activity", "관광/액티비티", n(values, "activity"), "현지 비용"),
    item("shopping", "쇼핑", n(values, "shopping"), "현지 비용"),
    item("insurance", "여행자보험", n(values, "insurance"), "준비 비용"),
    item("exchange", "환전", n(values, "exchange"), "준비 비용"),
    item("emergency", "비상금", n(values, "emergency"), "준비 비용")
  ];
  const total = totalOf(items);
  const people = Math.max(1, n(values, "people"));
  const days = Math.max(1, n(values, "days"));
  const perPerson = safeNumber(total / people);
  const perDay = safeNumber(total / days);
  const targetBudget = n(values, "targetBudget");

  return {
    primaryLabel: "신혼여행 총 비용",
    total,
    items,
    summary: [
      { label: "1인당 비용", value: formatCurrency(perPerson), description: `${formatNumber(people, "명")} 기준` },
      { label: "1일 평균 비용", value: formatCurrency(perDay), description: `${formatNumber(days, "일")} 기준` },
      { label: "예산 대비 초과/잔여", value: budgetComparison(total, targetBudget) },
      { label: "비상금 비중", value: `${calculatePercentage(n(values, "emergency"), total)}%` }
    ],
    advice: [
      "항공권과 숙박은 변동 폭이 크므로 예약 전후 금액을 따로 기록해두면 좋습니다.",
      "쇼핑 예산과 환전 예산은 중복 계산되지 않도록 사용 목적을 분리해 입력하세요.",
      "여행자보험과 비상금은 작은 금액처럼 보여도 돌발 상황에서 중요한 안전장치가 됩니다."
    ]
  };
}

function calculateCongratulatoryMoney(values: Values): CalculatorResult {
  const relation = s(values, "relation");
  const baseRanges: Record<string, [number, number]> = {
    family: [300000, 1000000],
    relative: [100000, 500000],
    "friend-close": [100000, 300000],
    friend: [50000, 100000],
    boss: [100000, 300000],
    coworker: [50000, 100000],
    client: [50000, 100000],
    acquaintance: [50000, 100000]
  };

  const relationLabel: Record<string, string> = {
    family: "가족",
    relative: "친척",
    "friend-close": "친한 친구",
    friend: "일반 친구",
    boss: "직장 상사",
    coworker: "직장 동료",
    client: "거래처",
    acquaintance: "지인"
  };

  let [min, max] = baseRanges[relation] || baseRanges.acquaintance;
  let factor = 1;

  const closeness = s(values, "closeness");
  if (closeness === "low") factor -= 0.15;
  if (closeness === "high") factor += 0.2;
  if (closeness === "very-high") factor += 0.35;

  const income = s(values, "income");
  if (income === "low") factor -= 0.1;
  if (income === "high") factor += 0.1;
  if (income === "very-high") factor += 0.2;

  const region = s(values, "region");
  if (region === "metro") factor += 0.05;
  if (region === "local") factor -= 0.05;

  min *= factor;
  max *= factor;

  if (b(values, "attendMeal")) {
    min += 10000;
    max += 20000;
  }

  if (b(values, "withCompanion")) {
    min += 30000;
    max += 50000;
  }

  let recommended = (min + max) / 2;

  if (b(values, "receivedBefore") && n(values, "receivedAmount") > 0) {
    recommended = Math.max(recommended, n(values, "receivedAmount"));
    min = Math.max(min, n(values, "receivedAmount") * 0.8);
    max = Math.max(max, n(values, "receivedAmount") * 1.2);
  }

  const roundedMin = Math.max(30000, roundToUnit(min, 10000));
  const roundedRecommended = Math.max(50000, roundToUnit(recommended, 10000));
  const roundedMax = Math.max(roundedRecommended, roundToUnit(max, 10000));

  return {
    primaryLabel: "일반 추천 축의금",
    total: roundedRecommended,
    items: [
      item("min", "최소 추천 금액", roundedMin, "추천 범위"),
      item("recommended", "일반 추천 금액", roundedRecommended, "추천 범위"),
      item("generous", "여유 있을 때 추천 금액", roundedMax, "추천 범위")
    ],
    summary: [
      { label: "추천 축의금 범위", value: `${formatCurrency(roundedMin)} ~ ${formatCurrency(roundedMax)}` },
      { label: "최소 추천 금액", value: formatCurrency(roundedMin) },
      { label: "일반 추천 금액", value: formatCurrency(roundedRecommended) },
      { label: "여유 있을 때 추천 금액", value: formatCurrency(roundedMax) },
      { label: "관계별 안내", value: `${relationLabel[relation] || "지인"} 기준의 참고 범위입니다.` }
    ],
    advice: [
      "식사에 참석하거나 동반자와 함께 참석한다면 상대방의 식대 부담을 고려해 금액을 조정할 수 있습니다.",
      "과거에 받은 축의금이 있다면 받은 금액과 비슷하거나 조금 높은 수준을 참고하는 것이 무난합니다.",
      "무리해서 큰 금액을 내기보다 관계와 본인의 재정 상황에 맞게 정하는 것이 가장 중요합니다."
    ],
    disclaimer: "추천 축의금은 참고용입니다. 실제 금액은 관계, 지역, 개인 사정에 따라 달라질 수 있습니다."
  };
}
